import { ApiResponse } from '../types';

export const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchWithError<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Um erro ocorreu' };
  }
}

