const { generateToken } = require("../jwt");
const OTP = require("../model/otp");

const User = require("../model/user");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    // console.log("Server is ready to take messages");
  }
});

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

const sendOtpToMail = async (req, res) => {
  try {
    const { email, username } = req.body;
    const userEmailExist = await User.findOne({ email });
    const userNameExist = await User.findOne({ username });
    if (userEmailExist) {
      return res.status(400).send({ message: "User Email already exists" });
    }
    if (userNameExist) {
      return res.status(400).send({ message: "Username already exists" });
    }

   
    const otp = generateOTP();
    const otpExpiration = Date.now() + 5 * 60 * 1000; 

    const newOTP = new OTP({
      otp,
      otpExpiration,
    });

  const mailOptions = {
  from: process.env.APP_MAIL_ID,
  to: email,
  subject: "🚀 Your Spark Chat OTP Awaits!",
  html: `<p>Your gateway to Spark Chat! 🔑 Use this OTP: <strong>${otp}</strong> for verification. It's valid for just 5 minutes!</p>`
};


    await transporter.sendMail(mailOptions);

    await newOTP.save();

    return res
      .status(200)
      .send({ newOTP, message: "OTP sent to email successfully" });
  } catch (error) {
    // console.error("Error sending OTP:", error);
    return res.status(500).send({ error: error.message });
  }
};
const verifyOtp = async (req, res) => {
  const { otpId, otp } = req.body;
  console.log(req.body);

  try {
 
    const otpval = await OTP.findById(otpId);
    if (otpval.otp === otp && Date.now() < otpval.otpExpiration) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashPassword,
        verified: true,
      });
      await newUser.save();
      const token = generateToken(newUser._id);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 12 * 60 * 60 * 1000,
      });
      return res
        .status(201)
        .send({
          token,
          newUser,
          message: "Sign Up & OTP verified Successfull",
        });
    } else {
      
      
      return res.status(400).send({
        message: "Invalid or expired OTP. Please try again.",
      });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({
      $or: [
        { email: email },
        { username: email } 
      ]
    });
    if (!userExist) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid password" });
    }
    const token = generateToken(userExist._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.status(201).send({ token, userExist, message: "Sign In Successfull" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // console.log(req.body)
    const userEmailExist = await User.findOne({ email: email });
    const userNameExist = await User.findOne({ username: username });
    if (userEmailExist) {
      return res.status(400).send({ message: "User Email already exist" });
    }
    if (userNameExist) {
      return res.status(400).send({ message: "User Name already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email: email,
      password: hashPassword,
      username: username,
    });
    await user.save();
    // const result = await user.save();
    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60 * 1000,
    });
    return res
      .status(201)
      .send({ token, user, message: "Sign Up Successfull" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { signIn, signUp, logOut, sendOtpToMail, verifyOtp };
