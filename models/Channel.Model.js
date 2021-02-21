const mongoose = require("mongoose");
const { generateFromString } = require("generate-avatar");
const channelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Channel must have name"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Channel must have username"],
    },
    descriptions: {
      type: String,
      default: "Channel created on" + Date.now(),
    },
    channel_icon: {
      type: String,
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    members: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

channelSchema.pre("save", function (next) {
  if (this.isModified("channel_icon")) return next();
  this.channel_icon = generateFromString(this.username);
  next();
});

module.exports = User = mongoose.model("Channel", channelSchema);
