const express = require("express");
const lecturetteQuestionRouter = express.Router();
const LecturetteQuestion = require("../Model/LECTURETTEQuestion.js");


let currentTopicId = 1;

lecturetteQuestionRouter.get(
  "/displaylecturettequestion",
  async (req, res) => {
    try {
      const topic = await LecturetteQuestion.findOne({
        topic_id: currentTopicId,
      });

      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      res.json(topic);

      currentTopicId = currentTopicId < 10 ? currentTopicId + 1 : 1;
    } catch (err) {
      console.error("Error fetching Lecturette topic:", err);
      res.status(500).json({ error: "Failed to fetch Lecturette topic" });
    }
  }
);

module.exports = lecturetteQuestionRouter;
