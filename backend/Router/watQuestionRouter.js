const express = require("express");
const watQuestionRouter = express.Router();
const WATQuestion = require("../Model/WATQuestion.js");

watQuestionRouter.get("/wat/displaywatquestions", async (req, res) => {
  try {
    // Get 60 random WAT words
    const questions = await WATQuestion.aggregate([{ $sample: { size: 60 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching WAT questions:", err);
    res.status(500).json({ error: "Failed to fetch WAT questions" });
  }
});

module.exports = watQuestionRouter;
