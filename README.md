# 📝 Aplikasi Todo Scalable - Next.js Vanilla Full-Stack

Aplikasi pencatatan tugas (_Todo List_) berbasis web yang dibangun menggunakan **Next.js modern (App Router)** dan **Vanilla JavaScript murni**. Proyek ini menerapkan arsitektur _Full-Stack_ lokal dengan memanfaatkan **Next.js Server Actions** untuk menyimpan data secara permanen ke dalam database file `db.json`.

## ✨ Fitur Utama

- **CRUD Lengkap (Lokal)**: Tambah tugas, baca daftar tugas, ubah status tugas, dan hapus tugas secara _live_.
- **Penyimpanan Permanen (Scalable)**: Data tidak hilang saat halaman di-_refresh_ karena disimpan langsung ke file database `db.json` di sisi server.
- **Auto-Recovery Database**: Sistem server akan otomatis membuatkan file `db.json` baru jika file tersebut tidak sengaja terhapus atau hilang.
- **Data Revalidation**: Tampilan antarmuka langsung sinkron secara instan begitu ada perubahan data di database menggunakan `revalidatePath`.
- **Styling Ringan**: Tampilan gelap (_Dark Mode_) minimalis menggunakan utilitas kelas bawaan CSS Tailwind.

## 🚀 Teknologi yang Digunakan

- **Framework**: Next.js 15+ (App Router, Client & Server Components)
- **Bahasa**: Vanilla JavaScript (ES6+, Async/Await, Array Methods)
- **Database**: Local JSON File System (`fs` Node.js)

## 📂 Struktur Folder Kunci

```text
ai-carousel/
├── db.json               # File database lokal (menyimpan data tugas)
├── src/
│   └── app/
│       ├── actions.js    # Kode Sisi Server (Logika Baca/Tulis/Hapus file JSON)
│       ├── page.js       # Kode Sisi Klien (Tampilan UI Aplikasi Utama)
│       └── layout.js     # Kerangka layout global aplikasi
└── package.json          # File konfigurasi dependensi proyek
```

## 🛠️ Cara Menjalankan Proyek di Laptop Anda

### 1. Persiapan

Pastikan komputer Anda sudah terinstal [Node.js](https://nodejs.org) (Versi minimal v18.x atau yang terbaru).

### 2. Instalasi Dependensi

Buka terminal/CMD di dalam folder proyek ini, lalu jalankan perintah berikut untuk menginstal modul pendukung:

```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Localhost)

Setelah instalasi selesai, nyalakan server Next.js Anda dengan perintah:

```bash
npm run dev
```

### 4. Akses Aplikasi

Buka browser kesayangan Anda dan akses alamat berikut:

```text
http://localhost:3000
```

## 💡 Konsep JavaScript yang Dipelajari di Proyek Ini

Proyek ini merupakan sarana latihan yang sangat baik untuk memahami penerapan JavaScript murni di dunia nyata:

1. **State Management (`useState`)**: Mengelola perubahan data secara dinamis di browser.
2. **Side Effects (`useEffect`)**: Mengambil data dari database secara otomatis tepat saat aplikasi pertama kali dibuka.
3. **Array Methods (`.map()` & `.filter()`)**: Mengulang data list ke dalam HTML dan menyaring data untuk proses penghapusan.
4. **Async/Await & Fetch**: Mengelola komunikasi asinkronous antara antarmuka klien dan logika server.
