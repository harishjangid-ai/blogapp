import { OpenAIOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";

const CreateBlogAI = () => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-purple-200 bg-[#f5f2f8] p-6 shadow-sm">
      <div className="flex items-center gap-4 w-full">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-pink-500">
          <OpenAIOutlined className="text-lg! text-white!" />
        </div>
        <div>
          <h2 className="text-xl text-gray-900">AI Assistant</h2>
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
            className="p-2 rounded-lg"
          />
        </div>

        <div>
          <label className="mb-3 block text-lg font-medium text-gray-900">
            Tone
          </label>

          <Select
            defaultValue="professional"
            style={{ width: "100%", padding: "8px" }}
            options={[
              { value: "professional", label: "Professional" },
              { value: "casual", label: "Casual" },
              { value: "technical", label: "Technical" },
              { value: "educational", label: "Educational" },
              { value: "conversational", label: "Conversational" },
            ]}
          />
        </div>

        <Button className="flex w-full items-center justify-center gap-2 rounded-xl! bg-linear-to-r! from-violet-600! to-pink-600! py-4! text-lg! text-white! transition! hover:opacity-90! border! hover:border-gray-300!" type="default">
          <OpenAIOutlined />
          Generate with AI
        </Button>

        <div className="rounded-2xl border border-purple-200 bg-[#f3eff7] px-4 py-4 text-sm leading-6 text-purple-800">
          <span className="font-semibold">Tip:</span> AI-generated content is a
          starting point. Always review and personalize it to match your voice.
        </div>
      </div>
    </div>
  );
};

export default CreateBlogAI;
