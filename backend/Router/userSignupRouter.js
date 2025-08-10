const express = require("express");
const bcrypt = require("bcrypt");
const user = require("../Model/User.js");

const userSignupRouter = express.Router();

userSignupRouter.get("/check", (req, res) => {
  res.json({
    message: "response is good",
  });
});

userSignupRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      // if user allready exists
      return res.status(400).json({
        message: "User allready exists !!",
      });
    }

    // hash the password now
    const hashedPassword = await bcrypt.hash(password, 10);

    // now lets create a new user
    const newUser = new user({
      name,
      email,
      password: hashedPassword,
    });

    // saving new user to database
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error during user signup: ", error);
    res.status(200).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = userSignupRouter;
