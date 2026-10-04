import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { ZodType } from "zod";
import type { BackendErrorToastOptions } from "@/types/toast";

export type { InfiniteData, QueryKey } from "@tanstack/react-query";

export interface FieldError {
  field: string;
  message: string;
}

export interface BackendResponse<TData = unknown> {
  error: boolean;
  message: string;
  data?: TData;
  errors?: FieldError[];
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  errors?: FieldError[];
  password_expired?: boolean;
}

export type QueryParamValue = string | number | boolean | string[] | number[];
export type QueryParams = Record<string, QueryParamValue | undefined | null>;
export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";
export type FormMutationMethod = Exclude<MutationMethod, "DELETE">;
export type Endpoint<TVariables> = string | ((variables: TVariables) => string);
export type ViewMode = "table" | "card";
export type ExportFormat = "xlsx" | "pdf" | "csv";

export interface NativeFileAsset {
  uri: string;
  name: string;
  type: string;
}

export interface SerializeFormDataOptions {
  method: FormMutationMethod;
  mode: "standard" | "noc";
}

export interface ApiQueryConfig<TData, TSelected> {
  queryKey: QueryKey;
  endpoint: string;
  dataSchema: ZodType<TData>;
  params?: QueryParams;
  options?: ApiQueryOptions<TData, TSelected>;
}

export interface ApiMutationConfig<TData, TVariables> {
  endpoint: Endpoint<TVariables>;
  dataSchema: ZodType<TData>;
  method?: MutationMethod;
  invalidateQueries?: QueryKey[];
  errorToast?: BackendErrorToastOptions;
  options?: ApiMutationOptions<TData, TVariables>;
}

export interface ApiFormMutationConfig<TData, TVariables> {
  endpoint: Endpoint<TVariables>;
  dataSchema: ZodType<TData>;
  method?: FormMutationMethod;
  invalidateQueries?: QueryKey[];
  errorToast?: BackendErrorToastOptions;
  options?: ApiMutationOptions<TData, TVariables>;
}

export interface ApiInfiniteQueryConfig<TData> {
  queryKey: QueryKey;
  endpoint: string;
  dataSchema: ZodType<TData>;
  initialPageParam: number;
  pageParamName?: string;
  params?: QueryParams;
  options: ApiInfiniteQueryOptions<TData>;
}

export type QueryOptions<TData, TSelected = BackendResponse<TData>> = Omit<
  UseQueryOptions<BackendResponse<TData>, ApiError, TSelected, QueryKey>,
  "queryKey" | "queryFn"
>;

export type ApiQueryOptions<
  TData,
  TSelected = BackendResponse<TData>,
> = QueryOptions<TData, TSelected>;

export type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<BackendResponse<TData>, ApiError, TVariables>,
  "mutationFn"
>;

export type ApiMutationOptions<TData, TVariables> = MutationOptions<
  TData,
  TVariables
>;

export type InfiniteQueryOptions<TData> = Omit<
  UseInfiniteQueryOptions<
    BackendResponse<TData>,
    ApiError,
    InfiniteData<BackendResponse<TData>, number>,
    QueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam"
>;

export type ApiInfiniteQueryOptions<TData> = InfiniteQueryOptions<TData>;

export interface QueryProviderProps {
  children: React.ReactNode;
}
