const express = require("express");
const dotenv = require("dotenv");
const socket = require("socket.io");
const http = require("http");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const channelRoutes = require("./routes/channelRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Passport = require("./middlewares/passport");

const Message = require("./models/Message.model");
const User = require("./models/User.model");
const app = express();
dotenv.config({ path: "./config.env" });
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("connected DB")
);
// MiddleWares
app.use(express.json());
const ses = {
  name: "users",
  secret: "4314134115151513513",
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 120 * 120 * 1000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
};

app.use(session(ses));
app.use(passport.initialize());
app.use(passport.session());
Passport.init(passport);

//Routes
app.use("/users", userRoutes);
app.use("/channels", channelRoutes);
app.use("/messages", messageRoutes);
const server = http.createServer(app);
// SOCKET
const io = socket(server, { pingTimeout: 6000000, pingInterval: 30000 });
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
//SOCKET MIDDLEWARE
io.use(wrap(session(ses)));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});
// SOCKET CONNECTION
let users = {};
let offlineUsers = [];

io.on("connection", (socket) => {
  offlineUsers = offlineUsers.filter(
    (user) => user.username !== socket.request.user.username
  );
  offlineUsers.forEach((user) => {
    socket.emit("offline", user);
  });
  // SETTING USER TO SOCKET //
  users[socket.request.user.username] = socket.id;
  io.emit("online", Object.keys(users));
  // LISTENING PRIVATE MESSAGE //
  socket.on("private-message", async (data) => {
    // GRABBING RECEIVER SOCKET_ID FROM USERS //
    const receiverId = users[data.receiver];
    // SAVE MESSAGE TO DATABASE //
    const message = await Message.create({
      content: data.content,
      owner: data.owner,
      receiver: data.receiver,
    });
    // SEND PRIVATE MESSAGE //
    io.to(receiverId).emit("new-message", message);
    socket.emit("new-message", message);

    // ADDING CHANNELS TO USERS //
    const receiver = await User.findOne({ username: data.receiver }).lean();
    if (!receiver.channels) {
      receiver.channels = [];
    }
    // ADDING CHANNELS TO RECEIVER //
    const owner = await User.findOne({ username: data.owner }).lean();
    if (!owner.channels) {
      owner.channels = [];
    }

    if (
      !owner.channels.some((channel) => channel.username === receiver.username)
    ) {
      // Send this socket a new user message //
      await User.findByIdAndUpdate(
        { _id: socket.request.user._id },
        {
          $push: { channels: receiver },
        }
      );

      io.to(receiverId).emit("new-user", owner);
      socket.emit("new-user", receiver);
    }
    if (
      !receiver.channels.some((channel) => channel.username === owner.username)
    ) {
      await User.findByIdAndUpdate(
        { _id: receiver._id },
        {
          $push: { channels: owner },
        }
      );
    }
  });

  // TYPING EVENT //

  socket.on("typing", (data) => {
    const receiverId = users[data];
    io.to(receiverId).emit("typing", socket.request.user.username);
  });

  socket.on("notTyping", (data) => {
    const receiverId = users[data];

    io.to(receiverId).emit("notTyping", socket.request.user.username);
  });

  // VIDEO CALL SOCKET //
  socket.on("callUser", (data) => {
    const receiverId = users[data.userToCall];
    io.to(receiverId).emit("hey", {
      signal: data.signalData,
      from: socket.request.user.username,
    });
  });

  socket.on("acceptCall", (data) => {
    const myID = users[data.to];
    io.to(myID).emit("callAccepted", data.signal);
  });

  socket.on("leavingVoiceChat", () => {
    socket.broadcast.emit("leavingVoiceChat");
  });

  socket.on("disconnect", (reason) => {
    const time = Date.now();
    delete users[socket.request.user.username];
    offlineUsers.push({ username: socket.request.user.username, time });
    console.log("called");
    socket.broadcast.emit("offline", {
      username: socket.request.user.username,
      time,
    });
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
server.listen(5000, () => console.log("server running"));
