const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { courseRouter } = require("./routes/courseRoutes.js");
const { userRouter } = require("./routes/userRoutes.js");
const { adminRouter } = require("./routes/adminRoutes.js");
const { rateLimit } = require("express-rate-limit");
const { checkTokenMiddleware } = require("./middleware/checkToken.js");

const app = express();

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// app.use(limiter);

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("working fine");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", adminRouter);
app.use(checkTokenMiddleware);
app.use("/api/v1", courseRouter);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected successfully");
    console.log(`Server listening on port ${PORT}`);
  } catch (e) {
    console.error("DB connection error:", e.message);
  }
});
