import { setPreview } from "@/redux/features/previewSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { writersBlog } from "@/services/blog";
import { selWriter } from "@/services/writerRequest";
import { BlogType2 } from "@/types/blog";
import { WritersType } from "@/types/userType";
import { LikeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import BlogPreview from "./BlogPreview";

const WritersBlog = ({ id, isMyBlog }: { id: string | undefined; isMyBlog: boolean }) => {
  const { data: blogs } = useQuery<BlogType2[]>({
    queryKey: ["blogs", id],
    queryFn: () => writersBlog({ id }),
  });
  const { data: writer } = useQuery<WritersType>({
    queryKey: ["writer", id],
    queryFn: () => selWriter({ id }),
  });

  const dispatch = useAppDispatch();
  const prev = useAppSelector((p) => p.p.preview);

  const handlePreview = ({ id }: { id: string }) => {
    dispatch(setPreview({ preview: true, id }));
  };
  return (
    <>
      <div
        className={
          prev
            ? "hidden"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        }
      >
        {blogs?.map((blog) => (
          <div
            className="p-4 flex flex-col gap-3 border rounded-2xl border-gray-300 hover:shadow duration-75"
            key={blog._id}
          >
            {/* prev
                ? "hidden"
                :  */}
            <h1 className="text-xl font-normal">{blog.title}</h1>
            <p className="text-sm text-gray-500 wrap-break-word line-clamp-2">
              {blog.description}
            </p>
            <div className="flex justify-between text-lg text-gray-500">
              <h2 className="font-thin">{writer?.fullName}</h2>
              <p className="flex gap-2">
                <LikeOutlined />
                {blog.title.charAt(0)}
              </p>
            </div>
            <button
              className="rounded-2xl border border-gray-500/20 hover:bg-gray-400/20 duration-150 py-2"
              onClick={() => handlePreview({ id: blog._id })}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
      {prev && (
        <div className="flex justify-center w-full min-h-[calc(100vh-48px)]">
          <BlogPreview />
        </div>
      )}
    </>
  );
};

export default WritersBlog;
