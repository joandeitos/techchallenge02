export interface User {
  _id: string;
  name: string;
  email: string;
  discipline: string;
  role: 'professor' | 'admin';
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;  // Agora author é um objeto User completo
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  content: string;
  author: string;  // Aqui mantemos apenas o ID do usuário
}

export interface ApiResponse<T> {
  data: {
    posts: T;
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  };
  error?: string;
}

export interface PostsResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}
