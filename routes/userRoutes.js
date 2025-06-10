const { Router } = require("express");
const {
  signup,
  signin,
  checkUserPurchaseCourse,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controller/userController.js");

const { checkTokenMiddleware } = require("../middleware/checkToken.js");

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/logout", logout);

userRouter.post("/verify-email", verifyEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.post("/profile", signin);
userRouter.post("/user/course", checkTokenMiddleware, checkUserPurchaseCourse);

module.exports = {
  userRouter: userRouter,
};
