"use client";

import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import initialConfig from "./initialConfig";

interface Props{
  value: any;
};

function LoadEditorState({ value }: Props) {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (!value || initialized.current) return;

    try {
      const editorState = editor.parseEditorState(value);
      editor.setEditorState(editorState);
      editor.setEditable(false);
      initialized.current = true;
    } catch (err) {
      console.error(err);
    }
  }, [editor, value]);

  return null;
}

export default function ReadOnlyChatEditor({ value }: Props) {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            readOnly
            className="outline-none break-words whitespace-pre-wrap"
          />
        }
        placeholder={null}
        ErrorBoundary={({ children }) => <>{children}</>}
      />

      <LoadEditorState value={value} />
    </LexicalComposer>
  );
}