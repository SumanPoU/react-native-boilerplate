import "../../global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAppTheme } from "@/lib/theme";
import { QueryProvider } from "@/providers/QueryProvider";
import { useSettingsStore } from "@/store/useSettingsStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const themePreference = useSettingsStore((state) => state.themePreference);
  const mode = themePreference === "system" ? colorScheme : themePreference;
  const { navigationTheme, nativeVariables } = getAppTheme(
    mode === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    setColorScheme(themePreference);
  }, [setColorScheme, themePreference]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <View
          className="flex-1 bg-background"
          style={nativeVariables}
          onLayout={() => SplashScreen.hide()}
        >
          <QueryProvider>
            <ThemeProvider value={navigationTheme}>
              <Stack screenOptions={{ headerShown: false }} />
              <PortalHost />
            </ThemeProvider>
          </QueryProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
