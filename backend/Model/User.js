const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  dateTaken: {
    type: Date,
    default: Date.now,
  },
  timeTaken: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  testsTaken: {
    type: [testSchema],
    default: [],
  },
  performanceData: {
    type: Array, 
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
