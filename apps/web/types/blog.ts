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
  user: {
    _id: string;
    fullName: string;
  };
  likeCount: string;
}

export interface BlogType {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  userId: {
    _id: string;
    fullName: string;
  };
  likeCount: string
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