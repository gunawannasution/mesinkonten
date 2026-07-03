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
    console.error("❌ Gagal membaca atau memparsing konten.json:", error);
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
 * ENGINE EKSEKUSI FILE FISIK
 */
function eksekusiKodeAsli(bahasa: string, kode: string, id: string): string {
  // Guard: Jika bahasa web murni, skip eksekusi runtime Node/Python
  if (["html", "css", "web"].includes(bahasa)) {
    return "Layout rendered successfully.";
  }
  
  if (!kode.trim()) return "Tidak ada kode untuk dieksekusi.";

  const tempJsFile = path.join(process.cwd(), `temp_${id}.js`);
  const tempPyFile = path.join(process.cwd(), `temp_${id}.py`);

  try {
    if (bahasa === "javascript" || bahasa === "typescript") {
      fs.writeFileSync(tempJsFile, kode, "utf8");
      const output = execSync(`node "${tempJsFile}"`, { timeout: 3000 }).toString().trim();
      if (fs.existsSync(tempJsFile)) fs.unlinkSync(tempJsFile);
      return output;
    } 
    
    if (bahasa === "python") {
      fs.writeFileSync(tempPyFile, kode, "utf8");
      const output = execSync(`python "${tempPyFile}"`, { timeout: 3000 }).toString().trim();
      if (fs.existsSync(tempPyFile)) fs.unlinkSync(tempPyFile);
      return output;
    }
    
    return "Bahasa tidak didukung untuk eksekusi runtime."; 
  } catch (error: unknown) { // Ubah 'any' jadi 'unknown'
    if (fs.existsSync(tempJsFile)) fs.unlinkSync(tempJsFile);
    if (fs.existsSync(tempPyFile)) fs.unlinkSync(tempPyFile);

    // Gunakan type guard untuk memeriksa apakah error memiliki properti stderr
    if (
      typeof error === "object" &&
      error !== null &&
      "stderr" in error
    ) {
      const err = error as { stderr: Buffer }; // Casting aman setelah pengecekan
      return `Error: ${err.stderr.toString().trim()}`;
    }

    // Jika error adalah instance dari Error, ambil message-nya
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }

    // Fallback jika error tidak diketahui
    return `Error: ${String(error)}`;
  }
}

async function jalankanTTS() {
  console.log("🔊 Memulai proses generate...");
  const dataKonten = loadKonten();
  ensurePublicFolder();

  const tts = new MsEdgeTTS();
  await tts.setMetadata("id-ID-ArdiNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const hasilKontenDiperbarui: KontenJson[] = [];

  for (const konten of dataKonten) {
    if (!konten.id || !konten.narasi?.trim()) continue;

    const targetFolder = path.join(FOLDER_PUBLIC, `folder-${konten.id}`);
    const finalFile = path.join(FOLDER_PUBLIC, `suara-${konten.id}.mp3`);

    try {
      // Setup Folder
      if (fs.existsSync(targetFolder)) fs.rmSync(targetFolder, { recursive: true, force: true });
      fs.mkdirSync(targetFolder, { recursive: true });

      // Generate Suara
      await tts.toFile(targetFolder, konten.narasi, { rate: "0%", pitch: "0Hz", volume: "0%" });
      const generatedFile = path.join(targetFolder, "audio.mp3");
      fs.renameSync(generatedFile, finalFile);
      fs.rmSync(targetFolder, { recursive: true, force: true });

      // Persiapan Kode
      let kodeUntukDieksekusi = "";
      if (["html", "css", "web"].includes(konten.bahasa)) {
        kodeUntukDieksekusi = [konten.html, konten.css, konten.js].filter(Boolean).join("\n\n");
      } else {
        kodeUntukDieksekusi = konten.kode ?? "";
      }

      // Eksekusi
      const hasilEksekusi = eksekusiKodeAsli(konten.bahasa, kodeUntukDieksekusi, konten.id);

      hasilKontenDiperbarui.push({
        ...konten,
        durasiDetik: dapatkanDurasiMp3(finalFile),
        output: hasilEksekusi
      });

      console.log(`✅ Selesai: ${konten.judul ?? konten.id}`);
    } catch (error) {
      console.error(`❌ Gagal: ${konten.id}`, error);
    }
  }

  fs.writeFileSync(PATH_KONTEN, JSON.stringify(hasilKontenDiperbarui, null, 2), "utf8");
  console.log("\n🎉 Semua proses selesai.");
}

jalankanTTS();