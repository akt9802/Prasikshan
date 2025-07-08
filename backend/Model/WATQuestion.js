const mongoose = require("mongoose");

const watquestionSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  sentences: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("WAT", watquestionSchema, "WAT");
