import type { WelcomeStep } from "@/types/welcome";

export const APP_BRANDING = {
  englishName: "Karja Suchana Kendra Limited",
  nepaliName: "कर्जा सूचना केन्द्र लिमिटेड",
  description: "Credit information Bureau of Nepal",
  logoAccessibilityLabel: "Karja Suchana Kendra Limited logo",
} as const;

export const WELCOME_STEPS = [
  {
    id: "clarity",
    eyebrow: "A clearer view of credit",
    title: "Clarity creates confidence.",
    description:
      "Reliable credit information helps bring confidence to every financial decision.",
  },
  {
    id: "insight",
    eyebrow: "Information you can trust",
    title: "Make every insight count.",
    description:
      "Support informed decisions with clear, dependable credit information.",
  },
  {
    id: "identity",
    eyebrow: APP_BRANDING.description,
    title: APP_BRANDING.englishName,
    description: APP_BRANDING.nepaliName,
  },
] satisfies readonly WelcomeStep[];
