const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { UserModel } = require("../models/userModel");
const {
  sendVerificationEmail,
  welcomeEmail,
  passwordReSetEmail,
  resetSuccessEmail,
} = require("../service/email/emails");
const {
  generateTokenAndSetCookies,
} = require("../utils/generateTokenAndSetCookies");

const reqSchema = z.object({
  email: z
    .string()
    .email()
    .regex(
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
    ),
  password: z.string().min(6),
});

const signup = async (req, res) => {
  try {
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
      res.status(409).json({
        message: "user already exits",
      });
      return;
    }

    console.log("SALT_ROUND", process.env.SALT_ROUND);

    const hashPassword = await bcrypt.hash(
      reqData.data.password,
      Number(process.env.SALT_ROUND)
    );
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new UserModel({
      email: reqData.data.email,
      password: hashPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();

    console.log("user", user);
    generateTokenAndSetCookies(res, user._id);

    //verfication email sent to user
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    console.log("code", code);
    const isUser = await UserModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    console.log("isUser", isUser);
    if (!isUser) {
      res.status(400).json({
        success: true,
        message: "Invalid or expired verification code",
      });
      return;
    }

    isUser.isVerified = true;
    isUser.verificationToken = undefined;
    isUser.verificationTokenExpiresAt = undefined;

    await isUser.save();

    await welcomeEmail(isUser.email, isUser.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...isUser._doc,
        password: undefined,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const signin = async (req, res) => {
  try {
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
        message: "Invalid credentials",
      });
      return;
    }
    generateTokenAndSetCookies(res, isUserPresent._id);
    isUserPresent.lastLogin = new Date();
    await isUserPresent.save();

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: isUserPresent._id,
        email: isUserPresent.email,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const reqSchema = z.object({
    email: z
      .string()
      .email()
      .regex(
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
      ),
  });
  try {
    const userData = reqSchema.safeParse(req.body);

    if (!userData.success) {
      res.status(400).json({
        message: "Invalid Email",
      });
      return;
    }

    const { email } = userData.data;

    const isUser = await UserModel.findOne({ email: email });

    if (!isUser) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    isUser.resetPasswordToken = resetToken;
    isUser.resetPasswordExpiresAt = resetTokenExpiresAt;

    await isUser.save();

    await passwordReSetEmail(
      isUser.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      success: false,
      message: e.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const reqSchema = z.object({
      password: z.string(),
    });

    const token = req.params.token;
    console.log("token : ", token);
    const userData = reqSchema.safeParse(req.body);

    if (!userData.success & !token) {
      res.status(400).json({
        success: false,
        message: "Invalid password our token",
      });
      return;
    }

    const isUser = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!isUser) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
      return;
    }

    const { password } = userData.data;
    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );

    isUser.password = hashPassword;
    isUser.resetPasswordToken = undefined;
    isUser.resetPasswordExpiresAt = undefined;

    await isUser.save();

    await resetSuccessEmail(isUser.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      success: false,
      message: e.message,
    });
  }
};

const userProfileUpdate = async (req, res) => {
  try {
    const updateProfileSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      bio: z.string().optional(),
      address: z.string().optional(),
      profileURL: z.string().optional(),
    });

    const updateProfileReqData = updateProfileSchema.safeParse(req.body);

    if (!updateProfileReqData.success) {
      res.status(400).json({
        message: "Invalid profile data",
      });
      return;
    }

    const email = req.body.custome_data;

    await UserModel.findOneAndUpdate(
      { email: email },
      updateProfileReqData.data,
      { upsert: true }
    );
    res.status(200).json({
      message: "user profile update successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

const checkUserPurchaseCourse = async (req, res) => {
  try {
    const userEmail = req.body.custome_data;
    res.json({
      message: "padding routes",
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
  verifyEmail: verifyEmail,
  logout: logout,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  checkUserPurchaseCourse: checkUserPurchaseCourse,
};
