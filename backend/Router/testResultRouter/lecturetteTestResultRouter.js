const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../Model/User.js");

const lecturetteTestResultRouter = express.Router();

// Middleware to verify JWT and extract userId
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = payload.userId;
    if (!req.userId) {
      console.error("JWT payload missing userId:", payload);
      return res.status(403).json({ message: "Invalid token payload" });
    }
    next();
  });
}

lecturetteTestResultRouter.post(
  "/addLecturetteTestResult",
  authenticateToken,
  async (req, res) => {
    try {
      const { testName, score, timeTaken, dateTaken } = req.body;
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found !!",
        });
      }

      const testRecord = {
        testName,
        score,
        timeTaken,
        dateTaken,
      };

      user.testsTaken.push(testRecord);
      await user.save();

      res.status(200).json({
        message: "Lecturette test result added successfully !!",
        user,
      });
    } catch (error) {
      console.error("Error adding Lecturette test result : ", error);
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  }
);

module.exports = lecturetteTestResultRouter;
