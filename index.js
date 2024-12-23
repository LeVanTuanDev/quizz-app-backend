require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index.js");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const cors = require("cors");

app.use(
  cors({
    // origin: "*",
    origin: ["https://quizz-app-vuejs.vercel.app"], // Thay bằng URL frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
