const mongoose = require("mongoose");

const srtquestionSchema = new mongoose.Schema({
  situation_id: {
    type: Number,
    required: true,
  },
  situation: {
    type: String,
    required: true,
  },
  sample_reaction: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SRT", srtquestionSchema, "SRT");
