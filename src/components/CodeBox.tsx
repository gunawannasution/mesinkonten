import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Audio } from "remotion";
import { LANGUAGE_THEMES } from "../config/themes";

interface CodeBoxProps {
  kode: string;
  bahasa: string;
  durasiKetikDetik?: number; // Menentukan berapa detik durasi proses mengetik berjalan
}

export const CodeBox: React.FC<CodeBoxProps> = ({
  kode,
  bahasa,
  durasiKetikDetik = 4, // Default proses mengetik selesai dalam 4 detik pertama
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const theme = LANGUAGE_THEMES[bahasa] || {
    primaryColor: "#00ffcc",
    name: bahasa.toUpperCase(),
  };

  // --- LOGIKA UTAMA SINKRONISASI KETIKAN & SFX ---
  
  // 1. Hitung total frame yang dialokasikan untuk mengetik
  const totalFrameKetik = durasiKetikDetik * fps;

  // 2. Interpolasi jumlah karakter yang muncul pada frame saat ini
  const jumlahKarakterTampil = Math.floor(
    interpolate(frame, [0, totalFrameKetik], [0, kode.length], {
      extrapolateRight: "clamp", // Mengunci teks agar tidak eror setelah animasi mengetik selesai
    })
  );

  // 3. Potong teks kode asli berdasarkan hitungan interpolasi di atas
  const teksTerpotong = kode.substring(0, jumlahKarakterTampil);

  // 4. Deteksi perpindahan huruf antara frame ini dan frame sebelumnya untuk membunyikan klik keyboard
  const karakterFrameSebelumnya = Math.floor(
    interpolate(frame - 1, [0, totalFrameKetik], [0, kode.length], {
      extrapolateRight: "clamp",
    })
  );

  // Pemicu suara klik: Karakter bertambah DAN video masih dalam fase mengetik
  const isTombolDitekan = jumlahKarakterTampil > karakterFrameSebelumnya && frame <= totalFrameKetik;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, rgba(15,18,30,0.96), rgba(8,10,18,1))",
        borderRadius: 28,
        border: `2px solid ${theme.primaryColor}22`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 20px 60px ${theme.primaryColor}12`,
      }}
    >
      {/* KUNCI OPTIMAL: Bunyikan SFX klik keyboard mekanik pendek jika mendeteksi huruf baru keluar */}
      {isTombolDitekan && <Audio src="/click.mp3" volume={0.3} />}

      {/* Top bar (Mac Style Window) */}
      <div
        style={{
          height: 72,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28c840" }} />
        <div
          style={{
            marginLeft: 18,
            fontSize: 24,
            fontWeight: 800,
            color: theme.primaryColor,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {theme.name}
        </div>
      </div>

      {/* Code Area */}
      <div
        style={{
          flex: 1,
          padding: "30px 34px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <pre
          style={{
            margin: 0,
            width: "100%",
            color: "#ffffff",
            fontFamily: "'Fira Code', monospace",
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            maxWidth: "100%",
            letterSpacing: -0.5,
          }}
        >
          {/* Tampilkan teks dinamis hasil pemotongan per frame */}
          <code>{teksTerpotong}</code>
          
          {/* Efek Kursor Ketik Kedip-Kedip di akhir teks (Khas Programmer) */}
          {frame <= totalFrameKetik && (
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "34px",
                backgroundColor: theme.primaryColor,
                marginLeft: "4px",
                verticalAlign: "middle",
                animation: "blink 0.6s step-end infinite",
              }}
            />
          )}
        </pre>
      </div>
    </div>
  );
};
