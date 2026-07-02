import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";

const nodes = [HeadingNode];

const theme = {
  paragraph: "mb-2 leading-7",
  heading: {
    h1: "text-4xl font-bold mb-4",
    h2: "text-3xl font-bold mb-3",
    h3: "text-2xl font-semibold mb-2",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};
const initialConfig: InitialConfigType = {
  namespace: "BlogEditor",
  theme,
  nodes,
  onError(error: Error) {
    throw error;
  },
};

export default initialConfig;
