import { MockAdapter } from "./mock-adapter";
import { HttpAdapter } from "./http-adapter";
import { ApiClientConfig, RequestOptions } from "./types";
import { ApiResponse } from "@/types/api";

// Use mock data by default for development
// Set NEXT_PUBLIC_USE_MOCK=false in .env to use real API
const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

type Adapter = MockAdapter | HttpAdapter;

class ApiClient {
  private adapter: Adapter;
  private mockAdapter: MockAdapter;

  constructor(config?: ApiClientConfig) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Always create mock adapter for registration
    this.mockAdapter = new MockAdapter(config?.timeout || 300);

    // Choose adapter based on environment
    if (useMock) {
      this.adapter = this.mockAdapter;
    } else {
      this.adapter = new HttpAdapter(baseURL, config?.timeout || 30000);
    }
  }

  /**
   * Register mock data for an endpoint
   */
  registerMockData(endpoint: string, data: any) {
    this.mockAdapter.registerData(endpoint, data);
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
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

  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.adapter.delete<T>(endpoint, options);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
