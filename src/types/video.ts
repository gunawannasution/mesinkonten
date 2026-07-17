export interface VideoProps {
  judul: string;
  bahasa: "javascript" | "typescript" | "python" | "html" | "css" | "web";
  
  // Legacy (tetap support)
  kode?: string;
  
  // Reusable Web Mode
  html?: string;
  css?: string;
  js?: string;
  
  suaraUrl: string;
  narasi: string;
  
  // Console output
  output?: string;

  // 🌟 Properti Tambahan Baru untuk Intro & Outro Dinamis (Opsional)
  durasiIntroDetik?: number;
  durasiOutroDetik?: number;
  teksIntroSub?: string;
  teksOutroUtama?: string;
}
