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

export interface BlogType2 {
  _id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: string;
  likeCount: string
}
