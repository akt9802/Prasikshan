const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");

const userDetailsRouter = express.Router();

userDetailsRouter.get("/userdetails", async (req, res) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      testsTaken: user.testsTaken.length, 
      improvements: user.improvements || 0, 
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userDetailsRouter;
