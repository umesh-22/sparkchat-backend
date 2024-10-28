const express = require("express");
const mongoose = require("./db");
const app = express();

require("dotenv").config();

const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URI, "https://spark-chat-2024.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Spark-Chat API Connected...", status: true });
});

app.use("/uploads/files", express.static("uploads/files"));

const authRoutes = require("./routes/auth.js");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/user.js");
app.use("/api/user", userRoutes);
const contactRoutes = require("./routes/contact.js");
app.use("/api/contact", contactRoutes);
const chatRoutes = require("./routes/chat.js");
app.use("/api/chat", chatRoutes);

const setUpSocket = require("./socket.js");
const { generateOTP } = require("./controller/auth.js");

let port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

setUpSocket(server);
// console.log(generateOTP())
