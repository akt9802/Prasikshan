const express = require("express");
const ppdtQuestionRouter = express.Router();

const PPDTQuestion = require("../Model/PPDTQuestion.js");

let currentId = 1; // Start from _id = 1
const MAX_ID = 15; // Total PPDT questions

// ✅ Helper to convert Google Drive link to direct image URL
const convertDriveLink = (url) => {
  const match = url.match(/\/d\/([^/]+)\//);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url; // fallback if not Google Drive link
};

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

    // ✅ Fix image link before sending to frontend
    const fixedQuestion = {
      ...question._doc, // Spread document fields
      image: convertDriveLink(question.image),
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
