export const getPreviewText = (editorState: any) => {
  if (!editorState?.root?.children) return "";

  return editorState.root.children
    .flatMap((node: any) => node.children || [])
    .map((node: any) => node.text)
    .join(" ");
};