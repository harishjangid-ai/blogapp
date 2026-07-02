"use client";

import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

import { $createHeadingNode } from "@lexical/rich-text";
import initialConfig from "./InitialConfig";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import OnChangePlugin from "./plugins/OnChangePlugin";
import { useAppSelector } from "@/redux/store/hooks";

type Props = {
  value?: any;
  onChange?: (value: any) => void;
};

const LoadEditorState = ({ value }: { value?: any }) => {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);
  const blog = useAppSelector((state) => state.blog.blog);

  useEffect(() => {
    if (initialized.current || !value) return;

    try {
      const editorState = editor.parseEditorState(value);
      editor.setEditorState(editorState);
      initialized.current = true;
    } catch (error) {
      console.error(error);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!blog?.description) return;

    editor.update(() => {
      const root = $getRoot();

      root.clear();

      blog.description.forEach((block) => {
        if (block.type === "paragraph") {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(block.text));
          root.append(paragraph);
        } else {
          const tag =
            block.type === "heading1"
              ? "h1"
              : block.type === "heading2"
                ? "h2"
                : "h3";

          const heading = $createHeadingNode(tag);

          heading.append($createTextNode(block.text));

          root.append(heading);
        }
      });
    });

    initialized.current = true;
  }, [blog, editor]);

  return null;
};

const LexicalEditor = ({ value, onChange }: Props) => {
  const handleChange = (editorState: EditorState) => {
    onChange?.(editorState.toJSON());
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
        <ToolbarPlugin />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-87.5 p-5 outline-none text-base leading-7 focus:outline-none" />
            }
            placeholder={
              <div className="pointer-events-none absolute top-4 left-4 text-gray-400 select-none">
                Write your blog content...
              </div>
            }
            ErrorBoundary={({ children }) => <>{children}</>}
          />

          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
          <LoadEditorState value={value} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
