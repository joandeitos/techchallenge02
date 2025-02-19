import { Post, PostFormData, PostsResponse, ApiResponse } from '../types';
import { API_BASE_URL, fetchWithError } from './api';

export const postService = {
  async getPosts(page: number = 1): Promise<ApiResponse<PostsResponse>> {
    console.log('Fazendo requisição para:', `${API_BASE_URL}/posts?page=${page}&limit=5`);
    const response = await fetchWithError<PostsResponse>(
      `${API_BASE_URL}/posts?page=${page}&limit=5`
    );
    console.log('Resposta do getPosts:', response);
    return response;
  },

  async searchPosts(query: string): Promise<ApiResponse<Post[]>> {
    return fetchWithError<Post[]>(
      `${API_BASE_URL}/posts/search?q=${query}`
    );
  },

  async createPost(post: PostFormData): Promise<ApiResponse<Post>> {
    return fetchWithError<Post>(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
  },

  async updatePost(id: string, post: PostFormData): Promise<ApiResponse<Post>> {
    return fetchWithError<Post>(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
  },

  async deletePost(id: string): Promise<ApiResponse<void>> {
    return fetchWithError<void>(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE'
    });
  }
};
