"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
} from "lexical";

import initialConfig from "./initialConfig";
import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import OnChangePlugin from "./plugins/OnChangePlugin";

export interface ChatEditorRef {
  clear: () => void;
}

interface Props {
  onChange?: (value: any) => void;
  onSend?: () => void;
}

function EditorRefPlugin({
  editorRef,
}: {
  editorRef: React.ForwardedRef<ChatEditorRef>;
}) {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(editorRef, () => ({
    clear() {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(""));
        root.append(paragraph);
      });

      editor.focus();
    },
  }));

  return null;
}

function EnterPlugin({ onSend }: { onSend?: () => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!event) return false;

        if (event.shiftKey) {
          return false;
        }

        event.preventDefault();
        onSend?.();

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, onSend]);

  return null;
}

const ChatEditor = forwardRef<ChatEditorRef, Props>(
  ({ onChange, onSend }, ref) => {
    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-12 max-h-40 overflow-y-auto p-3 outline-none text-gray-900 dark:text-gray-100" />
            }
            placeholder={
              <div className="pointer-events-none absolute left-3 top-3 text-gray-400 dark:text-gray-500">
                Type a message...
              </div>
            }
            ErrorBoundary={({ children }) => <>{children}</>}
          />

          <HistoryPlugin />
          <AutoFocusPlugin />
          <FloatingToolbarPlugin />
          <EnterPlugin onSend={onSend} />
          <OnChangePlugin onChange={onChange ?? (() => {})} />
          <EditorRefPlugin editorRef={ref} />
        </div>
      </LexicalComposer>
    );
  }
);

export default ChatEditor;