const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    bio: {
      type: String,
    },
    address: {
      type: String,
    },
    token: { type: String },
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
    // course_create: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Course",
    //   },
    // ],
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = {
  AdminModel: AdminModel,
};
