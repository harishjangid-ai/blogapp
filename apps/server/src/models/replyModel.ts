import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    commentId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Comment",
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    reply: {
        type: String,
        required: true,
    },
  },
  { timestamps: true },
);

const Reply = mongoose.model("Reply", replySchema);
export default Reply;
