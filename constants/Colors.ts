/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#6366f1";
const tintColorDark = "#818cf8";

export const Colors = {
  light: {
    text: "#1f2937",
    background: "#ffffff",
    tint: tintColorLight,
    tabIconDefault: "#6b7280",
    tabIconSelected: tintColorLight,
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    secondary: "#f59e0b",
    secondaryLight: "#fbbf24",
    secondaryDark: "#d97706",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    surface: {
      primary: "#ffffff",
      secondary: "#f9fafb",
      tertiary: "#f3f4f6",
    },
    border: "#e5e7eb",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    text: "#f9fafb",
    background: "#111827",
    tint: tintColorDark,
    tabIconDefault: "#9ca3af",
    tabIconSelected: tintColorDark,
    primary: "#818cf8",
    primaryLight: "#a5b4fc",
    primaryDark: "#6366f1",
    secondary: "#fbbf24",
    secondaryLight: "#fcd34d",
    secondaryDark: "#f59e0b",
    success: "#34d399",
    error: "#f87171",
    warning: "#fbbf24",
    info: "#60a5fa",
    gray: {
      50: "#111827",
      100: "#1f2937",
      200: "#374151",
      300: "#4b5563",
      400: "#6b7280",
      500: "#9ca3af",
      600: "#d1d5db",
      700: "#e5e7eb",
      800: "#f3f4f6",
      900: "#f9fafb",
    },
    surface: {
      primary: "#1f2937",
      secondary: "#374151",
      tertiary: "#4b5563",
    },
    border: "#374151",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
};
