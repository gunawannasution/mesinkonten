// bikin-suara.ts
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { VideoProps } from "./src/types/video";

interface KontenJson extends VideoProps {
  id: string;
  durasiDetik?: number;
}

const PATH_KONTEN = path.join(process.cwd(), "konten.json");
const FOLDER_PUBLIC = path.join(process.cwd(), "public");

function loadKonten(): KontenJson[] {
  try {
    if (!fs.existsSync(PATH_KONTEN)) {
      throw new Error("File konten.json tidak ditemukan.");
    }
    const raw = fs.readFileSync(PATH_KONTEN, "utf8");
    return JSON.parse(raw) as KontenJson[];
  } catch (error) {
    console.error("❌ Gagal membaca atau memparsing konten.json:");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

function ensurePublicFolder() {
  if (!fs.existsSync(FOLDER_PUBLIC)) {
    fs.mkdirSync(FOLDER_PUBLIC, { recursive: true });
  }
}

function dapatkanDurasiMp3(filePath: string): number {
  const stats = fs.statSync(filePath);
  const bitrateKbps = 48; 
  return (stats.size * 8) / (bitrateKbps * 1000);
}

/**
 * ─── ENGINE EKSEKUSI FILE FISIK (100% REAL RUNTIME INTERPRETER) ───
 * Membuat file fisik sementara agar indentasi dan struktur kode terbaca sempurna oleh mesin Node/Python
 */
function eksekusiKodeAsli(bahasa: string, kode: string, id: string): string {
  const tempJsFile = path.join(process.cwd(), `temp_${id}.js`);
  const tempPyFile = path.join(process.cwd(), `temp_${id}.py`);

  try {
    if (bahasa === "javascript" || bahasa === "typescript") {
      // Tulis file JS fisik sementara
      fs.writeFileSync(tempJsFile, kode, "utf8");
      // Eksekusi langsung via Node.js
      const output = execSync(`node "${tempJsFile}"`, { timeout: 3000 }).toString().trim();
      // Bersihkan file sementara
      if (fs.existsSync(tempJsFile)) fs.unlinkSync(tempJsFile);
      return output;
    } 
    
    if (bahasa === "python") {
      // Tulis file Python fisik sementara (Menjaga keutuhan indentasi tab/spasi \n)
      fs.writeFileSync(tempPyFile, kode, "utf8");
      // Eksekusi langsung lewat interpreter Python asli komputer lu
      const output = execSync(`python "${tempPyFile}"`, { timeout: 3000 }).toString().trim();
      // Bersihkan file sementara
      if (fs.existsSync(tempPyFile)) fs.unlinkSync(tempPyFile);
      return output;
    }
    
    return ""; 
} catch (error: unknown) {
    // Hapus file temporary meskipun terjadi error
    if (fs.existsSync(tempJsFile)) {
      fs.unlinkSync(tempJsFile);
    }
  
    if (fs.existsSync(tempPyFile)) {
      fs.unlinkSync(tempPyFile);
    }
  
    // Ambil pesan error dengan aman
    if (
      typeof error === "object" &&
      error !== null &&
      "stderr" in error
    ) {
      const stderr = (error as { stderr?: Buffer | string }).stderr;
  
      if (stderr) {
        return `Error: ${stderr.toString().trim()}`;
      }
    }
  
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
  
    return `Error: ${String(error)}`;
  }
}

async function jalankanTTS() {
  console.log("🔊 Memulai konversi teks, eksekusi file fisik, dan generate suara...");

  const dataKonten = loadKonten();
  ensurePublicFolder();

  const tts = new MsEdgeTTS();

  try {
    await tts.setMetadata("id-ID-ArdiNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    console.log("✅ Metadata TTS berhasil di-set.");
  } catch (error) {
    console.error("❌ Gagal menghubungkan metadata TTS:", error);
    process.exit(1);
  }

  const hasilKontenDiperbarui: KontenJson[] = [];

  for (const konten of dataKonten) {
    const idUnik = konten.id;
    if (!idUnik || !konten.narasi?.trim()) continue;

    const targetFolder = path.join(FOLDER_PUBLIC, `folder-${idUnik}`);
    const finalFile = path.join(FOLDER_PUBLIC, `suara-${idUnik}.mp3`);

    console.log(`🎙️  Memproses video: ${konten.judul ?? idUnik}`);

    try {
      if (fs.existsSync(targetFolder)) fs.rmSync(targetFolder, { recursive: true, force: true });
      fs.mkdirSync(targetFolder, { recursive: true });
      if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);

      // 1. Generate Suara Premium
      await tts.toFile(targetFolder, konten.narasi, { rate: "0%", pitch: "0Hz", volume: "0%" });
      const generatedFile = path.join(targetFolder, "audio.mp3");
      if (!fs.existsSync(generatedFile)) throw new Error("File audio tidak ditemukan.");
      fs.renameSync(generatedFile, finalFile);
      fs.rmSync(targetFolder, { recursive: true, force: true });

      const durasi = dapatkanDurasiMp3(finalFile);

      // 2. EKSEKUSI NYATA VIA FILE FISIK
      console.log(`💻 Menjalankan file *.py/*.js nyata untuk ID: ${idUnik}...`);
      const hasilEksekusiNyata = eksekusiKodeAsli(konten.bahasa, konten.kode, idUnik);

      hasilKontenDiperbarui.push({
        ...konten,
        durasiDetik: durasi,
        output: hasilEksekusiNyata
      });

      console.log(`✅ Sukses Real! Output: "${hasilEksekusiNyata.replace(/\r?\n/g, " ")}"`);
    } catch (error) {
      console.error(`❌ Gagal memproses ${idUnik}:`, error);
    }
  }

  fs.writeFileSync(PATH_KONTEN, JSON.stringify(hasilKontenDiperbarui, null, 2), "utf8");
  console.log("\n🎉 HORE! Eksekusi file fisik Python & JS selesai. Hasil dijamin 100% Nyata.");
}

jalankanTTS();