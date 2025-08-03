export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface Category {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  _id: string;
  title: string;
  content: string;
  type: string;
  categoryId: string;
  userId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  hash: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkType {
  _id: string;
  originalUrl: string;
  hash: string;
}