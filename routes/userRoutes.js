const router = require("express").Router();
const passport = require("passport");
const { signUp, checkAuth } = require("../controllers/authController");
const { getAllUsers, getChannels } = require("../controllers/userController");
router.post("/", signUp);
router.post("/login", passport.authenticate("local"), function (req, res) {
  res.status(200).json({
    success: "OK",
    data: req.user,
  });
});

router.get("/authenticate", checkAuth);
router.get("/", getAllUsers);
router.get("/channels", getChannels);

module.exports = router;
