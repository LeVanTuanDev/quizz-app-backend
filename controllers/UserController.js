const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/auth.js");

const userControllers = {
  Register: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: "Register successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  Login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);
        res.json({ message: "Login successfully", token });
      } else {
        res.status(400).json({ error: "Incorrect username or password" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide old and new passwords." });
    }

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Users not found." });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password incorrect." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Change password successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Happened an error." });
    }
  },

  deleteUser: async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOneAndDelete({ username });
      if (!user) {
        return res.status(404).json({ message: "Users not found." });
      }

      res.status(200).json({ message: "Delete user successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error when deleting a user." });
    }
  },
};

module.exports = userControllers;
