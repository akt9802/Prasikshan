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
      origin: "http://localhost:5173", 
      credentials: true,
    })
  );
}

// Router import
const questionRouter = require("./Router/questionRouter.js");
app.use("/question", questionRouter);
const oirQuestionRouter = require("./Router/oirQuestionRouter.js");
app.use("/alltest", oirQuestionRouter);
const ppdtQuestionRouter = require("./Router/ppdtQuestionRouter.js");
app.use("/alltest", ppdtQuestionRouter);
const watQuestionRouter = require("./Router/watQuestionRouter.js");
app.use("/alltest", watQuestionRouter);
const srtQuestionRouter = require("./Router/srtQuestionRouter.js");
app.use("/alltest", srtQuestionRouter);
const lecturetteRouter = require("./Router/lecturetteRouter.js");
app.use("/alltest", lecturetteRouter);
const piRouter = require("./Router/piRouter.js");
app.use("/alltest", piRouter);
const tatRouter = require("./Router/tatRouter.js");
app.use("/alltest", tatRouter);
const supportRouter = require("./Router/supporterRouter.js");
app.use("/support", supportRouter);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
  
} else {
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
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

main();
