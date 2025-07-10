const express = require("express");
const tatQuestionRouter = express.Router();

const TATQuestion = require("../Model/TATQuestion.js");

tatQuestionRouter.get("/displaytatquestions", async (req, res) => {
  try {
    const randomQuestions = await TATQuestion.aggregate([
      { $sample: { size: 12 } },
    ]);

    if (!randomQuestions || randomQuestions.length === 0) {
      console.warn("No TAT questions found in the database");
      return res.status(404).json({
        error: "No TAT questions found in the database",
      });
    }
    const fixedQuestions = randomQuestions.map((question) => ({
      ...question, // Spread document fields
      image: question.image, // Keep as-is
    }));

    res.json(fixedQuestions);
  } catch (err) {
    console.error("Error fetching TAT questions:", err);
    res.status(500).json({ error: "Failed to fetch TAT questions" });
  }
});

module.exports = tatQuestionRouter;
