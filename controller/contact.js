const validator = require("validator");
const User = require("../model/user");
const { default: mongoose } = require("mongoose");
const Message = require("../model/message");

const searchContact = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    // console.log(req.body);

    if (!searchTerm) {
      return res
        .status(400)
        .send({ message: "Search Contact name is required" });
    }

    const sanitizedTerm = validator.escape(searchTerm.trim());

    const contacts = await User.find({
      _id: { $ne: req.userId },
      $or: [
        { name: { $regex: sanitizedTerm, $options: "i" } },
        // { email: { $regex: sanitizedTerm, $options: "i" } },
        { username: { $regex: sanitizedTerm, $options: "i" } },
      ],
    });

    return res
      .status(200)
      .send({ contacts, message: "Contacts fetched successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const getContacts = async (req, res) => {
  try {
    let userId = req.userId;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [
            {
              sender: userId,
            },
            {
              recipient: userId,
            },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: {
                $eq: ["$sender", userId],
              },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          email: "$contactInfo.email",
          name: "$contactInfo.name",
          username: "$contactInfo.username",
          profileImage: "$contactInfo.profileImage",
          userBio: "$contactInfo.userBio",
          lastMessageTime: 1,
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
        },
      },
    ]);

    return res
      .status(200)
      .send({ contacts, message: "Contacts fetched successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { searchContact, getContacts };
