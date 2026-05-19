import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

const Like = mongoose.model("Like", likesSchema);
export default Like;
