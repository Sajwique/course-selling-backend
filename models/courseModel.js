const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_title: {
      type: String,
      require: true,
    },
    course_description: {
      type: String,
    },
    course_banner_image: {
      type: String,
    },
    creater_name: {
      type: String,
    },
    course_rating: {
      type: String,
    },
    course_review: {
      //need to work linke comment box
      type: String,
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    course_tags: [String],
    price: {
      total_price: {
        type: Number,
      },
      discount_price: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = {
  CourseModel: CourseModel,
};
