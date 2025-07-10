const express = require("express");
const srtQuestionRouter = express.Router();
const SRTQuestion = require("../Model/SRTQuestion.js");

// GET random 60 SRT situations
srtQuestionRouter.get("/displaysrtquestions", async (req, res) => {
  try {
    const questions = await SRTQuestion.aggregate([{ $sample: { size: 60 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching SRT questions:", err);
    res.status(500).json({ error: "Failed to fetch SRT questions" });
  }
});

module.exports = srtQuestionRouter;
