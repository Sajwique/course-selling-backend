const { Router } = require("express");
const {
  adminSignup,
  adminSignin,
  updateProfile,
} = require("../controller/adminController");
const { checkTokenMiddleware } = require("../middleware/checkToken");

const adminRouter = Router();

adminRouter.post("/admin/signup", adminSignup);
adminRouter.post("/admin/signin", adminSignin);
adminRouter.post("/admin/profile", checkTokenMiddleware, updateProfile);

module.exports = {
  adminRouter: adminRouter,
};
