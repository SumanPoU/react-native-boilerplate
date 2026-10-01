import { cn } from "./utils";

describe("cn", () => {
  it("merges conflicting Tailwind classes", () => {
    expect(cn("bg-primary p-2", "p-4")).toBe("bg-primary p-4");
  });

  it("ignores false conditional values", () => {
    expect(cn("text-sm", false && "hidden", undefined)).toBe("text-sm");
  });
});
