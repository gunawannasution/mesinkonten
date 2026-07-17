export interface VideoProps {
  judul: string;
  bahasa: "javascript" | "typescript" | "python" | "html" | "css" | "web";
  kode?: string;
  html?: string;
  css?: string;
  js?: string;
  suaraUrl: string;
  suaraIntroUrl?: string; // Tipe data audio intro
  suaraOutroUrl?: string; // ➔ BARU DITAMBAHKAN: Agar TypeScript tidak memicu error lagi
  narasi: string;
  output?: string;
  durasiIntroDetik?: number;
  durasiOutroDetik?: number;
  teksIntroSub?: string;
  teksOutroUtama?: string;
}
