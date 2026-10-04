import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { z } from "zod";
import { authStorage } from "@/native/auth-storage";
import type { ApiError, BackendResponse, QueryParams } from "@/types/api";

const FieldErrorSchema = z.object({ field: z.string(), message: z.string() });
const BackendResponseSchema = z.object({
  error: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
  errors: z.array(FieldErrorSchema).optional(),
});

export function serializeQueryParams(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        searchParams.append(`${key}[${index}]`, String(item));
      });
      continue;
    }

    searchParams.append(key, String(value));
  }

  return searchParams.toString();
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: serializeQueryParams,
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.baseURL && !/^https?:\/\//i.test(config.url ?? "")) {
      return Promise.reject({
        message: "Set EXPO_PUBLIC_API_URL before making API requests.",
      } satisfies ApiError);
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const token = await authStorage.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    const envelope = BackendResponseSchema.safeParse(response.data);
    if (envelope.success && envelope.data.error) {
      return Promise.reject({
        message: envelope.data.message,
        status: response.status,
        errors: envelope.data.errors,
      } satisfies ApiError);
    }
    return response;
  },
  (error: AxiosError<unknown>) => Promise.reject(normalizeApiError(error)),
);

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error) && !axios.isAxiosError(error)) return error;

  if (axios.isAxiosError(error)) {
    const response = BackendResponseSchema.safeParse(error.response?.data);
    return {
      message:
        (response.success && response.data.message) ||
        error.message ||
        "The request failed.",
      status: error.response?.status,
      errors: response.success ? response.data.errors : undefined,
    };
  }

  return { message: "An unexpected error occurred." };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    !(error instanceof Error)
  );
}

export async function get<TData>(
  endpoint: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<BackendResponse<TData>> {
  const response = await axiosInstance.get<BackendResponse<TData>>(endpoint, {
    params,
    signal,
  });
  return response.data;
}

export async function post<TData>(
  endpoint: string,
  data: unknown,
): Promise<BackendResponse<TData>> {
  const response = await axiosInstance.post<BackendResponse<TData>>(
    endpoint,
    data,
  );
  return response.data;
}

export async function put<TData>(
  endpoint: string,
  data: unknown,
): Promise<BackendResponse<TData>> {
  const response = await axiosInstance.put<BackendResponse<TData>>(
    endpoint,
    data,
  );
  return response.data;
}

export async function patch<TData>(
  endpoint: string,
  data: unknown,
): Promise<BackendResponse<TData>> {
  const response = await axiosInstance.patch<BackendResponse<TData>>(
    endpoint,
    data,
  );
  return response.data;
}

export async function remove<TData>(
  endpoint: string,
  data?: unknown,
): Promise<BackendResponse<TData>> {
  const response = await axiosInstance.delete<BackendResponse<TData>>(
    endpoint,
    { data },
  );
  return response.data;
}

export async function postForm<TData>(
  endpoint: string,
  formData: FormData,
): Promise<BackendResponse<TData>> {
  const response = await axiosInstance.post<BackendResponse<TData>>(
    endpoint,
    formData,
  );
  return response.data;
}

export const apiClient = { get, post, put, patch, delete: remove, postForm };

export function parseBackendResponse<TData>(
  input: unknown,
  dataSchema: z.ZodType<TData>,
): BackendResponse<TData> {
  const result = BackendResponseSchema.parse(input);
  return {
    error: result.error,
    message: result.message,
    data: result.data === undefined ? undefined : dataSchema.parse(result.data),
    errors: result.errors,
  };
}
