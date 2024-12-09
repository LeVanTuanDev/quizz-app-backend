const {
  Login,
  Register,
  getAllUsers,
  changePassword,
  deleteUser,
  GetUserByUsername,
} = require("../controllers/UserController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = require("express").Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/", getAllUsers);
router.get("/username", authenticateToken, GetUserByUsername);
router.put("/change-password/:username", changePassword);
router.delete("/delete-user/:username", deleteUser);

module.exports = router;
