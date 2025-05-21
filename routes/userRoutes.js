const { Router } = require("express");
const {
  signup,
  signin,
  checkUserPurchaseCouse,
} = require("../controller/userController.js");

const { checkToken } = require("../middleware/checkToken.js");

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/user/course", checkToken, checkUserPurchaseCouse);

module.exports = {
  userRouter: userRouter,
};
