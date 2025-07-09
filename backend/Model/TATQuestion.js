// this is PPDT mode 
const mongoose = require("mongoose");

const tatQuestionSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stories: [
    {
      title: {
        type: String,
        required: true,
      },
      narration: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model(
  "TAT",
  tatQuestionSchema,
  "TAT"    // actual collection name in database 
);
