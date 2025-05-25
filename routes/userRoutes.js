const { Router } = require("express");
const {
  signup,
  signin,
  checkUserPurchaseCouse,
} = require("../controller/userController.js");

const { checkTokenMiddleware } = require("../middleware/checkToken.js");

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/profile", signin);
userRouter.post("/user/course", checkTokenMiddleware, checkUserPurchaseCouse);

module.exports = {
  userRouter: userRouter,
};
