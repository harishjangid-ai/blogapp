import Blog from "../models/blogModel.ts";
import Like from "../models/likesModel.ts";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/RequestType.ts";

export const createBlog = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.userId;

    if (
      !title?.trim() ||
      !description ||
      !description.root ||
      !Array.isArray(description.root.children)
    ) {
      return res.json({
        success: false,
        error: "All fields are required",
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      description,
      userId,
    });

    return res.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const getBlogs = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const userId = req.user?.userId;

    const likes = userId
      ? await Like.find({
          userId,
        }).select("blogId")
      : [];

    const likedBlogIds = new Set(
      likes.map((like: any) => like.blogId.toString()),
    );

    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.find()
      .populate("userId", "_id fullName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);  

    const formattedBlog = blogs.map((blog: any) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      likeCount: blog.likeCount,
      views: blog.views,
      isLiked: likedBlogIds.has(blog._id.toString()),
      user: {
        _id: blog.userId._id,
        fullName: blog.userId.fullName,
      },
    }));

    return res.json({
      blogs: formattedBlog,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      hasMore: page * limit < totalBlogs,
      totalBlogs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const selectedBlog = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const { id } = req.params;

    const userId = req.user?.userId || null;

    const blog = await Blog.findById(id).populate(
      "userId",
      "fullName _id",
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const liked = userId
      ? await Like.findOne({
          blogId: id,
          userId,
        })
      : null;

    return res.json({
      ...(blog.toObject() as object),
      isLiked: !!liked,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const userBlogs = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const loggedInUserId = req.user?.userId;

    const likes = loggedInUserId
      ? await Like.find({
          userId: loggedInUserId,
        }).select("blogId")
      : [];

    const likedBlogIds = new Set(
      likes.map((like: any) => like.blogId.toString()),
    );

    const blogs = await Blog.find({
      userId: loggedInUserId,
    })
      .populate("userId", "_id fullName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const formattedBlog = blogs.map((blog: any) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      likeCount: blog.likeCount,
      isLiked: likedBlogIds.has(blog._id.toString()),
      views: blog.views,
      user: {
        _id: blog.userId?._id,
        fullName: blog.userId?.fullName,
      },
    }));

    const totalBlogs = await Blog.countDocuments({
      userId: loggedInUserId,
    });

    return res.json({
      success: true,
      blogs: formattedBlog,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      hasMore: page * limit < totalBlogs,
      totalBlogs,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteBlog = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { id } = req.params;

    await Blog.findByIdAndDelete(id);

    await Like.deleteMany({
      blogId: id,
    });

    return res.json({
      success: true,
      message: "Delete successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      error,
    });
  }
};

export const trendingBlogs = async ( req: AuthenticatedRequest, res: Response ): Promise<Response> => {
  try {
    const userId = req.user?.userId;

    const likes = userId
      ? await Like.find({
          userId,
        }).select("blogId")
      : [];

    const likedBlogIds = new Set(
      likes.map((like: any) => like.blogId.toString()),
    );

    const trendingBlogs = await Blog.find()
      .populate("userId", "_id fullName")
      .sort({
        views: -1,
        likeCount: -1,
        createdAt: -1,
      })
      .limit(10);

    const formattedBlog = trendingBlogs.map((blog: any) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      likeCount: blog.likeCount,
      isLiked: likedBlogIds.has(blog._id.toString()),
      views: blog.views,
      user: {
        _id: blog.userId._id,
        fullName: blog.userId.fullName,
      },
    }));

    return res.json({
      success: true,
      blogs: formattedBlog,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      totalBlogs: 10,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const blogCount = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const count = await Blog.countDocuments();

    return res.json({
      success: true,
      count,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};