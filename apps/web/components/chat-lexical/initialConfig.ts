import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";

const theme = {
  paragraph: "leading-6 whitespace-pre-wrap break-words",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm",
  },
  link: "text-blue-600 underline hover:text-blue-700",
};

const initialConfig: InitialConfigType = {
  namespace: "ChatEditor",
  theme,
  nodes: [
    LinkNode,
    ListNode,
    ListItemNode,
  ],
  onError(error: Error) {
    throw error;
  },
};

export default initialConfig;