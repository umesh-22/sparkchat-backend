const User = require("../model/user");

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    return res.status(200).send({ user, message: "User fetched successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const deleteProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profileImage: "" } },
      { new: true, runValidators: true }
    );

    return res.status(200).send({ message: "Profile deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }
    // console.log(req.body);
    const updateData = {
      ...req.body,
      profileSetup: true,
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return res
      .status(200)
      .send({ user: updatedUser, message: "User updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .send({ message: "User account deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { getUser, updateUser, deleteUser, deleteProfile };
