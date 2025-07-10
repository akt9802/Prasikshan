// routes/support.js
const express = require("express");
const router = express.Router();
const Supporter = require("../Model/Supporter.js");

router.post("/register", async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    let supporter = await Supporter.findOne({ email });
    if (supporter) {
      return res.status(200).json({ message: "Already registered" });
    }

    supporter = new Supporter({ email });
    await supporter.save();

    const count = await Supporter.countDocuments();
    res.status(201).json({ message: "Thank you for supporting!", count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await Supporter.countDocuments(); 
    res.json({ count });
  } catch (err) {
    console.error("Error fetching supporter count:", err);
    res.status(500).json({ message: "Failed to fetch supporter count" });
  }
});


module.exports = router;
