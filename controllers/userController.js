const AsynCatch = require("../utils/AsynCatch");
const User = require("../models/User.model");
const { getAll } = require("./handleFactory");
exports.getAllUsers = getAll(User);

exports.getChannels = AsynCatch(async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ status: "fail" });
  }
  const users = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    channels: users.channels,
  });
});
