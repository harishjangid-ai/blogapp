"use client";

import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import ImagePreview from "./ImagePreview";

const IAvatar = ({ src, size = 30 }: { src?: string; size?: number }) => {
  const [imgPreview, setImgPreview] = useState(false);
  return (
    <>
      {src && (
        <Avatar
          size={size}
          src={src}
          icon={<UserOutlined />}
          onClick={() => setImgPreview(true)}
          style={{ minWidth: size }}
        />
      )}
      {!src && (
        <h1
          className="rounded-full bg-gray-200 flex items-center justify-center text-xl"
          style={{ minWidth: size, height: size, width: size }}
        >
          <UserOutlined className="text-black!" />
        </h1>
      )}
      {imgPreview && (
        <Modal
          open={imgPreview}
          footer={false}
          centered
          onCancel={() => setImgPreview(false)}
        >
          <ImagePreview imageUrl={src} />
        </Modal>
      )}
    </>
  );
};

export default IAvatar;
