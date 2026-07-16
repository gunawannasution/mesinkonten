import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { VideoProps } from "./src/types/video";
import xmlEscape from "xml-escape";

// @ts-ignore
import getMp3Duration from "mp3-duration";

const PATH_KONTEN = path.join(process.cwd(), "konten.json");
const FOLDER_PUBLIC = path.join(process.cwd(), "public");

interface KontenJson extends VideoProps {
  id: string;
  durasiDetik?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const result = spawnSync(runtime, [tempFile], { timeout: 3000, encoding: 'utf-8' });
    
    if (result.error) return "➔ Output:\n⚠️ Proses Gagal (RTO / Batas Waktu Habis)";
    if (result.stderr) return `➔ Output:\n❌ Syntax Error! Periksa kembali penulisan kode kamu.`;
    
    return result.stdout.trim() ? `➔ ${result.stdout.trim()}` : "➔ Kode berhasil dijalankan (tanpa output).";
  } catch (error: unknown) {
    return "➔ Output:\n⚠️ Terjadi kesalahan pada sistem eksekusi.";
  } finally {
    if (fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch (e: unknown) {
        console.error("Gagal menghapus file temp:", e);
      }
    }
  }
}

function hitungDurasiMp3Akurat(filePath: string): Promise<number> {
  return new Promise((resolve) => {
    getMp3Duration(filePath, (err: any, duration: number) => {
      if (err) {
        const stats = fs.statSync(filePath);
        resolve((stats.size * 8) / (48 * 1000));
      } else {
        resolve(duration);
      }
    });
  });
}

async function jalankanTTS(): Promise<void> {
  console.log("🔊 Memulai proses generator otomatis...");

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
      
      console.log(`🎙️ Memproses Audio AI: ${judul || id}`);
      const narasiAman = xmlEscape(narasi); 

      // ISOLASI LAYER CONCURRENCY: Mencegah Overwrite File
      const folderTempUnik = path.join(FOLDER_PUBLIC, `temp_${id}`);
      if (!fs.existsSync(folderTempUnik)) {
        fs.mkdirSync(folderTempUnik, { recursive: true });
      }

      await tts.toFile(folderTempUnik, narasiAman, { rate: "0%", pitch: "0Hz", volume: "0%" });
      const tempAudio = path.join(folderTempUnik, "audio.mp3");
      
      await sleep(600); 

      if (fs.existsSync(tempAudio)) {
        fs.copyFileSync(tempAudio, finalFile);
        fs.unlinkSync(tempAudio);
      } else {
        throw new Error(`File audio.mp3 tidak ditemukan di: ${folderTempUnik}`);
      }

      if (fs.existsSync(folderTempUnik)) fs.rmdirSync(folderTempUnik);

      const kodeData = ["html", "css", "web"].includes(bahasa) 
        ? [konten.html, konten.css, konten.js].filter(Boolean).join("\n\n") 
        : (konten.kode ?? "");

      const output = eksekusiKodeAsli(bahasa, kodeData, id);
      const durasiAkurat = await hitungDurasiMp3Akurat(finalFile);

      konten.durasiDetik = Number(durasiAkurat.toFixed(3));
      konten.output = output;

      console.log(`   ➔ Durasi Riil: ${konten.durasiDetik} detik`);
      console.log(`   ➔ Hasil Output: ${output.substring(0, 40).replace(/\n/g, " ")}...`);
      console.log(`✅ Sukses Sinkronisasi ID: ${id}\n`);

    } catch (err: unknown) {
      const pesan = err instanceof Error ? err.message : String(err);
      console.error(`❌ Gagal pada ID ${konten.id}:`, pesan);
    }
  }

  console.log("📝 Membuat dokumen panduan SEO dan Upload...");
  let teksMetadata = "==================================================\n";
  teksMetadata += "📂 BERKAS PANDUAN UPLOAD METADATA VIDEO (SEO FRIENDLY)\n";
  teksMetadata += "==================================================\n\n";

  for (const konten of dataKonten) {
    teksMetadata += `▶️ ID KOMPOSISI REMOTION : ${konten.id}\n`;
    teksMetadata += `📌 JUDUL VIDEO OPTIMAL   : Rahasia ${konten.judul}! 💻\n`;
    teksMetadata += `📝 DESKRIPSI PLATFORM    : Masih bingung tentang hal ini? Yuk simak tutorial singkat ${konten.bahasa} untuk pemula. Solusi praktis agar kode rapi, efisien, dan mudah dipahami. Simpan video ini biar gak lupa!\n`;
    teksMetadata += `💬 TRANSKRIP SUARA (VO)  : "${konten.narasi}"\n`;
    teksMetadata += `🏷️ HASHTAGS SEO STRATEGIS: #belajarcoding #${konten.bahasa} #programmerindonesia #webdeveloper #codingindonesia #techtok #fyp\n`;
    teksMetadata += "--------------------------------------------------\n\n";
  }

  fs.writeFileSync(path.join(process.cwd(), "metadata_upload.txt"), teksMetadata, "utf8");
  console.log("✅ File 'metadata_upload.txt' berhasil dibuat!");

  fs.writeFileSync(PATH_KONTEN, JSON.stringify(dataKonten, null, 2), "utf8");
  console.log("🎉 Proses sinkronisasi selesai! File konten.json siap dirender Remotion.");
}

jalankanTTS();
