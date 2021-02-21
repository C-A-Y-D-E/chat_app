const mongoose = require("mongoose");
const toonavatar = require("cartoon-avatar");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username must"],
      lowercase: true,
      unique: [true, "This username already exists"],
    },
    email: {
      type: String,
      required: [true, "User must have a email"],
      lowercase: true,
      unique: [true, "This email already exists"],
    },
    name: {
      type: String,
      lowercase: true,
    },
    password: {
      select: false,
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password must be greater than 8"],
    },

    avatar: {
      type: String,
      default: toonavatar.generate_avatar({ gender: "male" }),
    },
    confirmPassword: {
      type: String,
      required: [true, "Please Confirm Your Password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        messages: "Confirm Password Must Be same as Password",
      },
    },
    channels: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
module.exports = User = mongoose.model("User", userSchema);
