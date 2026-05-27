import Report from "../models/reportsModel.js";

export const reportBlog = async (req, res) => {
  try {
    const { blogId, reason } = req.body;
    const userId = req.user.userId;
    if (!blogId || !userId || !reason) {
      return res.json({ success: false, error: "All fields are required" });
    }
    const report = await Report.create({
      userId,
      reason,
      blogId,
      reportStatus: "pending",
    });
    return res.json({success: true, message: "Reported"})
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

