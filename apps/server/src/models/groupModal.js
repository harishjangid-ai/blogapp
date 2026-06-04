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
    }
  },
  { timestamps: true },
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
