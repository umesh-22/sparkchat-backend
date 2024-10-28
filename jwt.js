const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "1d" });
  } catch (error) {
    throw new Error("Error generating token");
  }
};

const decodeToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    return decodedToken.userId;
  } catch (error) {
    throw new Error("Invalid Token");
  }
};

module.exports = { generateToken, decodeToken };
