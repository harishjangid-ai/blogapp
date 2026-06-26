import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    likeCount: {
      type: Number,
      require: true,
      default: 0
    },
    views: {
      type: Number,
      require: true,
      default: 0
    }
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
