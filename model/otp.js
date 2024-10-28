const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: { type: String },
  otpExpiration: { type: Date },
});

otpSchema.index({ otpExpiration: 1 }, { expireAfterSeconds: 300 });
otpSchema.index({ otp: 1 }, { expireAfterSeconds: 300 });

const OTP = mongoose.model("otp", otpSchema);
module.exports = OTP;
