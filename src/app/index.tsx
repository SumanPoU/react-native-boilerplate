import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { APP_BRANDING } from "@/constants/branding";

const SPLASH_DURATION_MS = 2000;

export default function HomeRoute() {
  const insets = useSafeAreaInsets();
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setSplashVisible(false),
      SPLASH_DURATION_MS,
    );

    return () => clearTimeout(timeoutId);
  }, []);

  if (isSplashVisible) {
    return (
      <View
        className="flex-1 items-center justify-center bg-background px-8"
        style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
      >
        <View className="w-full max-w-md items-center rounded-3xl border border-border bg-card px-6 py-10">
          <Image
            accessibilityLabel={APP_BRANDING.logoAccessibilityLabel}
            contentFit="contain"
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
          <View className="mt-6 h-1 w-14 rounded-full bg-secondary" />
          <Text className="mt-7 text-center text-xl font-semibold leading-7 text-primary">
            {APP_BRANDING.englishName}
          </Text>
          <Text className="mt-3 text-center text-xl font-semibold leading-7 text-foreground">
            {APP_BRANDING.nepaliName}
          </Text>
          <Text className="mt-4 text-center text-base leading-6 text-muted-foreground">
            {APP_BRANDING.description}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <Text className="text-2xl font-semibold text-foreground">
        Hello, world!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { height: 160, width: 160 },
});
