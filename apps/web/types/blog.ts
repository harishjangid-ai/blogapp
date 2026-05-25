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
  writer: {
    _id: string;
    fullName: string;
  };
}

export interface BlogType {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  writerId: {
    _id: string;
    fullName: string;
  };
}

export interface BlogType2 {
  _id: string;
  title: string;
  description: string;
  writerId: string;
  createdAt: string;
}
