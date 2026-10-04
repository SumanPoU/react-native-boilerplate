import AxiosMockAdapter from "axios-mock-adapter";
import { z } from "zod";
import { authKeys, getUserRoles } from "@/api/auth";
import { axiosInstance } from "@/api/client";

jest.mock("@/native/auth-storage", () => ({
  authStorage: { getAccessToken: jest.fn().mockResolvedValue(null) },
}));

jest.mock("@/native/toast", () => ({ showToast: jest.fn() }));

const mockAxios = new AxiosMockAdapter(axiosInstance);

beforeAll(() => {
  axiosInstance.defaults.baseURL = "https://api.test";
});

afterEach(() => mockAxios.reset());

describe("auth API", () => {
  it("fetches and validates user roles", async () => {
    mockAxios.onGet("/api/admin/users/42/roles").reply(200, {
      error: false,
      message: "Roles loaded",
      data: ["analyst", "reviewer"],
    });

    const response = await getUserRoles(42, z.array(z.string()));

    expect(response.data).toEqual(["analyst", "reviewer"]);
    expect(authKeys.roles(42)).toEqual(["auth", "roles", 42]);
  });
});
