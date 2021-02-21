// const { app, sessionMiddleware } = require("./app");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const socket = require("socket.io");
// const http = require("http");
// const Channel = require("./models/Channel.Model");
// const User = require("./models/User.model");
// const sharedsession = require("express-socket.io-session");

// mongoose.connect(
//   process.env.DB_URL,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   },
//   () => console.log("connected DB")
// );

// io.use(
//   sharedsession(sessionMiddleware, {
//     autoSave: true,
//   })
// );
