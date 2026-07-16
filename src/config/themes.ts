export interface ThemeConfig {
  name: string;
  primaryColor: string;
  textColor: string;
}

export const LANGUAGE_THEMES: Record<string, ThemeConfig> = {
  javascript: {
    name: "JavaScript",
    primaryColor: "#ffe600", 
    textColor: "#000000", 
  },
  typescript: {
    name: "TypeScript",
    primaryColor: "#38bdf8", 
    textColor: "#ffffff",
  },
  python: {
    name: "Python",
    primaryColor: "#4facfe", 
    textColor: "#ffffff",
  },
  html: {
    name: "HTML",
    primaryColor: "#ff6b4a", 
    textColor: "#ffffff",
  },
  css: {
    name: "CSS",
    primaryColor: "#2563eb", 
    textColor: "#ffffff",
  },
};
