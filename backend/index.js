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
// if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: ["https://prasikshan.vercel.app","http://localhost:5173"],
      credentials: true,
    })
  );
// }

// Router import
// OIR ROUTER
const questionRouter = require("./Router/questionRouter.js");
app.use("/question", questionRouter);
const oirQuestionRouter = require("./Router/oirQuestionRouter.js");
app.use("/alltest/oir", oirQuestionRouter);

// app.use("/alltest", oirQuestionRouter);
const oirTestResultRouter = require("./Router/testResultRouter/oirTestResultRouter.js");
app.use("/v1", oirTestResultRouter);

// PPDT ROUTER
const ppdtQuestionRouter = require("./Router/ppdtQuestionRouter.js");
app.use("/alltest/ppdt", ppdtQuestionRouter);
const ppdtTestResultRouter = require("./Router/testResultRouter/ppdtTestResultRouter.js");
app.use("/v1", ppdtTestResultRouter);

// WAT ROUTER
const watQuestionRouter = require("./Router/watQuestionRouter.js");
app.use("/alltest/wat", watQuestionRouter);
const watTestResultRouter = require("./Router/testResultRouter/watTestResultRouter.js");
app.use("/v1", watTestResultRouter);

const srtQuestionRouter = require("./Router/srtQuestionRouter.js");
app.use("/alltest/srt", srtQuestionRouter);

const lecturetteRouter = require("./Router/lecturetteRouter.js");
app.use("/alltest/lecturette", lecturetteRouter);

const piRouter = require("./Router/piRouter.js");
app.use("/alltest/pi", piRouter);

// TAT ROUTER
const tatRouter = require("./Router/tatRouter.js");
app.use("/alltest/tat", tatRouter);
const tatTestResultRouter = require("./Router/testResultRouter/tatTestResultRouter.js");
app.use("/v1", tatTestResultRouter);

const supportRouter = require("./Router/supporterRouter.js");
app.use("/support", supportRouter);

const userSignupRouter = require('./Router/userSignupRouter.js');
app.use('/v1',userSignupRouter);

const userSigninRouter = require('./Router/userSigninRouter.js');
app.use('/v1',userSigninRouter)

const userDetailsRouter = require('./Router/userDetails.js');
app.use("/v1", userDetailsRouter);




// // Serve React build in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));

//   app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
//   });


// } else {
app.get("/", (req, res) => {
  res.json({ message: "App is running fine (DEV)" });
});
// }

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
