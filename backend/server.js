const port = 4000;
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const authRouter = require('./routes/authRouter');
const sessionRouter = require('./routes/sessionRouter');
const questionRouter = require('./routes/questionRouter');
const { generateConceptExplanation, generateInterviewQuestions } = require('./controllers/aiController');
const { protect } = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/questions", questionRouter);

// AI routes
app.post("/api/ai/generate_questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate_explanation", protect, generateConceptExplanation);

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on " + port);
  } else {
    console.log("Error: " + error);
  }
});
