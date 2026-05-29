import Report from "../models/reportsModel.js";
import Blog from "../models/blogModel.js";
import Like from "../models/likesModel.js";

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
    return res.json({ success: true, message: "Reported" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportStatus: "pending" })
      .populate("userId", "fullName _id")
      .populate({
        path: "blogId",
        select: "_id title description likeCount userId",
        populate: {
          path: "userId",
          select: "_id fullName",
        },
      });

    const formattedReports = reports.map((report) => ({
      _id: report._id,

      blog: {
        _id: report.blogId?._id,
        title: report.blogId?.title,
        description: report.blogId?.description,
        likeCount: report.blogId?.likeCount,

        user: {
          _id: report.blogId?.userId?._id,
          fullName: report.blogId?.userId?.fullName,
        },
      },

      reportedBy: report.userId,

      reason: report.reason,
      reportStatus: report.reportStatus,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));

    return res.json(formattedReports);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId, status } = req.body;
    if (!reportId || !status) {
      return res.json({ success: false, error: "All fields are required" });
    }
    const report = await Report.findById(reportId);
    if (!report) {
      return res.json({ success: false, error: "Report not found" });
    }

    if(status==="approved"){
      await Blog.findByIdAndDelete(report.blogId);
      await Like.deleteMany({blogId: report.blogId})
      await Report.findByIdAndUpdate(reportId, {reportStatus: "approved"})
      return res.json({success: true, message: "Report approved and blog deleted"})
    }

    if(status === "rejected"){
      await Report.findByIdAndUpdate(reportId, {reportStatus: "rejected"})
      return res.json({success: true, message: "Report rejected"})
    }

    return res.json({success: false, error: "Please send status first"})
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};
