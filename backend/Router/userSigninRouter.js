const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/User.js"); 

const userSigninRouter = express.Router();

userSigninRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }); 
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(200).json({
      message: "Sign-In successfully",
      token,
    });
  } catch (error) {
    console.error("Error during user sign-in:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = userSigninRouter;