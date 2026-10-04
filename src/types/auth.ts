import type { ZodType } from "zod";
import type { ApiMutationOptions } from "@/types/api";

export interface AuthMutationConfig<TData, TVariables> {
  dataSchema: ZodType<TData>;
  options?: ApiMutationOptions<TData, TVariables>;
}

export interface AuthTokenPair {
  access_token: string;
  refresh_token: string;
}
