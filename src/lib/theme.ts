import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "expo-router/react-navigation";
import { useColorScheme, vars } from "nativewind";
import { themeColors, themeRadius } from "@/theme/colors";

export function useAppTheme(): {
  navigationTheme: Theme;
  nativeVariables: ReturnType<typeof vars>;
} {
  const { colorScheme } = useColorScheme();
  const mode = colorScheme === "dark" ? "dark" : "light";
  const palette = themeColors[mode];
  const baseTheme = mode === "dark" ? DarkTheme : DefaultTheme;

  const nativeVariables = vars({
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--card": palette.card,
    "--card-foreground": palette.cardForeground,
    "--popover": palette.popover,
    "--popover-foreground": palette.popoverForeground,
    "--primary": palette.primary,
    "--primary-foreground": palette.primaryForeground,
    "--secondary": palette.secondary,
    "--secondary-foreground": palette.secondaryForeground,
    "--muted": palette.muted,
    "--muted-foreground": palette.mutedForeground,
    "--accent": palette.accent,
    "--accent-foreground": palette.accentForeground,
    "--destructive": palette.destructive,
    "--destructive-foreground": palette.destructiveForeground,
    "--border": palette.border,
    "--input": palette.input,
    "--ring": palette.ring,
    "--radius": themeRadius,
    "--chart-1": palette.chart1,
    "--chart-2": palette.chart2,
    "--chart-3": palette.chart3,
    "--chart-4": palette.chart4,
    "--chart-5": palette.chart5,
  });

  const navigationTheme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: `hsl(${palette.background})`,
      border: `hsl(${palette.border})`,
      card: `hsl(${palette.card})`,
      notification: `hsl(${palette.destructive})`,
      primary: `hsl(${palette.primary})`,
      text: `hsl(${palette.foreground})`,
    },
  };

  return { navigationTheme, nativeVariables };
}
