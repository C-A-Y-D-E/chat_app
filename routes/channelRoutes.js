const router = require("express").Router();
const { getAll, create } = require("../controllers/ChannelController");
router.route("/").get(getAll).post(create);

module.exports = router;
