const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    content: {
      type: "String",
      trim: true,
      required: [true, "Message should not be empty"],
    },

    owner: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      // required: [true, "Message must belong to its owner"],
      type: String,
      required: [true, "Message must belong to its owner"],
    },
    receiver: {
      type: String,
      required: [true, "Message must belong to its owner"],
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      // required: [true, "Message must know were it belongs"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Message = mongoose.model("Message", messageSchema);
