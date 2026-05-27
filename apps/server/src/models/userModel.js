import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String, // "admin" | "reader" | "user"
      default: "user",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
