import { ApiResponse, PaginationMeta } from "@/types/api";
import { RequestOptions } from "./types";

export class MockAdapter {
  private delay: number = 300; // Simulate network delay
  private mockData: Map<string, any> = new Map();

  constructor(delay: number = 300) {
    this.delay = delay;
  }

  /**
   * Register mock data for an endpoint
   */
  registerData(endpoint: string, data: any) {
    this.mockData.set(endpoint, data);
  }

  private simulateDelay() {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  /**
   * Parse query params and apply filtering, sorting, pagination
   */
  private applyQueryParams<T>(
    data: T[],
    params?: Record<string, any>
  ): { data: T[]; meta: PaginationMeta } {
    let result = [...data];
    const page = Number(params?.page) || 1;
    const perPage = Number(params?.perPage) || 10;

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter((item: any) => {
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply custom filters
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          result = result.filter((item: any) => {
            if (Array.isArray(value)) {
              return value.includes(item[key]);
            }
            return item[key] === value;
          });
        }
      });
    }

    // Apply sorting
    if (params?.sortBy) {
      const sortField = params.sortBy;
      const sortOrder = params.sortOrder || "asc";
      result.sort((a: any, b: any) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Calculate pagination
    const total = result.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedData = result.slice(startIndex, startIndex + perPage);

    return {
      data: paginatedData,
      meta: {
        page,
        perPage,
        total,
        totalPages,
      },
    };
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    await this.simulateDelay();

    const data = this.mockData.get(endpoint);
    if (!data) {
      throw new Error(`Mock data not found for endpoint: ${endpoint}`);
    }

    // If data is an array, apply pagination and filtering
    if (Array.isArray(data)) {
      const result = this.applyQueryParams(data, options?.params);
      return {
        data: result.data as T,
        meta: result.meta,
      };
    }

    // Otherwise return data as-is
    return { data };
  }

  async post<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    await this.simulateDelay();

    // For POST, we simulate creating a new resource
    const newItem = {
      id: `mock-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock data if it's a collection
    const existingData = this.mockData.get(endpoint);
    if (Array.isArray(existingData)) {
      existingData.push(newItem);
    }

    return {
      data: newItem as T,
    };
  }

  async patch<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    await this.simulateDelay();

    // For PATCH, simulate updating a resource
    const updatedItem = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      data: updatedItem as T,
    };
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    await this.simulateDelay();

    // Simulate successful deletion
    return {
      data: { success: true } as T,
    };
  }

  async put<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    await this.simulateDelay();

    // For PUT, simulate replacing a resource
    const updatedItem = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      data: updatedItem as T,
    };
  }
}
