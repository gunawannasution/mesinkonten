export interface ThemeConfig {
  name: string;
  primaryColor: string;
  textColor: string;
}

export const LANGUAGE_THEMES: Record<string, ThemeConfig> = {
  javascript: {
    name: "JavaScript",
    // PERBAIKAN: Menggunakan Kuning Neon Vibrant agar efek glow di latar belakang terlihat mewah dan berpijar indah
    primaryColor: "#ffe600", 
    textColor: "#000000", 
  },
  typescript: {
    name: "TypeScript",
    // PERBAIKAN: Menggunakan Biru Cyan Elektrik agar kontras pendaran cahaya di atas latar belakang gelap maksimal
    primaryColor: "#38bdf8", 
    textColor: "#ffffff",
  },
  python: {
    name: "Python",
    // PERBAIKAN: Menggunakan Biru Mint Modern khas tema editor Dracula/OneDark
    primaryColor: "#4facfe", 
    textColor: "#ffffff",
  },
  html: {
    name: "HTML",
    // PERBAIKAN: Menggunakan Oranye Coral Terang agar teks badge dan garis aksen terlihat menyala tajam
    primaryColor: "#ff6b4a", 
    textColor: "#ffffff",
  },
  css: {
    name: "CSS",
    // PERBAIKAN: Menggunakan Biru Neon Safir agar gradasi kosmetik di dalam CodeBox terlihat hidup
    primaryColor: "#2563eb", 
    textColor: "#ffffff",
  },
};
