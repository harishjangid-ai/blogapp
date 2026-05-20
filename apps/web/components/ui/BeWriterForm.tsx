import {writerRequest} from "@/services/writerRequest";
import { FormProps } from "@/types/requestsType";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, Select, Button, DatePicker, message } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

const BeWriterForm = () => {
  const [form, setForm] = useState<FormProps>({
    dateOfBirth: "",
    email: "",
    contentType: "",
    profession: "",
    description: "",
  });

  const mutation = useMutation({
    mutationFn: writerRequest,
    onSuccess: (data) => {
      if (!data.success) {
        return message.error(data.error || "Submition Failed");
      }
      setForm({
        dateOfBirth: "",
        email: "",
        contentType: "",
        profession: "",
        description: "",
      });
      message.success(data.message);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const dateOfBirth = form.dateOfBirth.trim();
    const profession = form.profession.trim();
    const contentType = form.contentType.trim();
    const email = form.email.trim();
    const description = form.description.trim();
    if (!dateOfBirth || !profession || !contentType || !email || !description) {
      return message.error("All fields are required");
    }

    mutation.mutate({
      dateOfBirth,
      profession,
      contentType,
      email,
      description,
    });
    console.log("Form submitted:", form);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl border rounded-2xl p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Writer Onboarding Request</h2>
          <p className="text-gray-500 mt-1">
            Fill out this form to apply for a writer account. We'll review your
            application and get back to you soon.
          </p>
        </div>

        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Email *" name="email">
              <Input
                placeholder="john@gmail.com"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </Form.Item>

            <Form.Item label="Date of Birth *" name="dob">
              <DatePicker
                className="w-full"
                format="DD-MM-YYYY"
                placeholder="dd-mm-yyyy"
                onChange={(date) =>
                  setForm({
                    ...form,
                    dateOfBirth: date ? date.format("DD-MM-YYYY") : "",
                  })
                }
              />
            </Form.Item>

            <Form.Item label="Profession *" name="profession">
              <Input
                placeholder="Software Engineer"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, profession: e.target.value }))
                }
              />
            </Form.Item>
            <Form.Item label="Content Type *" name="contentType">
              <Select
                placeholder="Select content type"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contentType: e }))
                }
              >
                <Select.Option value="technology">Technology</Select.Option>
                <Select.Option value="programming">Programming</Select.Option>
                <Select.Option value="ai">AI</Select.Option>
                <Select.Option value="education">Education</Select.Option>
                <Select.Option value="gaming">Gaming</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Description *" name="description">
            <TextArea
              rows={4}
              placeholder="Tell us about yourself and what type of content you want to write..."
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full h-10">
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default BeWriterForm;
