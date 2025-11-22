/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from "axios";
import { getToken } from "../auth0";
import { ApiResponse } from "../types/response";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export interface ApiClientRequestConfig<D = any> extends AxiosRequestConfig<D> {
  returnApiResponse?: boolean;
}

interface TypedAxiosInstance
  extends Omit<
    AxiosInstance,
    "get" | "post" | "put" | "delete" | "patch" | "request"
  > {
  get<T = unknown, D = any>(
    url: string,
    config?: ApiClientRequestConfig<D>
  ): Promise<T>;
    post<T = unknown, D = any>(
    url: string,
    data?: D,
    config?: ApiClientRequestConfig<D>
  ): Promise<T>;
    put<T = unknown, D = any>(
    url: string,
    data?: D,
    config?: ApiClientRequestConfig<D>
  ): Promise<T>;
    delete<T = unknown, D = any>(
    url: string,
    config?: ApiClientRequestConfig<D>
  ): Promise<T>;
    patch<T = unknown, D = any>(
    url: string,
    data?: D,
    config?: ApiClientRequestConfig<D>
  ): Promise<T>;
    request<T = unknown, D = any>(
    config: ApiClientRequestConfig<D>
  ): Promise<T>;
}

const baseClient = axios.create({
  baseURL: API_BASE_URL,
});

const apiClient = baseClient as unknown as TypedAxiosInstance;

// Add a request interceptor to include the Auth0 token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const apiResponse = response.data;
    const returnApiResponse = (response.config as ApiClientRequestConfig).returnApiResponse;

    if (returnApiResponse) {
      return apiResponse;
    }

    if(apiResponse && apiResponse.success) {
      return apiResponse.data;
    }
    return Promise.reject(apiResponse);
  },
  (error: AxiosError<ApiResponse<never>>) => {
    if(error?.response?.status === 401) {
        // Redirect to login on 401
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
    }
    if (error?.response?.data) {
        return Promise.reject(error.response.data as ApiResponse<never>);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
