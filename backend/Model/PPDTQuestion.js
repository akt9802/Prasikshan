// this is PPDT mode 
const mongoose = require("mongoose");

const ppdtQuestionSchema = new mongoose.Schema({
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
  "PPDT",
  ppdtQuestionSchema,
  "PPDT"    // actual collection name in database 
);
