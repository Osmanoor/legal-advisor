// src/services/api/requests.ts
import { api } from '../../lib/axios';
import { endpoints } from './endpoints';
import { ApiResponse, ApiError } from './types';
import axios from 'axios';

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'An error occurred',
        code: error.response?.data?.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      };
      throw apiError;
    }
    throw error;
  }
}