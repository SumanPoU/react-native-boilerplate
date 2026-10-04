import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  get,
  parseBackendResponse,
  patch,
  post,
  postForm,
  put,
  remove,
} from "@/api/client";
import { serializeFormData } from "@/api/form-data";
import { showBackendErrors } from "@/lib/show-backend-errors";
import type {
  ApiFormMutationConfig,
  ApiInfiniteQueryConfig,
  ApiMutationConfig,
  ApiQueryConfig,
  BackendResponse,
} from "@/types/api";

export function useApiQuery<TData, TSelected = BackendResponse<TData>>({
  queryKey,
  endpoint,
  dataSchema,
  params,
  options,
}: ApiQueryConfig<TData, TSelected>) {
  return useQuery({
    queryKey,
    queryFn: async ({ signal }) =>
      parseBackendResponse(await get(endpoint, params, signal), dataSchema),
    ...options,
  });
}

export function useApiMutation<TData, TVariables>({
  endpoint,
  dataSchema,
  method = "POST",
  invalidateQueries = [],
  errorToast,
  options,
}: ApiMutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...mutationOptions } = options ?? {};

  return useMutation({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      const url =
        typeof endpoint === "function" ? endpoint(variables) : endpoint;
      let response: BackendResponse<unknown>;

      switch (method) {
        case "POST":
          response = await post(url, variables);
          break;
        case "PUT":
          response = await put(url, variables);
          break;
        case "PATCH":
          response = await patch(url, variables);
          break;
        case "DELETE":
          response = await remove(url, variables);
          break;
      }

      return parseBackendResponse(response, dataSchema);
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all(
        invalidateQueries.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      await onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: async (error, variables, onMutateResult, context) => {
      showBackendErrors(error, errorToast);
      await onError?.(error, variables, onMutateResult, context);
    },
  });
}

export function useApiFormMutation<
  TData,
  TVariables extends Record<string, unknown>,
>(config: ApiFormMutationConfig<TData, TVariables>) {
  return useFormMutation(config, "standard");
}

export function useApiFormMutationNOC<
  TData,
  TVariables extends Record<string, unknown>,
>(config: ApiFormMutationConfig<TData, TVariables>) {
  return useFormMutation(config, "noc");
}

function useFormMutation<TData, TVariables extends Record<string, unknown>>(
  {
    endpoint,
    dataSchema,
    method = "POST",
    invalidateQueries = [],
    errorToast,
    options,
  }: ApiFormMutationConfig<TData, TVariables>,
  mode: "standard" | "noc",
) {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...mutationOptions } = options ?? {};

  return useMutation({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      const url =
        typeof endpoint === "function" ? endpoint(variables) : endpoint;
      const formData = serializeFormData(variables, { method, mode });
      const response = await postForm<unknown>(url, formData);
      return parseBackendResponse(response, dataSchema);
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all(
        invalidateQueries.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      await onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: async (error, variables, onMutateResult, context) => {
      showBackendErrors(error, errorToast);
      await onError?.(error, variables, onMutateResult, context);
    },
  });
}

export function useApiInfiniteQuery<TData>({
  queryKey,
  endpoint,
  dataSchema,
  initialPageParam,
  pageParamName = "page",
  params,
  options,
}: ApiInfiniteQueryConfig<TData>) {
  return useInfiniteQuery({
    queryKey,
    initialPageParam,
    queryFn: async ({ pageParam, signal }) =>
      parseBackendResponse(
        await get(endpoint, { ...params, [pageParamName]: pageParam }, signal),
        dataSchema,
      ),
    ...options,
  });
}
