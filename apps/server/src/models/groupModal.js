import mongoose, { Schema } from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    groupName: {
      type: String,
      required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
