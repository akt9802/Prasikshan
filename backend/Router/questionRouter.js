const express = require("express");
const questionRouter = express.Router();


// model import 
const Question = require("../Model/Question"); 

questionRouter.get("/fivequestions", async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching random questions:", err);
    res.status(500).json({ error: "Failed to fetch random questions" });
  }
});

questionRouter.get("/tenquestions", async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching random questions:", err);
    res.status(500).json({ error: "Failed to fetch random questions" });
  }
});

module.exports = questionRouter;
