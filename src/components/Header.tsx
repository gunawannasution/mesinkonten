import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { LANGUAGE_THEMES } from "../config/themes";

interface HeaderProps {
  judul: string;
  bahasa: string;
}

export const Header: React.FC<HeaderProps> = ({ judul, bahasa }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Safe theme fallback
  const theme = LANGUAGE_THEMES[bahasa] || {
    name: bahasa.toUpperCase(),
    primaryColor: "#00ffcc",
  };

  // 1. ANIMASI PEGAS UTAMA (Untuk Wadah & Badge)
  const animasiMasuk = spring({
    frame,
    fps,
    config: {
      damping: 14,
      mass: 0.7,
      stiffness: 110,
    },
  });

  // Gerakan meluncur naik ke atas secara halus
  const translateY = interpolate(animasiMasuk, [0, 1], [60, 0]);
  
  // Efek memudar muncul (Fade-in) untuk pendaran cahaya background
  const glowOpacity = interpolate(animasiMasuk, [0, 1], [0, 1]);

  // 2. KUNCI RETENSI: Efek Mengetik Lembut (Soft Typewriter) khusus untuk Judul Utama
  // Kita buat teks judul muncul bertahap per huruf dalam durasi 20 frame pertama
  const totalFrameKetikJudul = 20;
  const jumlahKarakterJudulTampil = Math.floor(
    interpolate(frame, [5, totalFrameKetikJudul], [0, judul.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const judulTerpotong = judul.substring(0, jumlahKarakterJudulTampil);

  return (
    <div
      style={{
        marginTop: 140,
        marginBottom: 30,
        transform: `translateY(${translateY}px)`,
        opacity: animasiMasuk,
        display: "flex",
        flexDirection: "column",
        gap: 35,
        width: "100%", // Memastikan pembungkus mengambil lebar penuh
      }}
    >
      {/* Language Badge */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            backgroundColor: `${theme.primaryColor}18`,
            color: theme.primaryColor,
            border: `1px solid ${theme.primaryColor}40`,
            padding: "12px 28px",
            borderRadius: 999,
            fontSize: 26,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 2,
            backdropFilter: "blur(14px)",
            boxShadow: `0 0 30px ${theme.primaryColor}20`,
          }}
        >
          {theme.name}
        </span>
      </div>

      {/* Title */}
      <div style={{ position: "relative" }}>
        {/* Glow background (Pendaran Cahaya Premium) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: "blur(50px)",
            opacity: glowOpacity * 0.35,
            background: theme.primaryColor,
            zIndex: 0,
          }}
        />
        
        {/* Main title (Dinamis dengan Efek Ketik Lembut) */}
        <h1
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: 82,
            margin: 0,
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: -2,
            maxWidth: "92%",
            background: "linear-gradient(180deg, #ffffff 0%, #d7dceb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 8px 30px rgba(255,255,255,0.08)",
          }}
        >
          {judulTerpotong}
          
          {/* Kursor ketik kecil khusus judul (Hilang otomatis saat ketikan judul selesai) */}
          {frame < totalFrameKetikJudul && (
            <span 
              style={{ 
                color: theme.primaryColor, 
                WebkitTextFillColor: theme.primaryColor,
                marginLeft: 4,
                fontSize: 75,
                fontWeight: 300,
                position: "absolute",
                lineHeight: 0.9
              }}
            >
              |
            </span>
          )}
        </h1>
      </div>

      {/* Accent Line (Garis Aksen Sinematik Berbasis Skala/Scale) */}
      <div
        style={{
          width: 180,
          height: 6,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${theme.primaryColor}, transparent)`,
          boxShadow: `0 0 20px ${theme.primaryColor}60`,
          // PERBAIKAN: Menggunakan transform scaleX agar garis memanjang elegan dari kiri, bukan kaku
          transform: `scaleX(${animasiMasuk})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};
