import Like from "../models/likesModel.js";
import Blog from "../models/blogModel.js";
export const like = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.userId;
    if (!blogId) {
      return res.json({ success: false, error: "Select a blog" });
    }
    const findLike = await Like.findOne({ blogId, userId });
    if (findLike) {
      await Like.findByIdAndDelete(findLike._id);
      await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } });
      return;
    }
    const like = await Like.create({
      blogId,
      userId,
    });

    await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: 1 } });
    return res.json(like);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

// export const disLike = async (req, res) => {
//   try {
//     const { blogId, likeId } = req.body;
//     const userId = req.user.userId;
//     if (!blogId || !likeId) {
//       return res.json({ success: false, error: "Select a blog" });
//     }

//     const like = await Like.findOne({ _id: likeId });
//     if (!like) {
//       return;
//     }
//     await Like.findByIdAndDelete(likeId);
//     await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } });
//     return res.json(like);
//   } catch (error) {
//     console.log(error);
//     return res.json({ success: false, error });
//   }
// };
