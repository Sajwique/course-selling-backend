const express = require("express");
const { courseRouter } = require("./routes/courseRoutes.js");
const { userRouter } = require("./routes/userRoutes.js");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("working fine");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);

app.listen(3000, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connect successfully");
  } catch (e) {
    console.log(e.message);
  }
});
