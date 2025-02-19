import { User } from '../types';
import { API_BASE_URL, fetchWithError } from './api';

export const userService = {
  async getUsers(): Promise<{ data?: User[]; error?: string }> {
    return fetchWithError<User[]>(`${API_BASE_URL}/users`);
  },

  async getUser(id: string): Promise<{ data?: User; error?: string }> {
    return fetchWithError<User>(`${API_BASE_URL}/users/${id}`);
  }
};

