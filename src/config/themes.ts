// src/config/themes.ts

export interface ThemeConfig {
  name: string;
  primaryColor: string;
  textColor: string;
}

export const LANGUAGE_THEMES: Record<string, ThemeConfig> = {
  javascript: {
    name: "JavaScript",
    primaryColor: "#f7df1e", // Kuning khas JS
    textColor: "#000000",   // Teks hitam agar kontras dengan kuning
  },
  typescript: {
    name: "TypeScript",
    primaryColor: "#3178c6", // Biru TS
    textColor: "#ffffff",   // Teks putih
  },
  python: {
    name: "Python",
    primaryColor: "#3776ab", // Biru Python
    textColor: "#ffffff",
  },
  html: {
    name: "HTML",
    primaryColor: "#e34c26", // Oranye HTML
    textColor: "#ffffff",
  },
  css: {
    name: "CSS",
    primaryColor: "#264de4", // Biru CSS
    textColor: "#ffffff",
  },
};