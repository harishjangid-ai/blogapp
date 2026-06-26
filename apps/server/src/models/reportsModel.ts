import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema(
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
    reason: {
      type: String,
      required: true,
    },
    reportStatus: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

const Report = mongoose.model("Report", reportsSchema);
export default Report;
