import { serializeFormData } from "@/api/form-data";

describe("serializeFormData", () => {
  it("uses a method override and JSON-encodes nested objects", () => {
    const formData = serializeFormData(
      { name: "Example", metadata: { source: "mobile" } },
      { method: "PUT", mode: "standard" },
    );

    expect(formData.get("_method")).toBe("PUT");
    expect(formData.get("name")).toBe("Example");
    expect(formData.get("metadata")).toBe('{"source":"mobile"}');
  });

  it("expands nested NOC fields and preserves designated empty arrays", () => {
    const formData = serializeFormData(
      {
        reviewer: [],
        emergency_contacts: [],
        additional_document: [],
        applicant: { name: "Example" },
        roles: ["reviewer", "approver"],
      },
      { method: "POST", mode: "noc" },
    );

    expect(formData.get("reviewer[]")).toBe("");
    expect(formData.get("emergency_contacts[]")).toBe("");
    expect(formData.get("additional_document[]")).toBe("");
    expect(formData.get("applicant[name]")).toBe("Example");
    expect(formData.get("roles[1]")).toBe("approver");
  });
});
