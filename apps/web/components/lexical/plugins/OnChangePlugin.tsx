"use client";

import { EditorState } from "lexical";
import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

interface Props {
  onChange: (editorState: EditorState) => void;
};

const OnChangePlugin = ({ onChange }: Props) => {
  return (
    <LexicalOnChangePlugin
      onChange={(editorState) => {
        onChange(editorState);
      }}
    />
  );
};

export default OnChangePlugin;