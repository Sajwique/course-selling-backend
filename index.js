const express = require("express");
const mongoose = require("mongoose");

const { courseRouter } = require("./routes/courseRoutes.js");
const { userRouter } = require("./routes/userRoutes.js");
const { adminRouter } = require("./routes/adminRoutes.js");
const { rateLimit } = require("express-rate-limit");
const { checkToken } = require("./middleware/checkToken.js");

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// app.use(limiter);
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("working fine");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", adminRouter);
app.use(checkToken);
app.use("/api/v1", courseRouter);

app.listen(3000, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connect successfully");
  } catch (e) {
    console.log(e.message);
  }
});
