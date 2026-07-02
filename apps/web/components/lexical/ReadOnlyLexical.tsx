"use client";

import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import initialConfig from "./InitialConfig";

type Props = {
  value: any;
};

const LoadEditorState = ({ value }: Props) => {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (!value || initialized.current) return;

    try {
      const editorState = editor.parseEditorState(value);
      editor.setEditorState(editorState);
      editor.setEditable(false);
      initialized.current = true;
    } catch (error) {
      console.error(error);
    }
  }, [editor, value]);

  return null;
};

const ReadOnlyLexical = ({ value }: Props) => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            readOnly
            className="outline-none text-base leading-7"
          />
        }
        placeholder={
          <div className="pointer-events-none absolute top-4 left-4 text-gray-400 select-none">
            Write your blog content...
          </div>
        }
        ErrorBoundary={({ children }) => <>{children}</>}
      />

      <LoadEditorState value={value} />
    </LexicalComposer>
  );
};

export default ReadOnlyLexical;
