const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

// Enable JSON parsing
app.use(express.json());

// Allow CORS only in development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173", // React dev server
      credentials: true,
    })
  );
}

// Router import
const questionRouter = require("./Router/questionRouter.js");
app.use("/question", questionRouter);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
} else {
  // Development test route
  app.get("/", (req, res) => {
    res.json({ message: "App is running fine (DEV)" });
  });
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`App is running at PORT: ${PORT}`);
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

main();
