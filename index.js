/** @format */

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected!");
  } catch (error) {
    console.log("Error : " + error.message);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Api is running...");
});

app.get("/upload", (req, res) => {
  res.status(200).sendFile(__dirname + "/index.html");
});

app.post("/upload", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  try {
    const newUser = User.create({ name, img: req.file.filename });
    await newUser.save();
    res.status(200).send(`User is created successfully!`);
  } catch (error) {
    res.status(404).json(error);
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running at http://www.localhost:${PORT}`);
  await connectDB();
});
