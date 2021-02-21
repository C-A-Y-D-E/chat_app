const router = require("express").Router();
const {
  getAll,
  create,
  getByUsername,
} = require("../controllers/MessageController");
router.route("/").get(getAll).post(create);
router.get("/:receiver", getByUsername);

module.exports = router;
