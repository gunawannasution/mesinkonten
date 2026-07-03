Berikut adalah file `README.md` utuh yang menggabungkan seluruh dokumentasi teknis, struktur proyek, cara penggunaan, hingga tips optimasi algoritma ke dalam satu dokumen lengkap tanpa terpisah-pisah.

Silakan langsung _copy-paste_ seluruh isi di bawah ini ke dalam file `README.md` pada _root folder_ proyek kamu:

````markdown
# 🚀 Mesin Otomatisasi Konten Coding TikTok & Reels

Mesin otomatisasi video (_Video Automation Engine_) berbasis **Remotion** dan **TypeScript** untuk memproduksi video pendek edukasi _coding_ secara massal untuk platform TikTok, Instagram Reels, dan YouTube Shorts.

Cukup masukkan data mentah berupa teks kode dan narasi ke dalam satu file JSON, jalankan perintah perintah pendek, dan dapatkan video berkualitas tinggi dengan efek ketik presisi, _syntax highlighting_ dinamis, audio interaktif, serta gerakan kamera sinematik secara otomatis!

---

## ✨ Fitur Unggulan

- **100% Data-Driven & Dinamis:** Durasi video, panjang ketikan, dan judul beradaptasi otomatis mengikuti isi file `konten.json`.
- **Akurat & Synchronized Runtime:** Jendela _Live Preview_ (HTML/CSS) atau _Output Console_ (JS/Python) dijamin muncul menggunakan efek _spring_ premium tepat pada huruf terakhir selesai diketik.
- **Dynamic Syntax Highlighting:** Sistem tokenisasi bawaan yang mewarnai kode pemrograman secara _real-time_ (Dracula Theme Style) tanpa memperberat proses render dan aman dari glitch tag HTML.
- **Auto-Scaling Font Size:** Ukuran teks kode otomatis mengecil secara adaptif jika baris kode terlalu panjang atau banyak, mencegah teks terpotong (_off-screen_).
- **Audio SFX Typing Sync:** Pemicu suara klik keyboard mekanikal otomatis terintegrasi langsung per frame pengetikan huruf menggunakan aset audio lokal.
- **Cinematic Camera Movement:** Pergerakan kamera _Zoom In_, _Panning_, dan _Zoom Out_ halus menggunakan interpolasi Remotion untuk meningkatkan _retention rate_ penonton di 3 detik pertama.
- **TikTok SEO Friendly:** Struktur yang dirancang khusus untuk mempermudah optimasi kata kunci pada judul, aset suara, dan visual pendukung.

---

## 📂 Struktur Proyek Utama

```text
mesin-konten-tiktok/
├── public/
│   ├── click.mp3          # SFX Ketikan Keyboard (Wajib Ada)
│   └── suara-[id].mp3     # Hasil generate voiceover narasi AI
├── src/
│   ├── components/
│   │   ├── CodeBox.tsx    # Komponen area ketik & syntax highlighting
│   │   └── Header.tsx     # Komponen judul atas
│   ├── templates/
│   │   └── BasicTutorial.tsx # Layout video & logika animasi utama
│   ├── types/
│   │   └── video.ts       # Definisi tipe data TypeScript
│   └── Root.tsx           # Konfigurasi komposisi & mapping data Remotion
├── konten.json            # Database utama konten video
├── bikin-suara.ts         # Script generator audio narasi
└── package.json           # Konfigurasi script dan dependensi
```
````

---

## 🛠️ Konfigurasi Awal & Scripts

Untuk mempermudah alur kerja, pastikan bagian `"scripts"` di file `package.json` Anda sudah dikonfigurasi seperti berikut:

```json
"scripts": {
  "start": "remotion preview",
  "build": "remotion bundle",
  "render": "remotion render",
  "suara": "ts-node bikin-suara.ts",
  "gas": "ts-node bikin-suara.ts && remotion render"
}

```

---

## 🛠️ Langkah Instalasi

1. Clone atau ekstrak proyek ini ke komputer Anda.
2. Buka terminal di dalam folder proyek tersebut, lalu instal semua dependensi:

```bash
npm install

```

3. Pastikan Anda telah menginstal `ts-node` secara global atau lokal jika belum ada:

```bash
npm install -g ts-node

```

4. Sediakan file audio klik keyboard mekanikal tunggal berdurasi pendek (di bawah 0.3 detik) dan simpan ke dalam folder `public/click.mp3`.

