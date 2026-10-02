import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME_OPTIONS } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function HomeRoute() {
  const insets = useSafeAreaInsets();
  const themePreference = useSettingsStore((state) => state.themePreference);
  const setThemePreference = useSettingsStore(
    (state) => state.setThemePreference,
  );

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <Text className="text-2xl font-semibold text-foreground">
        Hello, world!
      </Text>
      <View className="mt-8 items-center gap-3">
        <Text className="text-base font-medium text-foreground">
          Appearance
        </Text>
        <View className="flex-row gap-2">
          {THEME_OPTIONS.map(({ label, value }) => {
            const isSelected = themePreference === value;

            return (
              <Pressable
                key={value}
                accessibilityLabel={`${label} theme`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={cn(
                  "min-h-11 justify-center rounded-full border px-4",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-card",
                )}
                onPress={() => setThemePreference(value)}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
