const express = require("express");
const authenticate = require("../middleware");

const {
  getMessages,
  uploadFile,
  deleteMessages,
} = require("../controller/chat");

const multer = require("multer");
const upload = multer({ dest: "uploads/files" });

const router = express.Router();

router.post("/get-messages", authenticate, getMessages);
router.delete("/delete-messages", authenticate, deleteMessages);
router.post("/upload-file", authenticate, upload.single("file"), uploadFile);

module.exports = router;
