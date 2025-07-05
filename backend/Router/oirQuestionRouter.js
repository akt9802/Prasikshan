const express = require("express");
const oirQuestionRouter = express.Router();

const OirQuestion = require("../Model/OirQuestion.js");


oirQuestionRouter.get("/oir/displayoirquestions", async (req, res) => {
  try {
    const questions = await OirQuestion.aggregate([{ $sample: { size: 40 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching OIR questions:", err);
    res.status(500).json({ error: "Failed to fetch OIR questions" });
  }
});

module.exports = oirQuestionRouter;
