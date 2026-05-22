export interface User {
  _id: string;
  fullName: string;
  userName: string;
  phone: string;
  role: string;
  createdAt: string;
}

export interface WritersType {
  _id: string;
  fullName: string;
  phone: string;
  userId: string;
  dateOfBirth: string;
  email: string;
  contentType: string;
  profession: string;
  createdAt: string;
  description: string;
}
