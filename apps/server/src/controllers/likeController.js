import Like from "../models/likesModel.js";
import Blog from "../models/blogModel.js";
import View from "../models/viewsModel.js";
import Comment from "../models/commentsModel.js";
import Reply from "../models/replyModel.js";

export const like = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.userId;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        error: "Select a blog",
      });
    }

    const deletedLIke = await Like.findOneAndDelete({ blogId, userId });

    if (deletedLIke) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        { $inc: { likeCount: -1 } },
        { new: true },
      );

      return res.json({
        success: true,
        isLiked: false,
        likeCount: blog.likeCount,
      });
    }

    await Like.create({
      blogId,
      userId,
    });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likeCount: 1 } },
      { new: true },
    );

    return res.json({
      success: true,
      isLiked: true,
      likeCount: blog.likeCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      const blog = await Blog.findById(blogId);
      return res.json({
        success: true,
        isLiked: true,
        likeCount: blog.likeCount,
      });
    }
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const likes = async (req, res) => {
  try {
    const like = await Like.find();
    return res.json(like);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const view = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.userId;
    if (!blogId || !userId) {
      return res.status(400).json({
        success: false,
        message: "blogId and userId are required",
      });
    }

    const alreadyViewed = await View.findOne({ blogId, userId });
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
      $inc: { views: 1 },
    });

    return res.json({
      success: true,
      message: "View counted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const views = async (req, res) => {
  try {
    const view = await View.find();
    return res.json(view);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const newComment = async (req, res) => {
  try {
    const { blogId, comment } = req.body;
    const userId = req.user.userId;
    if (!userId || !blogId || !comment) {
      return res.json({ success: false, error: "All fields are required" });
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
    return res.json({ success: false, error });
  }
};

export const commentReply = async (req, res) => {
  try {
    const { reply, commentId } = req.body;
    const userId = req.user.userId;
    if (!userId || !commentId) {
      return res.json({ success: false, error: "All fields are required" });
    }
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.json({ success: false, error: "Comment not available" });
    }
    const commentReply = await Reply.create({
      commentId,
      userId,
      reply,
    });

    return res.json({ success: true, message: "Replied successfull" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.body;
    if (!commentId) {
      return res.json({ success: false, error: "Comment id is not valid" });
    }
    const reply = await Reply.find({ commentId })
      .populate("userId", "_id fullName userName")
      .sort({ createdAt: -1 });
    return res.json(reply);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const blogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({ blogId })
      .populate("userId", "_id fullName userName")
      .sort({ createdAt: -1 });
    return res.json(comments);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const comments = async (req, res) => {
  try {
    const allComments = await Comment.find();
    return res.json(allComments);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const commentsCount = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.json({
        success: false,
        error: "Blog Id is required",
      });
    }

    const allComments = await Comment.find({ blogId });
    const commentIds = allComments.map((comment) => comment._id);

    const replies = await Reply.find({
      commentId: { $in: commentIds },
    });

    const count = allComments.length + replies.length

    return res.json({success: true, count})
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};
