const { Router } = require("express");
const { signup, signin } = require("../controller/userController.js");
const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/purchase", (req, res) => {
  res.json({
    message: "user signup endpoint",
  });
});

module.exports = {
  userRouter: userRouter,
};
