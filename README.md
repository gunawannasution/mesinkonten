# 🚀 Mesin Konten TikTok & Shorts (Video Automation Engine)

[![Remotion Framework](https://shields.io)](https://remotion.dev)
[![Engine Status](https://shields.io)](https://github.com)
[![Type Compliance](https://shields.io)](https://typescriptlang.org)

**Mesin Konten** adalah aplikasi otomatisasi berbasis _Data-Driven_ untuk memproduksi video pendek edukasi coding (TikTok, YouTube Shorts, Reels) secara massal tanpa intervensi manual. Cukup masukkan baris data kode pemrograman ke dalam file konfigurasi JSON, dan mesin ini akan otomatis mengompilasi kode, mengisi durasi asinkron suara AI, mencetak dokumen taktik SEO, dan merender video vertikal premium sinematik beresolusi tinggi.

---

## ✨ Fitur Utama (Enterprise Features)

- **100% Data-Driven Automation**: Pemisahan absolut antara logika visual komponen React dan data teks konten (`konten.json`). Produksi ratusan video baru tanpa menyentuh file `.tsx`.
- **Intelligent Auto-Formatter Engine**: Kode satu baris dari JSON otomatis diuraikan ke bawah lengkap dengan indentasi tabulasi berjenjang 2 spasi ala ekstensi _Prettier_ untuk bahasa HTML, CSS, JavaScript, dan Python.
- **Dynamic Syntax Highlighting (Dracula Theme)**: Pewarnaan komponen kode secara _real-time_ menggunakan isolasi tokenisasi _Prism.js_ yang disinkronkan ke frame _lifecycle_ Remotion tanpa degradasi performa GPU.
- **Akurat & Synchronized Runtime**: Menghitung durasi riil audio biner menggunakan parser (_mp3-duration_), melenyapkan bug visual balapan dengan suara, dan memicu SFX klik keyboard mekanikal (`click.mp3`) secara presisi per karakter huruf.
- **Isolate State Concurrency Protection**: Menggunakan sub-folder temporer unik berbasis ID video (`temp_${id}`) untuk mengunduh suara dari server Microsoft Edge TTS, menjamin keamanan proses _mass production_ bebas dari bug suara tertukar.
- **Otomatisasi Dokumen SEO**: Setiap kali proses pengunduhan suara selesai, mesin otomatis mencetak berkas `metadata_upload.txt` berisi transkrip takarir (_subtitle_), judul pemicu klik, dan tagar FYP strategis yang siap disalin-tempel.
- **Visual Sinematik Tinggi Retensi**: Dilengkapi animasi efek _Ambient Zoom_ kamera maju perlahan, pendaran cahaya neon latar belakang (_glow blur background_), kursor balok berdenyut sinuosi, dan garis _progress bar_ tebal yang ramah layar mobile.

---

## 📂 Struktur Arsitektur Folder

```text
mesinkonten/
├── public/                 # Tempat penyimpanan aset statis
│   ├── click.mp3           # SFX Klik Keyboard Mekanikal Short Duration
│   └── suara-*.mp3         # Output Berkas Voice Over AI hasil unduhan
├── src/
│   ├── components/         # Atom Komponen Visual Terisolasi
│   │   ├── CodeBox.tsx     # Kotak Editor dengan Auto-Formatter & Tokenizer
│   │   └── Header.tsx      # Komponen Judul & Badge Animasi Pegas (Spring)
│   ├── config/
│   │   └── themes.ts       # Pusat Aturan Palet Warna Kosmetik Neon Bahasa
│   ├── templates/
│   │   └── BasicTutorial.tsx # Jantung Layout Utama & Mesin Live Web Preview
│   └── Root.tsx            # Konfigurasi Komposisi & Pemetaan Kompilasi Remotion
├── bikin-suara.ts          # Skrip Backend Utama Otomatisasi Audio & Dokumen SEO
├── konten.json             # Database Lokal Konten Video Masal Anda
└── package.json            # Manajemen Pustaka Dependensi Proyek
```

---

## 🛠️ Langkah Instalasi & Persiapan

### 1. Prasyarat Sistem

Pastikan komputer Anda sudah menginstal aplikasi berikut:

- [Node.js (Versi LTS yang direkomendasikan)](https://nodejs.org)
- [Visual Studio Code](https://visualstudio.com)

### 2. Kloning & Instalasi Dependensi

Buka terminal VS Code di folder proyek Anda, lalu jalankan perintah:

```bash
# Jalankan instalasi seluruh bahan pustaka internal mesin
npm install
```

### 3. Persiapan File SFX Keyboard

- Siapkan sebuah file klik tombol keyboard mekanikal berformat `.mp3` (durasi klip di bawah 0.2 detik).
- Letakkan di dalam folder **`public/`** dan ubah namanya menjadi **`click.mp3`** (huruf kecil semua).

---

## 🚀 Alur Kerja Produksi Massal (Workflow)

### Langkah 1: Input Materi ke Database (`konten.json`)

Buka file `konten.json` di root folder proyek, lalu masukkan deretan topik coding yang ingin Anda buat. Anda bisa memasukkan puluhan baris objek sekaligus menggunakan format standar berikut:

```json
[
  {
    "id": "css-center",
    "judul": "Trik Bikin Elemen ke Tengah",
    "bahasa": "web",
    "html": "<div class='box'>Tengah</div>",
    "css": ".box{display:flex;justify-content:center;align-items:center;height:100vh;font-size:32px;font-weight:bold;}",
    "js": "",
    "narasi": "Masih bingung cara bikin elemen posisi ke tengah di CSS? Pakai trik display flex, justify content, dan align items ini, langsung rapi!"
  }
]
```

### Langkah 2: Jalankan Otomatisasi Backend (Generate Audio & SEO)

Eksekusi skrip generator suara untuk mengunduh Voice Over AI Indonesia asli dari server Microsoft Edge TTS, menghitung durasi milidetik akurat, dan mencetak cetak biru metadata optimasi pencarian:

```bash
npm run suara
```

_Hasil eksekusi akan otomatis meng-update properti `durasiDetik` dan `output` di dalam `konten.json` serta memproduksi file `metadata_upload.txt`._

### Langkah 3: Pratinjau Video (Studio Preview)

Jika Anda ingin melihat pergerakan animasi visual, mendengarkan ketukan suara keyboard klik, dan mengecek _Live Preview Web_ sebelum dicetak, jalankan perintah studio:

```bash
npm start
```

_Buka browser di alamat `http://localhost:3000` untuk melihat studio interaktif Remotion._

### Langkah 4: Cetak Video Akhir (.MP4)

Untuk merender seluruh deretan konten video pendek Anda secara massal menjadi berkas video matang beresolusi tinggi, jalankan perintah kompilator build:

```bash
npm run build
```

_Video berformat `.mp4` vertikal siap upload akan tersimpan rapi di dalam folder output proyek Anda._

---

## 📈 Skalabilitas Komersial (SaaS Roadmap)

Infrastruktur **Mesin Konten** ini telah dirancang menggunakan metodologi arsitektur berstandar tinggi yang sangat _scalable_ untuk dikonversi menjadi aplikasi komersial (Software as a Service / SaaS):

1.  **Integrasi AI Content Writer**: Menambahkan satu file skrip otomatisasi Node.js ke API OpenAI (ChatGPT) atau Claude untuk mengisi isi data `konten.json` secara otomatis tanpa ketikan tangan manusia.
2.  **SaaS Cloud Pipeline**: Mengganti file lokal `konten.json` statis dengan pemicu database relasional (seperti PostgreSQL/MongoDB) yang terhubung dengan form input halaman website pengguna, lalu memicu kompilasi server (_Remotion Lambda / Headless Rendering_) untuk menghasilkan video unduhan premium berbayar.

---

⭐ _Jangan lupa berikan bintang (Star) pada repositori ini jika proyek otomatisasi ini membantu efisiensi produksi video harian Anda!_
