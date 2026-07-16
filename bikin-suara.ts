import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { VideoProps } from "./src/types/video";
import xmlEscape from "xml-escape";

// 1. KUNCI OPTIMAL: Import decoder durasi audio berbasis binary tracker
// @ts-ignore
import getMp3Duration from "mp3-duration";

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
 * UTILS: Eksekusi Kode Asli Pemrograman
 * PERBAIKAN 4: Mengubah pesan error sistem yang kaku menjadi teks edukatif ramah penonton (Graceful Error Output)
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
    const result = spawnSync(runtime, [tempFile], { timeout: 3000, encoding: 'utf-8' });
    
    // Jika eksekusi gagal di tingkat runtime compiler
    if (result.error) {
      return "➔ Output:\n⚠️ Proses Gagal (RTO / Batas Waktu Habis)";
    }
    if (result.stderr) {
      // Mengubah pesan error bawaan terminal menjadi format penjelasan yang rapi
      return `➔ Output:\n❌ Syntax Error! Periksa kembali penulisan kode kamu.`;
    }
    
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

/**
 * PROSES BARU: Menghitung Durasi MP3 secara Presisi Real-Time (Asynchronous)
 */
function hitungDurasiMp3Akurat(filePath: string): Promise<number> {
  return new Promise((resolve) => {
    getMp3Duration(filePath, (err: any, duration: number) => {
      if (err) {
        // Fallback aman ke estimasi ukuran jika file bermasalah
        const stats = fs.statSync(filePath);
        resolve((stats.size * 8) / (48 * 1000));
      } else {
        // Peringatan hilang karena 'duration' sekarang resmi diakui sebagai angka (number)
        resolve(duration);
      }
    });
  });
}

/**
 * MAIN: Proses Otomatisasi Utama
 */
async function jalankanTTS(): Promise<void> {
  console.log("🔊 Memulai proses generator otomatis...");

  if (!fs.existsSync(PATH_KONTEN)) {
    console.error("❌ konten.json tidak ditemukan.");
    return;
  }

  if (!fs.existsSync(FOLDER_PUBLIC)) fs.mkdirSync(FOLDER_PUBLIC);

  const dataKonten: KontenJson[] = JSON.parse(fs.readFileSync(PATH_KONTEN, "utf8"));
  const tts = new MsEdgeTTS();
  
  // Menggunakan suara Indonesia ArdiNeural yang natural khas tech creator
  await tts.setMetadata("id-ID-ArdiNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const konten of dataKonten) {
    try {
      const { id, bahasa, narasi, judul } = konten;
      const finalFile = path.join(FOLDER_PUBLIC, `suara-${id}.mp3`);
      
      console.log(`🎙️ Memproses Audio AI: ${judul || id}`);

      // PERBAIKAN 1: Mengamankan teks narasi dari karakter ekstrem web/coding (&, <, >, ")
      const narasiAman = xmlEscape(narasi); 

      // PERBAIKAN 2: Membuat folder penampung sementara terisolasi khusus berbasis ID video
      const folderTempUnik = path.join(FOLDER_PUBLIC, `temp_${id}`);
      if (!fs.existsSync(folderTempUnik)) {
        fs.mkdirSync(folderTempUnik, { recursive: true });
      }

      // Kirim teks yang aman dan unduh ke dalam folder unik terisolasi
      await tts.toFile(folderTempUnik, narasiAman, { rate: "0%", pitch: "0Hz", volume: "0%" });
      
      const tempAudio = path.join(folderTempUnik, "audio.mp3");
      
      // Berikan jeda aman singkat agar sistem operasi melepas penguncian file (file lock)
      await sleep(600); 

      // Pindahkan file audio mentah ke folder public utama dengan nama final resmi
      if (fs.existsSync(tempAudio)) {
        fs.copyFileSync(tempAudio, finalFile);
        fs.unlinkSync(tempAudio); // Hapus file audio sementara di dalam sub-folder
      } else {
        throw new Error(`File audio.mp3 sementara tidak ditemukan di jalur: ${folderTempUnik}`);
      }

      // Bersihkan sub-folder unik yang sudah kosong agar folder public tetap rapi
      if (fs.existsSync(folderTempUnik)) {
        fs.rmdirSync(folderTempUnik);
      }

      // --- LOGIKA EKSEKUSI KODE PEMROGRAMAN ---
      const kodeData = ["html", "css", "web"].includes(bahasa) 
        ? [konten.html, konten.css, konten.js].filter(Boolean).join("\n\n") 
        : (konten.kode ?? "");

      // Jalankan kode untuk mendapatkan output console asli (Sudah diamankan lewat Perbaikan 4)
      const output = eksekusiKodeAsli(bahasa, kodeData, id);

      // --- OPTIMALISASI DURASI & SINKRONISASI DATA ---
      // Menghitung durasi riil biner menggunakan decoder mp3-duration
      const durasiAkurat = await hitungDurasiMp3Akurat(finalFile);

      // Suntikkan hasil kalkulasi presisi tinggi langsung ke objek data JSON Anda
      konten.durasiDetik = Number(durasiAkurat.toFixed(3)); // Mengunci presisi hingga milidetik
      konten.output = output;

      console.log(`   ➔ Durasi Riil: ${konten.durasiDetik} detik`);
      console.log(`   ➔ Hasil Output: ${output.substring(0, 40).replace(/\n/g, " ")}...`);
      console.log(`✅ Sukses Sinkronisasi ID: ${id}\n`);

    } catch (err: unknown) {
      const pesan = err instanceof Error ? err.message : String(err);
      console.error(`❌ Gagal pada ID ${konten.id}:`, pesan);
    }
  }

  // --- PERBAIKAN 3: OTOMATISASI GENERATOR METADATA SEO ---
  console.log("📝 Membuat dokumen panduan SEO dan Upload...");
  
  let teksMetadata = "==================================================\n";
  teksMetadata += "📂 BERKAS PANDUAN UPLOAD METADATA VIDEO (SEO FRIENDLY)\n";
  teksMetadata += "==================================================\n\n";

  for (const konten of dataKonten) {
    teksMetadata += `▶️ ID KOMPOSISI REMOTION : ${konten.id}\n`;
    teksMetadata += `📌 JUDUL VIDEO OPTIMAL   : Rahasia ${konten.judul}! 💻\n`;
    teksMetadata += `📝 DESKRIPSI PLATFORM    : Masih bingung tentang hal ini? Yuk simak tutorial singkat ${konten.bahasa} untuk pemula. Solusi praktis agar kode rapi, efisien, dan mudah dipahami. Jangan lupa simpan video ini biar gak lupa!\n`;
    teksMetadata += `💬 TRANSKRIP SUARA (VO)  : "${konten.narasi}"\n`;
    teksMetadata += `🏷️ HASHTAGS SEO STRATEGIS: #belajarcoding #${konten.bahasa} #programmerindonesia #webdeveloper #codingindonesia #techtok #fyp\n`;
    teksMetadata += "--------------------------------------------------\n\n";
  }

  // Tulis string teks di atas menjadi file nyata di dalam folder proyek Anda
  fs.writeFileSync(path.join(process.cwd(), "metadata_upload.txt"), teksMetadata, "utf8");
  console.log("✅ File 'metadata_upload.txt' berhasil dibuat!");

  // Tulis kembali seluruh hasil optimasi durasi ke file konten.json asli Anda
  fs.writeFileSync(PATH_KONTEN, JSON.stringify(dataKonten, null, 2), "utf8");
  console.log("🎉 Proses sinkronisasi selesai! File konten.json siap dirender Remotion.");
}

jalankanTTS();
