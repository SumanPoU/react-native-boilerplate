import type { NativeFileAsset, SerializeFormDataOptions } from "@/types/api";

export function serializeFormData(
  values: Record<string, unknown>,
  { method, mode }: SerializeFormDataOptions,
): FormData {
  const formData = new FormData();

  if (method !== "POST") formData.append("_method", method);

  for (const [key, value] of Object.entries(values)) {
    appendValue(formData, value, key, mode);
  }

  return formData;
}

function appendValue(
  formData: FormData,
  value: unknown,
  key: string,
  mode: SerializeFormDataOptions["mode"],
): void {
  if (value === undefined || value === null) return;

  if (isNativeFileAsset(value)) {
    formData.append(key, value as unknown as Blob);
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0 && mode === "noc" && isEmptyNocField(key)) {
      formData.append(`${key}[]`, "");
      return;
    }

    value.forEach((item, index) => {
      appendValue(formData, item, `${key}[${index}]`, mode);
    });
    return;
  }

  if (typeof value === "object") {
    if (mode === "standard") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      appendValue(formData, nestedValue, `${key}[${nestedKey}]`, mode);
    }
    return;
  }

  formData.append(key, String(value));
}

function isNativeFileAsset(value: unknown): value is NativeFileAsset {
  return (
    typeof value === "object" &&
    value !== null &&
    "uri" in value &&
    typeof value.uri === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "type" in value &&
    typeof value.type === "string"
  );
}

function isEmptyNocField(key: string): boolean {
  return NOC_EMPTY_ARRAY_FIELDS.some((field) => field === key);
}

export const NOC_EMPTY_ARRAY_FIELDS = [
  "reviewer",
  "emergency_contacts",
  "additional_document",
] as const;
