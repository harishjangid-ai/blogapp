import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Blog",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model("Comment", commentsSchema);
export default Comment;
