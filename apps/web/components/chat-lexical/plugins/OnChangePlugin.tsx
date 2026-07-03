"use client";

import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";

interface Props{
  onChange: (value: any) => void;
};

export default function OnChangePlugin({ onChange }: Props) {
  const handleChange = (editorState: EditorState) => {
    onChange(editorState.toJSON());
  };

  return <LexicalOnChangePlugin onChange={handleChange} />;
}