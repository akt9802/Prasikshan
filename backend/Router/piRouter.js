const express = require("express");
const piQuestionRouter = express.Router();
const PIQuestion = require("../Model/PIQuestion.js");

// GET all 30 PI questions
piQuestionRouter.get("/displaypiquestions", async (req, res) => {
  try {
    const questions = await PIQuestion.find({}).sort({ question_id: 1 }); 
    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "No PI questions found" });
    }
    res.json(questions);
  } catch (err) {
    console.error("Error fetching PI questions:", err);
    res.status(500).json({ error: "Failed to fetch PI questions" });
  }
});

module.exports = piQuestionRouter;
