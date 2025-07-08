const mongoose = require("mongoose");

const lecturetteQuestionSchema = new mongoose.Schema({
  topic_id: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  speech: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "LECTURETTE",
  lecturetteQuestionSchema,
  "LECTURETTE" // database collection 
);
