import axios from "axios";

export const uploadImage = async ( file: File, onProgress?: (percent: number) => void ) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "blog_image");

  const { data } = await axios.post(
    "https://api.cloudinary.com/v1_1/eyzoxgle/image/upload",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        onProgress?.(percent);
      },
    },
  );

  return data;
};