---

## 📝 Cara Penggunaan

### 1. Isi Data di `konten.json`

Buka file `konten.json` di root direktori, lalu masukkan materi konten Anda menggunakan format berikut. Gunakan `\n` untuk membuat baris baru pada properti `kode`.

```json
[
  {
    "id": "js-variabel",
    "judul": "Cara Membuat Variabel di JavaScript",
    "bahasa": "javascript",
    "kode": "const nama = 'Budi';\nlet umur = 20;\nconsole.log(`Halo, nama saya ${nama} dan umur saya ${umur} tahun.`);",
    "narasi": "Gini nih cara gampang buat nampilin teks gabungan di bahasa pemrograman JavaScript. Cukup pake teknik string literal di dalam konsol log aja!",
    "durasiDetik": 8.592,
    "output": "Halo, nama saya Budi dan umur saya 20 tahun."
  },
  {
    "id": "py-loop",
    "judul": "Belajar Looping Mudah di Python",
    "bahasa": "python",
    "kode": "print('Memulai perulangan:')\nfor i in range(1, 4):\n    print(f'-> Baris ke-{i}')",
    "narasi": "Belajar looping di Python gak pake ribet. Cuma butuh tiga baris kode ini, data kamu langsung berulang otomatis ke bawah.",
    "durasiDetik": 7.848,
    "output": "Memulai perulangan:\r\n-> Baris ke-1\r\n-> Baris ke-2\r\n-> Baris ke-3"
  },
  {
    "id": "html-button",
    "judul": "Bikin Tombol Keren dengan HTML",
    "bahasa": "html",
    "kode": "<button style='padding: 15px 30px; font-size: 20px; background: #00ffcc; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 10px 20px rgba(0,255,204,0.3);'>KLIK DI SINI</button>",
    "narasi": "Mau bikin tombol modern yang menyala di website kamu? Salin struktur kode HTML sederhana ini dan lihat hasilnya!",
    "durasiDetik": 7.416,
    "output": ""
  }
]
```

### 2. Jalankan Perintah Otomatisasi

Gunakan perintah pendek di terminal sesuai dengan kebutuhan Anda:

- **Generate Suara Narasi Saja:**

```bash
npm run suara

```

- **Membuka Remotion Studio (Preview & Debug Visual):**

```bash
npm start

```

- **Eksekusi Total (Bikin Suara + Langsung Render Video ke .mp4):**

```bash
npm run gas

```

_Perintah pamungkas ini otomatis memproses file audio narasi terlebih dahulu, kemudian langsung merender seluruh daftar video yang ada di JSON menjadi file .mp4 siap posting secara berurutan._

---

## 📈 Tips Optimasi FYP & Retensi (TikTok / Reels / Shorts)

1. **Gunakan Keyword Terarah pada Judul:** Jangan buat judul terlalu abstrak. Gunakan kata kunci yang sering diketik orang di kolom pencarian untuk mendongkrak TikTok SEO (Contoh: _"Trik Bikin Elemen ke Tengah CSS"_).
2. **Manfaatkan Suara Narasi untuk SEO:** Algoritma TikTok membaca teks dari konversi suara ke teks secara otomatis. Teks di properti `"narasi"` sebaiknya menyebutkan kata kunci utama di 3 detik pertama video.
3. **Smart Caption & Hashtag:** Tulis caption 2-3 kalimat yang menjelaskan fungsi kodenya, berikan Call to Action (CTA) seperti _"Save video ini biar gak hilang pas kamu ngoding nanti!"_, dan tambahkan hashtag relevan (e.g., `#belajarhtml #codingindonesia`).
4. **Perfect Loop Trick:** Akhir video ini sudah dirancang memberikan jeda visual yang pas agar penonton sempat melihat _output_ sebelum video terulang kembali. Usahakan kalimat akhir narasi menggantung agar menyambung secara natural ke kalimat awal video saat diputar berulang, sehingga memicu peningkatan completion rate di atas 100%.

---

## 📜 Lisensi & Kontribusi

Proyek ini dibangun sebagai aset _Video Automation Engine_ premium. Anda bebas memodifikasi gaya UI pada komponen `BasicTutorial.tsx` atau tema warna di `src/config/themes.ts` untuk menyesuaikan dengan identitas _brand_ Anda sendiri.

```

```
