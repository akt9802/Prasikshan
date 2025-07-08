const mongoose = require("mongoose");

const piQuestionSchema = new mongoose.Schema({
  question_id: {
    type: Number,
    required: true,
    unique: true, 
  },
  question: {
    type: String,
    required: true,
  },
  expectation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "PI",
  piQuestionSchema,
  "PI" // database collection name
);
