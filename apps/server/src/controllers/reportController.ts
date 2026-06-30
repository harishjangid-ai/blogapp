import { Request, Response } from "express";
import Report from "../models/reportsModel.ts";
import Blog from "../models/blogModel.ts";
import Like from "../models/likesModel.ts";
import { AuthenticatedRequest } from "../types/RequestType.ts";

export const reportBlog = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { blogId, reason } = req.body;
    const userId = req.user?.userId;

    if (!blogId || !userId || !reason) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    await Report.create({
      userId,
      reason,
      blogId,
      reportStatus: "pending",
    });

    return res.json({
      success: true,
      message: "Reported",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const getReports = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({
      reportStatus: "pending",
    })
      .populate("userId", "fullName _id")
      .populate({
        path: "blogId",
        select: "_id title description likeCount userId",
        populate: {
          path: "userId",
          select: "_id fullName",
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      });
      const totalReports = await Report.countDocuments({
        reportStatus: "pending",
      });
    const formattedReports = reports.map((report: any) => ({
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

    return res.json({
      reports: formattedReports,
      currentPage: page,
      total: totalReports,
      totalPages: Math.ceil(totalReports / limit),
      hasMore: page * limit < totalReports
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const updateReportStatus = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { reportId, status } = req.body;

    if (!reportId || !status) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.json({
        success: false,
        error: "Report not found",
      });
    }

    if (status === "approved") {
      await Blog.findByIdAndDelete(report.blogId);

      await Like.deleteMany({
        blogId: report.blogId,
      });

      await Report.findByIdAndUpdate(reportId, {
        reportStatus: "approved",
      });

      return res.json({
        success: true,
        message: "Report approved and blog deleted",
      });
    }

    if (status === "rejected") {
      await Report.findByIdAndUpdate(reportId, {
        reportStatus: "rejected",
      });

      return res.json({
        success: true,
        message: "Report rejected",
      });
    }

    return res.json({
      success: false,
      error: "Please send status first",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const isReported = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { blogId } = req.body;
    const userId = req.user?.userId;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    const isAlreadyReported = await Report.findOne({
      blogId,
      userId,
    });

    if (isAlreadyReported) {
      return res.json({
        success: false,
        error: "You have already reported this blog",
      });
    }

    return res.json({
      success: true,
      message: "You can report this blog",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const reportCount = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const reports = await Report.countDocuments();
    return res.json(reports)
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};