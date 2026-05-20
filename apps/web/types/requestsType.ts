export interface FormProps {
  dateOfBirth: string;
  email: string;
  contentType: string;
  profession: string;
  description: string;
}

export interface RequestType {
  _id: string;
  userId: string;
  dateOfBirth: string;
  email: string;
  contentType: string;
  profession: string;
  description: string;
  reqStatus: string;
  fullName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
