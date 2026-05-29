import Like from "../models/likesModel.js";
import Blog from "../models/blogModel.js";
import View from "../models/viewsModel.js";
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

    const findLike = await Like.findOne({ blogId, userId });

    if (findLike) {
      await Like.findByIdAndDelete(findLike._id);

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
