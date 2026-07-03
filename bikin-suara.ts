import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { VideoProps } from "./src/types/video";

// --- Konfigurasi Path ---
const PATH_KONTEN = path.join(process.cwd(), "konten.json");
const FOLDER_PUBLIC = path.join(process.cwd(), "public");

interface KontenJson extends VideoProps {
  id: string;
  durasiDetik?: number;
}

// Helper untuk jeda file locking
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * UTILS: Eksekusi Kode
 */
function eksekusiKodeAsli(bahasa: string, kode: string, id: string): string {
  if (["html", "css", "web"].includes(bahasa)) {
    return "Layout rendered successfully.";
  }
  
  if (!kode.trim()) return "Tidak ada kode.";

  const extension = bahasa === 'python' ? 'py' : 'js';
  const runtime = bahasa === 'python' ? 'python' : 'node';
  const tempFile = path.join(process.cwd(), `temp_${id}.${extension}`);
  
  try {
    fs.writeFileSync(tempFile, kode, "utf8");
    
    const result = spawnSync(runtime, [tempFile], { 
      timeout: 3000,
      encoding: 'utf-8' 
    });

    if (result.error) return `Error: ${result.error.message}`;
    if (result.stderr) return `Error: ${result.stderr.trim()}`;
    
    return result.stdout.trim() || "Kode berhasil dijalankan (tanpa output).";
  } catch (error: unknown) {
    // Variabel 'error' digunakan di sini
    const pesan = error instanceof Error ? error.message : String(error);
    return `System Error: ${pesan}`;
  } finally {
    if (fs.existsSync(tempFile)) {
      try { 
        fs.unlinkSync(tempFile); 
      } catch (e: unknown) { 
        // Variabel 'e' digunakan untuk logging
        console.error("Gagal menghapus file temp:", e); 
      }
    }
  }
}

/**
 * UTILS: Helper Operasi File
 */
function dapatkanDurasiMp3(filePath: string): number {
  const stats = fs.statSync(filePath);
  return (stats.size * 8) / (48 * 1000); 
}

/**
 * MAIN: Proses Utama
 */
async function jalankanTTS(): Promise<void> {
  console.log("🔊 Memulai proses generate...");
  
  if (!fs.existsSync(PATH_KONTEN)) {
    console.error("❌ konten.json tidak ditemukan.");
    return;
  }
  
  if (!fs.existsSync(FOLDER_PUBLIC)) fs.mkdirSync(FOLDER_PUBLIC);

  const dataKonten: KontenJson[] = JSON.parse(fs.readFileSync(PATH_KONTEN, "utf8"));
  const tts = new MsEdgeTTS();
  await tts.setMetadata("id-ID-ArdiNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const konten of dataKonten) {
    try {
      const { id, bahasa, narasi, judul } = konten;
      const finalFile = path.join(FOLDER_PUBLIC, `suara-${id}.mp3`);
      
      console.log(`🎙️ Memproses: ${judul || id}`);

      await tts.toFile(FOLDER_PUBLIC, narasi, { rate: "0%", pitch: "0Hz", volume: "0%" });
      const tempAudio = path.join(FOLDER_PUBLIC, "audio.mp3");
      
      await sleep(800);

      fs.copyFileSync(tempAudio, finalFile);
      fs.unlinkSync(tempAudio);

      const kodeData = ["html", "css", "web"].includes(bahasa) 
        ? [konten.html, konten.css, konten.js].filter(Boolean).join("\n\n")
        : (konten.kode ?? "");

      const output = eksekusiKodeAsli(bahasa, kodeData, id);

      konten.durasiDetik = dapatkanDurasiMp3(finalFile);
      konten.output = output;

      console.log(`✅ Sukses: ${id}`);
    } catch (err: unknown) {
      // Variabel 'err' digunakan untuk logging
      const pesan = err instanceof Error ? err.message : String(err);
      console.error(`❌ Gagal ID ${konten.id}:`, pesan);
    }
  }

  fs.writeFileSync(PATH_KONTEN, JSON.stringify(dataKonten, null, 2), "utf8");
  console.log("\n🎉 Selesai!");
}

jalankanTTS();