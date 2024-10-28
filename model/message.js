const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileURL: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },

  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("messages", messageSchema);
module.exports = Message;
