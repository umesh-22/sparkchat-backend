const Message = require("../model/message");

const multer = require("multer");
const { mkdirSync, renameSync } = require("fs");

const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.Id;
    //    console.log(user1, user2);
    if (!user1 || !user2) {
      return res.status(400).send({ message: "Users are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res
      .status(200)
      .send({ messages, message: "Messages fetched successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const deleteMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.Id;
    // console.log(user1, user2);
    if (!user1 || !user2) {
      return res.status(400).send({ message: "Users are required" });
    }

    await Message.deleteMany({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    });

    return res.status(200).send({ message: "Chat delete successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "no file uploaded" });
    }
    // console.log(req.body);
    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res
      .status(200)
      .json({ filePath: fileName, message: " file uploaded" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, uploadFile, deleteMessages };
