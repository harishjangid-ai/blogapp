import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Download } from "lucide-react";

interface ImagePreviewProps {
  imageUrl?: string | null;
}

const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
  const image = imageUrl as string;
  const [rotation, setRotation] = useState(0);

  const downloadImage = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "image";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      window.open(image, "_blank");
    }
  };

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={8}
      centerOnInit
      wheel={{ step: 0.2 }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="flex h-full flex-col bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center gap-2 border-b border-gray-200 dark:border-gray-700 p-3">
            <button
              onClick={() => zoomIn()}
              className="rounded border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={() => zoomOut()}
              className="rounded border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ZoomOut size={18} />
            </button>

            <button
              onClick={() => setRotation((prev) => prev - 90)}
              className="rounded border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={() => setRotation((prev) => prev + 90)}
              className="rounded border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCw size={18} />
            </button>

            <button
              onClick={() => {
                resetTransform();
                setRotation(0);
              }}
              className="rounded border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Reset
            </button>

            <button
              onClick={downloadImage}
              className="rounded border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download size={18} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden bg-black">
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="flex items-center justify-center w-full h-full"
            >
              <img
                src={image}
                alt="Preview"
                draggable={false}
                className="max-h-[80vh] max-w-full select-none object-contain transition-transform duration-200"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </TransformComponent>
          </div>
        </div>
      )}
    </TransformWrapper>
  );
};

export default ImagePreview;
