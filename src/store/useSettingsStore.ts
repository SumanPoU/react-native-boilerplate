import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { asyncStorage } from "@/native/storage";
import type { SettingsState } from "@/types/settings";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: "system",
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => asyncStorage),
      version: 1,
      migrate: (persistedState) => persistedState as SettingsState,
    },
  ),
);
