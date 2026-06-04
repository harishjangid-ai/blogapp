export interface BlogFormProps {
  title: string;
  description: string;
}

export interface BlogProps {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  views: number;
  isLiked: boolean;
  user: {
    _id: string;
    fullName: string;
  };
}

export interface BlogType {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
  views: number;
  userId: {
    _id: string;
    fullName: string;
  };
}

export interface ReportProps {
  _id: string;
  blog: {
    _id: string;
    title: string;
    description: string;
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
  };
  _id: string;
}
