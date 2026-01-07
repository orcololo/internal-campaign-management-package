import { MockAdapter } from "./mock-adapter";
import { ApiClientConfig, RequestOptions } from "./types";
import { ApiResponse } from "@/types/api";

// Use mock data by default for development
// Set NEXT_PUBLIC_USE_MOCK=false in .env to use real API
const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

class ApiClient {
  private adapter: MockAdapter;

  constructor(config?: ApiClientConfig) {
    this.adapter = new MockAdapter(config?.timeout || 300);
  }

  /**
   * Register mock data for an endpoint
   */
  registerMockData(endpoint: string, data: any) {
    this.adapter.registerData(endpoint, data);
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.adapter.get<T>(endpoint, options);
  }

  async post<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.adapter.post<T>(endpoint, data, options);
  }

  async patch<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.adapter.patch<T>(endpoint, data, options);
  }

  async put<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.adapter.put<T>(endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.adapter.delete<T>(endpoint, options);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
