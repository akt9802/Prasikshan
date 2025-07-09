const express = require("express");
const ppdtQuestionRouter = express.Router();

const PPDTQuestion = require("../Model/PPDTQuestion.js");

let currentId = 1; // Start from _id = 1
const MAX_ID = 15; // Total PPDT questions

ppdtQuestionRouter.get("/ppdt/displayppdtquestions", async (req, res) => {
  try {
    // 🔥 Find question by currentId
    const question = await PPDTQuestion.findOne({ _id: currentId });

    if (!question) {
      console.warn(`PPDT question with id ${currentId} not found`);
      return res.status(404).json({
        error: `PPDT question with id ${currentId} not found`,
      });
    }

    // ✅ No need to fix the image link if using GitHub raw or GitHub Pages
    const fixedQuestion = {
      ...question._doc, // Spread document fields
      image: question.image, // Keep as-is (GitHub link)
    };

    // Prepare for next call
    currentId++;
    if (currentId > MAX_ID) currentId = 1;

    res.json(fixedQuestion);
  } catch (err) {
    console.error("Error fetching PPDT question:", err);
    res.status(500).json({ error: "Failed to fetch PPDT question" });
  }
});

module.exports = ppdtQuestionRouter;
