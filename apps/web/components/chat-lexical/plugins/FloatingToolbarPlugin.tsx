"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { Button } from "antd";
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from "@ant-design/icons";

interface Position {
  top: number;
  left: number;
}

export default function FloatingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
  });

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [open, setOpen] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      const domSelection = window.getSelection();
      const root = editor.getRootElement();

      if (
        !root ||
        !domSelection ||
        domSelection.rangeCount === 0 ||
        !domSelection.anchorNode ||
        !root.contains(domSelection.anchorNode)
      ) {
        setVisible(false);
        return;
      }

      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        if (document.activeElement?.closest(".floating-toolbar")) {
          return;
        }

        setVisible(false);
        return;
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const rect = domSelection.getRangeAt(0).getBoundingClientRect();

      setPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX + rect.width / 2,
      });

      setVisible(true);
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateToolbar();
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    window.addEventListener("scroll", updateToolbar);
    window.addEventListener("resize", updateToolbar);

    return () => {
      window.removeEventListener("scroll", updateToolbar);
      window.removeEventListener("resize", updateToolbar);
    };
  }, [updateToolbar]);

  const changeFontSize = (size: string) => {
    editor.focus();

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": size,
        });
      }
    });

    setFontSize(size);
    setOpen(false);
  };

  if (!visible) return null;

  return createPortal(
    <div
      className="floating-toolbar flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 px-2 py-2 shadow-2xl backdrop-blur-md"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        zIndex: 9999,
      }}
    >
      <Button
        type={isBold ? "primary" : "default"}
        size="small"
        className="h-9! w-9! rounded-lg! dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
        icon={<BoldOutlined />}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      />

      <Button
        type={isItalic ? "primary" : "default"}
        size="small"
        icon={<ItalicOutlined />}
        className="h-9! w-9! rounded-lg! dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      />

      <Button
        type={isUnderline ? "primary" : "default"}
        size="small"
        className="h-9! w-9! rounded-lg! dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
        icon={<UnderlineOutlined />}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      />

      <div className="relative">
        <button
          className="flex h-9 min-w-14 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-sm font-semibold text-gray-900 dark:text-gray-100 transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((v) => !v)}
        >
          {fontSize.replace("px", "")}
        </button>

        {open && (
          <div
            className="absolute bottom-11 left-1/2 z-50 w-20 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
            onMouseDown={(e) => e.preventDefault()}
          >
            {["12px", "14px", "16px", "18px", "20px", "24px"].map((size) => (
              <button
                key={size}
                className={`block w-full px-3 py-2 text-center text-sm font-medium transition ${
                  fontSize === size
                    ? "bg-blue-500 text-white"
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => changeFontSize(size)}
              >
                {size.replace("px", "")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}