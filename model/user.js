const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    userBio: { type: String, default: "Hey there! Using Spark" },
    profileSetup: { type: Boolean, default: false },

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
