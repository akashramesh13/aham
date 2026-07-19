import { Theme } from "@/types/theme";

export const lightTheme: Theme = {
  background: "#F5F5F7", // Apple-like subtle light gray
  surface: "#FFFFFF",
  surface2: "#F3F4F6",
  text: "#1D1D1F", // Apple text color
  textSecondary: "#86868B",
  border: "#E5E5EA",
  accent: "#EA580C",
  glassBackground: "rgba(255, 255, 255, 0.35)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
};

export const terminalTheme: Theme = {
  background: "#000000",
  surface: "#0A0A0A",
  surface2: "#151515",
  text: "#E8E8E8",
  textSecondary: "#A0A0A0",
  border: "#222222",
  accent: "#22C55E",
  glassBackground: "rgba(10, 10, 10, 0.4)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
};
