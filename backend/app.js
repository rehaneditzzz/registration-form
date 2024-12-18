const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/students");

// Schema and Model
const studentSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  address: String,
  phone: String,
  dob: String,
  placeOfBirth: String,
  photo: String,
});

const Student = mongoose.model("Student", studentSchema);

// Serve static files (uploaded photos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// API Endpoint
app.post("/form", upload.single("photo"), async (req, res) => {
  try {
    const { firstname, lastname, email, address, phone, dob, placeOfBirth } = req.body;

    const student = new Student({
      firstname,
      lastname,
      email,
      address,
      phone,
      dob,
      placeOfBirth,
      photo: req.file.filename, // Save photo file name
    });

    await student.save();
    res.status(200).json({ message: "Student added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving student data" });
  }
});

// Server Start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
