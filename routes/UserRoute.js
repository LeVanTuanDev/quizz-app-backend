// routes/userRoutes.js
const {
  Login,
  Register,
  getAllUsers,
} = require("../controllers/UserController.js");

const router = require("express").Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/get-all-users", getAllUsers);

module.exports = router;
