// src/types/video.ts
export interface VideoProps {
  judul: string;

  bahasa:
    | "javascript"
    | "typescript"
    | "python"
    | "html"
    | "css"
    | "web";

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
}