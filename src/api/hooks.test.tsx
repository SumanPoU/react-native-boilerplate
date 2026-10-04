import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import AxiosMockAdapter from "axios-mock-adapter";
import type { ReactNode } from "react";
import { z } from "zod";
import { axiosInstance } from "@/api/client";
import {
  useApiFormMutation,
  useApiFormMutationNOC,
  useApiInfiniteQuery,
  useApiMutation,
  useApiQuery,
} from "@/api/hooks";
import { showToast } from "@/native/toast";
import type { BackendResponse } from "@/types/api";

jest.mock("@/native/toast", () => ({ showToast: jest.fn() }));

jest.mock("@/native/auth-storage", () => ({
  authStorage: { getAccessToken: jest.fn().mockResolvedValue(null) },
}));

const mockAxios = new AxiosMockAdapter(axiosInstance);
const mockShowToast = jest.mocked(showToast);
const queryClients: QueryClient[] = [];

beforeAll(() => {
  axiosInstance.defaults.baseURL = "https://api.test";
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  });

  queryClients.push(queryClient);
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

afterEach(() => {
  mockAxios.reset();
  queryClients.forEach((queryClient) => {
    queryClient.clear();
  });
  queryClients.length = 0;
});

describe("API query hooks", () => {
  it("loads and validates query data", async () => {
    mockAxios.onGet("/users").reply(200, {
      error: false,
      message: "Loaded",
      data: [{ id: "user-1" }],
    });

    const { result } = await renderHook(
      () =>
        useApiQuery({
          queryKey: ["users"],
          endpoint: "/users",
          dataSchema: z.array(z.object({ id: z.string() })),
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual([{ id: "user-1" }]);
  });

  it("sends a mutation and validates its response", async () => {
    mockAxios.onPost("/users").reply(201, {
      error: false,
      message: "Created",
      data: { id: "user-2" },
    });

    const { result } = await renderHook(
      () =>
        useApiMutation({
          endpoint: "/users",
          dataSchema: z.object({ id: z.string() }),
        }),
      { wrapper: createWrapper() },
    );

    let response: BackendResponse<{ id: string }> | undefined;
    await act(async () => {
      response = await result.current.mutateAsync({ name: "User" });
    });
    expect(response?.data).toEqual({ id: "user-2" });
  });

  it("shows backend mutation errors and preserves the caller error callback", async () => {
    const onError = jest.fn();
    mockAxios.onPost("/users").reply(422, {
      error: true,
      message: "Validation failed",
      errors: [{ field: "email", message: "Invalid email" }],
    });

    const { result } = await renderHook(
      () =>
        useApiMutation({
          endpoint: "/users",
          dataSchema: z.object({ id: z.string() }),
          options: { onError },
        }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await expect(
        result.current.mutateAsync({ email: "bad" }),
      ).rejects.toMatchObject({ message: "Validation failed" });
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      title: "Validation failed",
      message: "email: Invalid email",
      preset: "error",
    });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("includes a custom frontend message in the API error toast", async () => {
    mockAxios.onPost("/users").reply(500, {
      error: true,
      message: "Service unavailable",
    });

    const { result } = await renderHook(
      () =>
        useApiMutation({
          endpoint: "/users",
          dataSchema: z.object({ id: z.string() }),
          errorToast: {
            fallbackTitle: "Save failed",
            frontendMessage: "Please try again later.",
          },
        }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await expect(
        result.current.mutateAsync({ email: "person@example.com" }),
      ).rejects.toBeDefined();
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      title: "Service unavailable",
      message: "Please try again later.",
      preset: "error",
    });
  });

  it("sends a standard multipart mutation using method override", async () => {
    mockAxios.onPost("/documents").reply((config) => {
      const formData = config.data as FormData;
      expect(formData.get("_method")).toBe("PATCH");
      expect(formData.get("title")).toBe("Statement");
      return [
        200,
        { error: false, message: "Uploaded", data: { id: "doc-1" } },
      ];
    });

    const { result } = await renderHook(
      () =>
        useApiFormMutation<{ id: string }, { title: string }>({
          endpoint: "/documents",
          method: "PATCH",
          dataSchema: z.object({ id: z.string() }),
        }),
      { wrapper: createWrapper() },
    );

    let response: BackendResponse<{ id: string }> | undefined;
    await act(async () => {
      response = await result.current.mutateAsync({ title: "Statement" });
    });
    expect(response?.data?.id).toBe("doc-1");
  });

  it("sends NOC multipart fields with bracket notation", async () => {
    mockAxios.onPost("/noc").reply((config) => {
      const formData = config.data as FormData;
      expect(formData.get("applicant[name]")).toBe("Example");
      expect(formData.get("reviewer[]")).toBe("");
      return [
        200,
        { error: false, message: "Submitted", data: { id: "noc-1" } },
      ];
    });

    const { result } = await renderHook(
      () =>
        useApiFormMutationNOC<
          { id: string },
          { applicant: { name: string }; reviewer: string[] }
        >({
          endpoint: "/noc",
          dataSchema: z.object({ id: z.string() }),
        }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      await result.current.mutateAsync({
        applicant: { name: "Example" },
        reviewer: [],
      });
    });
  });

  it("fetches paged data with a caller-provided next-page rule", async () => {
    mockAxios.onGet("/posts").reply((config) => {
      const page = Number(config.params?.page);
      return [
        200,
        {
          error: false,
          message: "Loaded",
          data: { items: [`page-${page}`], nextPage: page === 1 ? 2 : null },
        },
      ];
    });

    const { result } = await renderHook(
      () =>
        useApiInfiniteQuery({
          queryKey: ["posts"],
          endpoint: "/posts",
          initialPageParam: 1,
          dataSchema: z.object({
            items: z.array(z.string()),
            nextPage: z.number().nullable(),
          }),
          options: {
            getNextPageParam: (lastPage) =>
              lastPage.data?.nextPage ?? undefined,
          },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));
    await act(async () => result.current.fetchNextPage());
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.data?.pages).toHaveLength(2);
    expect(result.current.data?.pages[1]?.data?.items).toEqual(["page-2"]);
  });
});
