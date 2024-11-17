const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt"); // Để mã hóa mật khẩu
const jwt = require("jsonwebtoken"); // Để tạo token

const userControllers = {
  Register: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: "Đăng ký tài khoản thành công", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  Login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({ message: "Đăng nhập thành công", token });
      } else {
        res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
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

  changePassword: async (req, res) => {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mật khẩu cũ không đúng." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Đổi mật khẩu thành công." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  },

  deleteUser: async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOneAndDelete({ username });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      res.status(200).json({ message: "Xóa tài khoản thành công." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  },
};

module.exports = userControllers;
