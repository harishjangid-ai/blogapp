"use client";

import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import { LikeOutlined } from "@ant-design/icons";

interface writerType {
  _id: string;
  fullName: string;
}

const Blog = ({
  _id,
  title,
  description,
  writer,
}: {
  _id: string;
  title: string;
  description: string;
  writer: writerType;
}) => {
  const dispatch = useAppDispatch();

  const handlePreview = ({ id }: { id: string }) => {
    dispatch(setPreview({ preview: true, id }));
  };
  return (
    <div
      className="p-4 flex flex-col gap-3 border rounded-2xl border-gray-300 hover:shadow duration-75"
      key={_id}
    >
      <h1 className="text-xl font-normal">{title}</h1>
      <p className="text-sm text-gray-500 wrap-break-word line-clamp-2">
        {description}
      </p>
      <div className="flex justify-between text-lg text-gray-500">
        <h2 className="font-thin">{writer.fullName}</h2>
        <p className="flex gap-2">
          <LikeOutlined />
          {title.charAt(0)}
        </p>
      </div>
      <button
        className="rounded-2xl border border-gray-500/20 hover:bg-gray-400/20 duration-150 py-2"
        onClick={() => handlePreview({ id: _id })}
      >
        Read More
      </button>
    </div>
  );
};

export default Blog;



// "use client";
// import { setPreview } from "@/redux/features/previewSlice";
// import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
// import { getBlogs } from "@/services/blog";
// import { BlogProps } from "@/types/blog";
// import { useQuery } from "@tanstack/react-query";
// import BlogPreview from "./BlogPreview";
// import Blog from "./Blog";

// const BlogCard = () => {
//   const dispatch = useAppDispatch();
//   const prev = useAppSelector((p) => p.p.preview);

//   const { data: blog } = useQuery<BlogProps[]>({
//     queryKey: ["blogs"],
//     queryFn: getBlogs,
//   });

//   const closePreview = () => {
//     dispatch(setPreview({ preview: false, id: "" }));
//   };
//   return (
//     <>
//       <div
//         className={
//           prev
//             ? "hidden"
//             : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//         }
//       >
//         {blog?.map((blog) => (
//           <Blog
//             _id={blog._id}
//             description={blog.description}
//             title={blog.title}
//             writer={blog.writer}
//           />
//         ))}
//       </div>
//       {prev && (
//         <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
//           <BlogPreview close={closePreview} />
//         </div>
//       )}
//     </>
//   );
// };

// export default BlogCard;

