import Like from "../models/likesModel.ts";
import Blog from "../models/blogModel.ts";
import View from "../models/viewsModel.ts";
import Comment from "../models/commentsModel.ts";
import Reply from "../models/replyModel.ts";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/RequestType.ts";

export const like = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { blogId } = req.body;
    const userId = req.user?.userId;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        error: "Select a blog",
      });
    }

    const deletedLike = await Like.findOneAndDelete({
      blogId,
      userId,
    });

    if (deletedLike) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: {
            likeCount: -1,
          },
        },
        {
          new: true,
        },
      );

      return res.json({
        success: true,
        isLiked: false,
        likeCount: blog?.likeCount,
      });
    }

    await Like.create({
      blogId,
      userId,
    });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $inc: {
          likeCount: 1,
        },
      },
      {
        new: true,
      },
    );

    return res.json({
      success: true,
      isLiked: true,
      likeCount: blog?.likeCount,
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      const { blogId } = req.body;

      const blog = await Blog.findById(blogId);

      return res.json({
        success: true,
        isLiked: true,
        likeCount: blog?.likeCount,
      });
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const likes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const like = await Like.find();

    return res.json(like);
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const view = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { blogId } = req.body;
    const userId = req.user?.userId;

    if (!blogId || !userId) {
      return res.status(400).json({
        success: false,
        error: "blogId and userId are required",
      });
    }

    const alreadyViewed = await View.findOne({
      blogId,
      userId,
    });

    if (alreadyViewed) {
      return res.json({
        success: true,
        message: "Already viewed",
      });
    }

    await View.create({
      blogId,
      userId,
    });

    await Blog.findByIdAndUpdate(blogId, {
      $inc: {
        views: 1,
      },
    });

    return res.json({
      success: true,
      message: "View counted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

export const views = async (req: Request, res: Response): Promise<Response> => {
  try {
    const view = await View.find();

    return res.json(view);
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const newComment = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { blogId, comment } = req.body;
    const userId = req.user?.userId;

    if (!userId || !blogId || !comment) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    const newComment = await Comment.create({
      userId,
      blogId,
      comment,
    });

    return res.json({
      success: true,
      message: "Comment added",
      comment: newComment,
    });
  } catch (error) {
    return res.json({
      success: false,
      error,
    });
  }
};

export const commentReply = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { reply, commentId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !commentId) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.json({
        success: false,
        error: "Comment not available",
      });
    }

    await Reply.create({
      commentId,
      userId,
      reply,
    });

    return res.json({
      success: true,
      message: "Replied successfull",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const getReplies = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.json({
        success: false,
        error: "Comment id is not valid",
      });
    }

    const reply = await Reply.find({
      commentId,
    })
      .populate("userId", "_id fullName userName")
      .sort({
        createdAt: -1,
      });

    return res.json(reply);
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const blogComments = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { blogId } = req.body;

    const comments = await Comment.find({
      blogId,
    })
      .populate("userId", "_id fullName userName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      blogId,
    });

    return res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      hasMore: page * limit < totalComments,
      totalComments,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const commentsCount = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.json({
        success: false,
        error: "Blog Id is required",
      });
    }

    const allComments = await Comment.find({
      blogId,
    });

    const commentIds = allComments.map((comment) => comment._id);

    const replies = await Reply.find({
      commentId: {
        $in: commentIds,
      },
    });

    const count = allComments.length + replies.length;

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};
