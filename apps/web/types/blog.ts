export interface BlogFormProps {
  title: string;
  description: LexicalEditorState;
}

export interface LexicalTextNode {
  detail: number;
  format: number;
  mode: string;
  style: string;
  text: string;
  type: "text";
  version: number;
}

export interface LexicalParagraphNode {
  type: "paragraph";
  children: LexicalTextNode[];
}

export interface LexicalHeadingNode {
  type: "heading";
  tag: "h1" | "h2" | "h3";
  children: LexicalTextNode[];
}

export interface LexicalEditorState {
  root: {
    children: (LexicalParagraphNode | LexicalHeadingNode)[];
  };
}

export interface BlogProps {
  _id: string;
  title: string;
  description: LexicalEditorState;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  views: number;
  isLiked: boolean;
  image: string;
  user: {
    _id: string;
    fullName: string;
  };
}

export interface BlogType {
  _id: string;
  title: string;
  description: LexicalEditorState;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
  image: string;
  views: number;
  userId: {
    _id: string;
    fullName: string;
    image: string
  };
}

export interface ReportProps {
  _id: string;
  blog: {
    _id: string;
    title: string;
    description: LexicalEditorState;
    likeCount: number;
    user: {
      _id: string;
      fullName: string;
    };
  };
  reportedBy: {
    _id: string;
    fullName: string;
  };
  reason: string;
  reportStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Likes {
  _id: string;
  blogId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentType {
  blogId: string;
  comment: string;
  createdAt: string;
  userId: {
    fullName: string;
    _id: string;
    userName: string;
    image: string
  };
  _id: string;
}

export interface ReplyType {
  _id: string;
  commentId: string;
  userId: {
    _id: string;
    fullName: string;
    userName: string;
    image: string
  };
  reply: string;
  createdAt: string;
  updatedAt: string;
}
