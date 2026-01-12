import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api';

// API base URL - defaults to localhost:3001 for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Use mock data by default for development
// Set NEXT_PUBLIC_USE_MOCK=false in .env to use real API
const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

class RealApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token when available
    this.client.interceptors.request.use(
      (config) => {
        // TODO: Add JWT token from auth context when auth is implemented
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // TODO: Redirect to login when auth is implemented
          console.error('Unauthorized - please login');
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(endpoint, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(endpoint, data, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(endpoint, config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload file with multipart/form-data
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await this.client.post<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Download file as blob
   */
  async downloadFile(endpoint: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(endpoint, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        filename || this.getFilenameFromResponse(response) || 'download'
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private getFilenameFromResponse(response: any): string | null {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return null;
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.statusText;
      return new Error(`API Error: ${message}`);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const realApiClient = new RealApiClient();
export { API_BASE_URL, useMock };
