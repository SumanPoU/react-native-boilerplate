import { showBackendErrors } from "@/lib/show-backend-errors";
import { showToast } from "@/native/toast";

jest.mock("@/native/toast", () => ({ showToast: jest.fn() }));

const mockedShowToast = jest.mocked(showToast);

beforeEach(() => mockedShowToast.mockClear());

describe("showBackendErrors", () => {
  it("shows the backend message and field errors", () => {
    showBackendErrors({
      message: "Validation failed",
      errors: [{ field: "email", message: "Invalid email" }],
    });

    expect(mockedShowToast).toHaveBeenCalledWith({
      title: "Validation failed",
      message: "email: Invalid email",
      preset: "error",
    });
  });

  it("includes a custom frontend message and supports keyed backend errors", () => {
    showBackendErrors(
      { message: "Request rejected", errors: { password: ["Too short"] } },
      { frontendMessage: "Check the highlighted fields." },
    );

    expect(mockedShowToast).toHaveBeenCalledWith({
      title: "Request rejected",
      message: "Check the highlighted fields.\npassword: Too short",
      preset: "error",
    });
  });

  it("uses the custom frontend message for frontend errors", () => {
    showBackendErrors(new Error("Network unavailable"), {
      fallbackTitle: "Could not sign in",
      frontendMessage: "Check your connection and try again.",
    });

    expect(mockedShowToast).toHaveBeenCalledWith({
      title: "Network unavailable",
      message: "Check your connection and try again.",
      preset: "error",
    });
  });

  it("does not render raw object payloads", () => {
    showBackendErrors({
      message: { payload: "private" },
      errors: { profile: { nested: true } },
    });

    expect(mockedShowToast).toHaveBeenCalledWith({
      title: "Operation failed",
      message: "Something went wrong.",
      preset: "error",
    });
  });
});
