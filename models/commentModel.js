const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course.chapters",
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reactions: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["like", "love", "laugh", "sad"] },
        reactedAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexing
commentSchema.index({ course_id: 1 });
commentSchema.index({ chapter_id: 1 });
commentSchema.index({ parent_comment_id: 1 });

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = {
  CommentModel: CommentModel,
};
