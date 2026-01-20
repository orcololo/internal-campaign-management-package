export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}
