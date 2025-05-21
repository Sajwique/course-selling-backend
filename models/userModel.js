const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    token: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_url: {
      type: String,
    },
    courses_purchase: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    transaction_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = {
  UserModel: UserModel,
};
