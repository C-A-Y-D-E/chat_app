const AsynCatch = require("../utils/AsynCatch");
const User = require("../models/User.model");
exports.signUp = AsynCatch(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  const user = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.checkAuth = AsynCatch(async (req, res, next) => {
  if (!req.isAuthenticated())
    return res.status(401).json({
      status: "success",
      message: "You are not logged in, login to get access",
    });
  res.status(200).json({
    status: "success",
    data: req.user,
  });
  next();
});
