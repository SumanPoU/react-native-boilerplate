import { showToast } from "@/native/toast";
import type { FieldError } from "@/types/api";
import type { BackendErrorToastOptions } from "@/types/toast";

function toDisplayText(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const parts = value
      .map(toDisplayText)
      .filter((part): part is string => part !== null);
    return parts.length > 0 ? parts.join(", ") : null;
  }
  if (value instanceof Error) return toDisplayText(value.message);
  if (typeof value === "object" && "message" in value) {
    return toDisplayText(value.message);
  }
  return null;
}

function getFieldErrorMessages(errors: unknown): string[] {
  if (Array.isArray(errors)) {
    return errors.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const fieldError = item as Partial<FieldError>;
      const message = toDisplayText(fieldError.message);
      if (!message) return [];
      const field = toDisplayText(fieldError.field);
      return [field ? `${field}: ${message}` : message];
    });
  }

  if (!errors || typeof errors !== "object") return [];
  return Object.entries(errors).flatMap(([field, value]) => {
    const message = toDisplayText(value);
    return message ? [`${field}: ${message}`] : [];
  });
}

function getErrorProperty(error: unknown, property: string): unknown {
  if (!error || typeof error !== "object" || !(property in error))
    return undefined;
  return (error as Record<string, unknown>)[property];
}

export function showBackendErrors(
  error: unknown,
  options: BackendErrorToastOptions = {},
): void {
  const backendMessage = toDisplayText(getErrorProperty(error, "message"));
  const fieldMessages = getFieldErrorMessages(
    getErrorProperty(error, "errors"),
  );
  const frontendMessage = toDisplayText(options.frontendMessage);
  const descriptionParts = [frontendMessage, ...fieldMessages].filter(
    (part): part is string => part !== null,
  );

  showToast({
    title: backendMessage ?? options.fallbackTitle ?? "Operation failed",
    message:
      descriptionParts.length > 0
        ? descriptionParts.join("\n")
        : backendMessage
          ? undefined
          : "Something went wrong.",
    preset: "error",
  });
}
