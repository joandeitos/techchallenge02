export interface Author {
  id: string;
  name: string;
  email?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
} 