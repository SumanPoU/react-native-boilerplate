import type { THEME_OPTIONS } from "@/constants/theme";

export type ThemePreference = (typeof THEME_OPTIONS)[number]["value"];

export interface SettingsState {
  themePreference: ThemePreference;
  setThemePreference: (themePreference: ThemePreference) => void;
}
