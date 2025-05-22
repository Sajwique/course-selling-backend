const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AdminModel } = require("../models/adminModel");

const reqObject = z.object({
  email: z.string().email({ message: "please provide email" }),
  password: z
    .string()
    .min(6, { message: "please provide password atleast 6 words" }),
  isSuperAdmin: z.boolean().optional(),
});

const adminSignup = async (req, res) => {
  try {
    const reqData = reqObject.safeParse(req.body);

    if (!reqData.success) {
      res.status(411).json(reqData.error);
      return;
    }

    const { email, password } = reqData.data;

    const isAdminPresent = await AdminModel.findOne({ email: email });

    if (isAdminPresent) {
      res.status(200).json({
        message: "admin already present!",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );

    await AdminModel.insertOne({ email: email, password: hashPassword });
    res.json({
      message: "successfully create admin",
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({
      message: e.message,
    });
  }
};

const adminSignin = async (req, res) => {
  try {
    const reqData = reqObject.safeParse(req.body);

    if (!reqData.success) {
      res.status(411).json(reqData.error);
      return;
    }

    const { email, password } = reqData.data;

    const isAdminPresent = await AdminModel.findOne({ email: email });

    if (!isAdminPresent) {
      res.status(200).json({
        message: "please create signup first ! then sigin",
      });
      return;
    }

    const hashPassword = isAdminPresent.password;
    const decodePassword = await bcrypt.compare(password, hashPassword);

    if (!decodePassword) {
      res.status(403).json({
        message: "Invalid Credentials",
      });
      return;
    }

    const token = jwt.sign(
      { email: email, id: isAdminPresent._id },
      process.env.JWT_SECRET
    );
    res.send({
      message: "Signin Successfully",
      token: token,
    });
  } catch (e) {
    console.log(e);
    res.json(403).json({
      message: e.message,
      error: true,
    });
  }
};

module.exports = {
  adminSignup: adminSignup,
  adminSignin: adminSignin,
};
