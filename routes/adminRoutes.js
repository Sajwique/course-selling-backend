const { Router } = require("express");
const { adminSignup, adminSignin } = require("../controller/adminController");

const adminRouter = Router();

adminRouter.post("/admin/signup", adminSignup);

adminRouter.post("/admin/signin", adminSignin);

module.exports = {
  adminRouter: adminRouter,
};
