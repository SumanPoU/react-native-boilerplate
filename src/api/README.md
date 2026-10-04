# API mutation examples

All request/response contracts belong in `src/types/` or feature schemas. Pass a
Zod schema to each helper so response data is checked at the API boundary.

## JSON mutation

```tsx
const updateProfile = useApiMutation({
  endpoint: "/api/profile",
  method: "PUT",
  dataSchema: ProfileSchema,
  invalidateQueries: [profileKeys.detail()],
});

updateProfile.mutate({ displayName: "Suman" });
```

## Multipart mutation

Use `useApiFormMutation` for regular multipart fields. A file uses the Expo
React Native shape `{ uri, name, type }`. Nested objects are JSON-encoded.

```tsx
const uploadDocument = useApiFormMutation({
  endpoint: "/api/documents",
  dataSchema: DocumentSchema,
  options: { onSuccess: (response) => showMessage(response.message) },
});

uploadDocument.mutate({
  title: "Proof of address",
  document: {
    uri: selectedFile.uri,
    name: selectedFile.name ?? "proof.pdf",
    type: selectedFile.mimeType ?? "application/pdf",
  },
});
```

## NOC multipart mutation

`useApiFormMutationNOC` uses bracket notation for nested objects and keeps
empty `reviewer`, `emergency_contacts`, and `additional_document` arrays in the
multipart body, matching the web helper.

```tsx
const submitNoc = useApiFormMutationNOC({
  endpoint: "/api/noc/applicant",
  method: "PATCH",
  dataSchema: NocApplicationSchema,
});

submitNoc.mutate({
  applicant: { name: "Example" },
  reviewer: [],
  emergency_contacts: [],
  additional_document: [],
});
```

Export/download is intentionally omitted from this mobile helper set for now.
The web implementation uses browser-only download APIs; add a native file and
sharing flow when the app needs it.
