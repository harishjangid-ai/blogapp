"use client";

import { useCallback, useEffect, useState } from "react";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createParagraphNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { Button, Select } from "antd";
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, UndoOutlined, RedoOutlined } from "@ant-design/icons";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

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

  const changeFontSize = (size: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": size,
        });
      }
    });

    setFontSize(size);
  };

  const changeBlock = (value: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) return;

      if (value === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () =>
          $createHeadingNode(value as "h1" | "h2" | "h3")
        );
      }
    });

    setBlockType(value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-white p-3 rounded-t-lg">
      <Button
        icon={<UndoOutlined />}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="ctrl + z"
      />

      <Button
        icon={<RedoOutlined />}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="ctrl + y"
      />

      <Select
        value={blockType}
        style={{ width: 130 }}
        onChange={changeBlock}
        options={[
          { label: "Paragraph", value: "paragraph" },
          { label: "Heading 1", value: "h1" },
          { label: "Heading 2", value: "h2" },
          { label: "Heading 3", value: "h3" },
        ]}
      />

      <Select
        value={fontSize}
        style={{ width: 90 }}
        onChange={changeFontSize}
        options={[
          { value: "12px", label: "12" },
          { value: "14px", label: "14" },
          { value: "16px", label: "16" },
          { value: "18px", label: "18" },
          { value: "20px", label: "20" },
          { value: "24px", label: "24" },
          { value: "28px", label: "28" },
          { value: "32px", label: "32" },
        ]}
      />

      <Button
        type={isBold ? "primary" : "default"}
        icon={<BoldOutlined />}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }
        title="ctrl + b"
      />

      <Button
        type={isItalic ? "primary" : "default"}
        icon={<ItalicOutlined />}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }
        title="ctrl + i"
      />

      <Button
        type={isUnderline ? "primary" : "default"}
        icon={<UnderlineOutlined />}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
        }
        title="ctrl + u"
      />
    </div>
  );
};

export default ToolbarPlugin;