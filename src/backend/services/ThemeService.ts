import { SettingsRepository } from "../repositories/SettingsRepository";

import { ThemeMode } from "@/types/theme";

const THEME_KEY = "theme";

export class ThemeService {
  static async getTheme(): Promise<ThemeMode> {
    return (
      ((await SettingsRepository.get(THEME_KEY)) as ThemeMode | null) ??
      "system"
    );
  }

  static async setTheme(theme: ThemeMode) {
    await SettingsRepository.set(THEME_KEY, theme);
  }
}
