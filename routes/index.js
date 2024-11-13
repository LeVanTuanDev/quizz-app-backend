const express = require("express");
const router = express.Router();

const userRoute = require("./UserRoute");

router.use("/user", userRoute);

module.exports = router;
