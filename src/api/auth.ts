import type { ZodType } from "zod";
import { get, parseBackendResponse } from "@/api/client";
import { useApiMutation, useApiQuery } from "@/api/hooks";
import { AUTH_ENDPOINTS } from "@/constants/api-endpoints";
import { authStorage } from "@/native/auth-storage";
import type {
  ApiQueryOptions,
  BackendResponse,
  QueryParams,
} from "@/types/api";
import type { AuthMutationConfig, AuthTokenPair } from "@/types/auth";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  roles: (userId: number) => [...authKeys.all, "roles", userId] as const,
};

export function useRegister<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.register,
    dataSchema,
    options,
  });
}

export function useLogin<TData extends AuthTokenPair, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.login,
    dataSchema,
    options: {
      ...mutationOptions,
      onSuccess: async (response, variables, onMutateResult, context) => {
        if (response.data) {
          await authStorage.setTokens(
            response.data.access_token,
            response.data.refresh_token,
          );
        }
        await onSuccess?.(response, variables, onMutateResult, context);
      },
    },
  });
}

export function useLogout<TData, TVariables = void>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.logout,
    dataSchema,
    options: {
      ...mutationOptions,
      onSuccess: async (response, variables, onMutateResult, context) => {
        await authStorage.clearTokens();
        await onSuccess?.(response, variables, onMutateResult, context);
      },
    },
  });
}

export function useProfile<TData>({
  dataSchema,
  options,
}: {
  dataSchema: ZodType<TData>;
  options?: ApiQueryOptions<TData>;
}) {
  return useApiQuery({
    queryKey: authKeys.profile(),
    endpoint: AUTH_ENDPOINTS.profile,
    dataSchema,
    options,
  });
}

export function useUserRoles<TData>({
  userId,
  dataSchema,
  options,
}: {
  userId: number;
  dataSchema: ZodType<TData>;
  options?: ApiQueryOptions<TData>;
}) {
  return useApiQuery({
    queryKey: authKeys.roles(userId),
    endpoint: AUTH_ENDPOINTS.userRoles(userId),
    dataSchema,
    options,
  });
}

export function useUpdateProfile<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.updateProfile,
    method: "PUT",
    dataSchema,
    invalidateQueries: [authKeys.profile()],
    options,
  });
}

export function useChangePassword<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.changePassword,
    dataSchema,
    options,
  });
}

export function useForgotPassword<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.forgotPassword,
    dataSchema,
    options,
  });
}

export function useVerifyPasswordReset<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.verifyPasswordReset,
    dataSchema,
    options,
  });
}

export function useResetPassword<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.resetPassword,
    dataSchema,
    options,
  });
}

export function useChangePasswordOnExpiry<TData, TVariables>({
  dataSchema,
  options,
}: AuthMutationConfig<TData, TVariables>) {
  return useApiMutation({
    endpoint: AUTH_ENDPOINTS.changePasswordOnExpiry,
    dataSchema,
    options,
  });
}

export function getUserRoles<TData>(
  userId: number,
  dataSchema: ZodType<TData>,
  params?: QueryParams,
): Promise<BackendResponse<TData>> {
  return get(AUTH_ENDPOINTS.userRoles(userId), params).then((response) =>
    parseBackendResponse(response, dataSchema),
  );
}
