const { z } = require("zod");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const reqSchema = z.object({
      email: z
        .string()
        .email()
        .regex(
          /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
        ),
      password: z.string().min(6),
    });

    const reqData = reqSchema.safeParse(req.body);

    if (!reqData.success) {
      res.status(403).json({
        message: reqData.error,
      });
      return;
    }

    const isUserPersent = await UserModel.findOne({
      email: reqData.data.email,
    });

    console.log("isUserPresent", isUserPersent);
    if (isUserPersent) {
      res.status(200).json({
        message: "user already exits",
      });
      return;
    }

    console.log("SALT_ROUND", process.env.SALT_ROUND);
    const hashPassword = await bcrypt.hash(
      reqData.data.password,
      Number(process.env.SALT_ROUND)
    );
    await UserModel.insertOne({
      email: reqData.data.email,
      password: hashPassword,
    });
    res.status(200).json({
      message: "user successfully register",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    const reqSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const reqData = reqSchema.safeParse(req.body);

    if (!reqData.success) {
      res.status(403).json({
        message: reqData.error,
      });
      return;
    }

    const isUserPresent = await UserModel.findOne({
      email: reqData.data.email,
    });

    if (!isUserPresent) {
      res.status(403).json({
        message: "please create account first. then signin",
      });
      return;
    }

    console.log("isUserPresent", isUserPresent);

    const hashPassword = isUserPresent.password;
    const decodePassword = await bcrypt.compare(
      reqData.data.password,
      hashPassword
    );

    if (!decodePassword) {
      res.status(403).json({
        message: "password invalid",
      });
      return;
    }

    const token = jwt.sign(
      {
        email: isUserPresent.email,
      },
      process.env.JWT_SECRET
      //   { expiresIn: 60 * 60 }
    );
    await UserModel.findOneAndUpdate(
      { email: reqData.data.email },
      { $set: { token: token } },
      { upsert: true }
    );
    res.status(200).json({
      message: "signin successfully",
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

const checkUserPurchaseCouse = async (req, res) => {
  try {
    res.json({
      message: "successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      message: e.message,
    });
  }
};

module.exports = {
  signup: signup,
  signin: signin,
  checkUserPurchaseCouse: checkUserPurchaseCouse,
};
