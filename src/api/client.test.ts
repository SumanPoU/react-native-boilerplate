import AxiosMockAdapter from "axios-mock-adapter";
import { z } from "zod";
import {
  axiosInstance,
  get,
  normalizeApiError,
  parseBackendResponse,
  serializeQueryParams,
} from "@/api/client";

jest.mock("@/native/auth-storage", () => ({
  authStorage: { getAccessToken: jest.fn().mockResolvedValue(null) },
}));

const mockAxios = new AxiosMockAdapter(axiosInstance);

beforeAll(() => {
  axiosInstance.defaults.baseURL = "https://api.test";
});

afterEach(() => mockAxios.reset());

describe("api client", () => {
  it("fetches an envelope and serializes array query parameters", async () => {
    mockAxios.onGet("/records").reply(200, {
      error: false,
      message: "Loaded",
      data: [{ id: "record-1" }],
    });

    const response = await get("/records", { status: ["open", "closed"] });

    expect(response.message).toBe("Loaded");
    expect(serializeQueryParams({ status: ["open", "closed"] })).toBe(
      "status%5B0%5D=open&status%5B1%5D=closed",
    );
  });

  it("parses response data with the endpoint schema", () => {
    const response = parseBackendResponse(
      { error: false, message: "Loaded", data: { id: "record-1" } },
      z.object({ id: z.string() }),
    );

    expect(response.data).toEqual({ id: "record-1" });
    expect(() =>
      parseBackendResponse(
        { error: false, message: "Loaded", data: { id: 42 } },
        z.object({ id: z.string() }),
      ),
    ).toThrow();
  });

  it("normalizes backend errors", () => {
    const error = normalizeApiError({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          error: true,
          message: "Validation failed",
          errors: [{ field: "email", message: "Invalid email" }],
        },
      },
      message: "Request failed",
    });

    expect(error).toEqual({
      message: "Validation failed",
      status: 422,
      errors: [{ field: "email", message: "Invalid email" }],
    });
  });
});
