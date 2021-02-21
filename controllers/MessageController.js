const AsynCatch = require("../utils/AsynCatch");
const Message = require("../models/Message.model");
const { getAll, create } = require("../controllers/handleFactory");

exports.getAll = getAll(Message);

exports.getByUsername = AsynCatch(async (req, res) => {
  const docs = await Message.find({
    $or: [
      {
        owner: { $eq: req.user.username },
        receiver: { $eq: req.params.receiver },
      },
      {
        receiver: { $eq: req.user.username },
        owner: { $eq: req.params.receiver },
      },
    ],
  }).sort("-createdAt");

  res.status(201).json({
    status: "Success",
    data: docs,
  });
});
exports.create = create(Message);
