const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
    },
    courseDescription: {
      type: String,
    },
    courseBannerImage: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    course_rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    chapters: [
      {
        title: String,
        description: String,
        access_setting: {
          type: Boolean,
          default: false,
        },
        chapter_video: String,
        chapter_resource_and_attachment: [String],
      },
    ],
    courseReview: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: String,
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = {
  CourseModel: CourseModel,
};
