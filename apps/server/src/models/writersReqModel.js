import mongoose from "mongoose";

const writersReqSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reqStatus: {
      type: String, //"pending" | "approved" | "rejected"
      default: "pending",
    },
  },
  { timestamps: true },
);

const WriterRequest = mongoose.model("Request", writersReqSchema);
export default WriterRequest;
