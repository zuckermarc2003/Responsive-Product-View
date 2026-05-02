import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

export function useColors() {
  const scheme = useColorScheme();
  const { theme } = useTheme();
  const palette =
    scheme === "dark" && "dark" in colors
      ? (colors as unknown as Record<string, typeof colors.light>).dark
      : colors.light;
  return {
    ...palette,
    primary: theme.primary,
    tint: theme.primary,
    headerBg: theme.headerBg,
    secondary: theme.secondary,
    secondaryForeground: theme.secondaryForeground,
    radius: colors.radius,
  };
}
