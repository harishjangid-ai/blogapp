import Blog from "../models/blogModel.js";
import Like from "../models/likesModel.js";

export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;
    if (!title || !description) {
      return res.json({ success: false, error: "All fields are required" });
    }
    const blog = await Blog.create({
      title,
      description,
      userId,
    });

    return res.json({ success: true, blog });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blog = await Blog.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          likeCount: 1,
          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
          },
        },
      },
    ]);
    const blogs = await Blog.find();
    return res.json(blog);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const selectedBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate("userId", "fullName _id");

    return res.json(blog);
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};

export const userBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    const blogs = await Blog.find({ userId: id }).populate(
      "userId",
      "_id fullName",
    );

    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      description: blog.description,
      likeCount: blog.likeCount,

      user: {
        _id: blog.userId?._id,
        fullName: blog.userId?.fullName,
      },
    }));

    return res.json({
      success: true,
      blogs: formattedBlogs,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    const like = await Like.deleteMany({ blogId: id });
    return res.json({ success: true, message: "Delete succefully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};
