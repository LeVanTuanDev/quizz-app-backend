const {
  Login,
  Register,
  getAllUsers,
  changePassword,
  deleteUser,
  GetUserById,
} = require("../controllers/UserController.js");

const router = require("express").Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/", getAllUsers);
router.get("/:id", GetUserById);
router.put("/change-password/:username", changePassword);
router.delete("/delete-user/:username", deleteUser);

module.exports = router;
