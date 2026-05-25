import { setBlog } from "@/redux/features/blogSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { generateWithAi } from "@/services/blog";
import { OpenAIOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, message, Select } from "antd";
import { useState } from "react";

interface FormProps {
  topic: string;
  tone: string;
}

const CreateBlogAI = ({ removeFormData }: { removeFormData: () => void }) => {
  const [form, setForm] = useState<FormProps>({
    topic: "",
    tone: "professional",
  });

  const formdata = useAppSelector((p) => p.blog.blog);

  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: generateWithAi,
    onSuccess: (data) => {
      console.log(data);
      message.success("Blog generated successfully");
      dispatch(setBlog({ blog: data.data }));
    },
    onError: (error) => {
      console.log(error);
      message.error("Failed to generate blog");
    },
  });

  const handleChange = (key: keyof FormProps, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateBlog = () => {
    const topic = form.topic.trim();
    const tone = form.tone.trim();

    if (!topic || !tone) {
      return message.error("All fields are required");
    }

    mutation.mutate({
      topic,
      tone,
    });
  };

  const removeFormdata = () => {
    removeFormData();
    setForm({
      topic: "",
      tone: "professional",
    });
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-purple-200 bg-[#f5f2f8] p-6 shadow-sm">
      <div className="flex items-center gap-4 w-full">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-pink-500">
          <OpenAIOutlined className="text-lg! text-white!" />
        </div>

        <div>
          <h2 className="text-xl text-gray-900 font-semibold">AI Assistant</h2>

          <p className="text-sm text-gray-500">
            Generate content ideas and drafts with AI
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <label className="mb-3 block text-lg font-medium text-gray-900">
            Topic
          </label>

          <Input
            type="text"
            placeholder="e.g., React Performance Tips"
            className="rounded-lg p-2"
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-3 block text-lg font-medium text-gray-900">
            Tone
          </label>

          <Select
            value={form.tone}
            style={{ width: "100%" }}
            onChange={(value) => handleChange("tone", value)}
            options={[
              { value: "professional", label: "Professional" },
              { value: "casual", label: "Casual" },
              { value: "technical", label: "Technical" },
              { value: "educational", label: "Educational" },
              { value: "conversational", label: "Conversational" },
            ]}
          />
        </div>
        <div className="flex w-full gap-3">
          <Button
            loading={mutation.isPending}
            onClick={generateBlog}
            className={`flex ${formdata === null ? "w-full" : " w-[70%]"} items-center justify-center gap-2 rounded-xl! border! bg-linear-to-r! from-violet-600! to-pink-600! py-4! text-lg! text-white! transition! hover:border-gray-300! hover:opacity-90!`}
            type="default"
          >
            <OpenAIOutlined />
            Generate with AI
          </Button>
          <Button
            onClick={removeFormdata}
            className={
              formdata === null
                ? "hidden!"
                : "flex w-[30%] items-center justify-center gap-2 rounded-xl! border! bg-linear-to-r!  py-4! text-lg! text-red-500! transition! hover:border-red-300! hover:opacity-90!"
            }
            type="default"
          >
            Cancel
          </Button>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-[#f3eff7] px-4 py-4 text-sm leading-6 text-purple-800">
          <span className="font-semibold">Tip:</span> AI-generated content is a
          starting point. Always review and personalize it to match your voice.
        </div>
      </div>
    </div>
  );
};

export default CreateBlogAI;
