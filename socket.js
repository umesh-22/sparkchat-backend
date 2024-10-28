const { Server } = require("socket.io");
const Message = require("./model/message");

require("dotenv").config();
const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URI,"https://spark-chat-2024.vercel.app" ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    // console.log(`Client disconnected ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    // console.log(message);
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender")
      .populate("recipient");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    // console.log("Client connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
    //   console.log(`User connected ${userId} with socket id ${socket.id}`);
    } else {
      console.log("No User Id");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = setUpSocket;
