import React, { useMemo, useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { LANGUAGE_THEMES } from "../config/themes";
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markup"; 
import "prismjs/components/prism-css";

interface CodeBoxProps {
  kode: string;
  bahasa: string;
  durasiKetikDetik?: number;
}

/**
 * RE-ARCHITECTED AUTO-FORMATTER ENGINE (ANTI-OVERFLOW FIX)
 * Secara pintar memotong baris setelah tanda kurung {, }, titik koma ;, dan tanda koma , khusus properti tebal.
 */
function superFormatter(kodeMentah: string, bahasa: string): string {
  if (!kodeMentah) return "";
  const lang = bahasa.toLowerCase();
  
  // Jika kode sudah diformat manual menggunakan baris baru \n, gunakan kode asli
  if (kodeMentah.includes("\n")) return kodeMentah;

  let hasil = "";
  let indent = 0;
  const teks = kodeMentah.trim();

  if (["css", "javascript", "js", "typescript", "ts"].includes(lang)) {
    for (let i = 0; i < teks.length; i++) {
      const char = teks[i];
      
      if (char === "{") {
        indent++;
        hasil += " {\n" + "  ".repeat(indent);
      } else if (char === "}") {
        indent = Math.max(0, indent - 1);
        // Pastikan tidak menyisipkan baris kosong ganda sebelum kurung tutup
        hasil = hasil.trimEnd(); 
        hasil += "\n" + "  ".repeat(indent) + "}\n" + "  ".repeat(indent);
      } else if (char === ";") {
        const databaseLastIndex = hasil.lastIndexOf("\n");
        const diDalamLoopFor = (hasil.lastIndexOf("for") > databaseLastIndex && !hasil.slice(hasil.lastIndexOf("for")).includes(")"));
        
        if (diDalamLoopFor) {
          hasil += "; ";
        } else {
          hasil += ";\n" + "  ".repeat(indent);
        }
      } else if (char === ",") {
        // KUNCI UTAMA: Jika mendeteksi tanda koma di dalam properti panjang seperti text-shadow,
        // paksa potong baris baru ke bawah dan berikan indentasi tambahan agar tidak meluber kesamping!
        const barisSekarang = hasil.slice(hasil.lastIndexOf("\n"));
        if (barisSekarang.includes("text-shadow") || barisSekarang.includes("box-shadow") || barisSekarang.includes("gradient") || barisSekarang.length > 30) {
          hasil += ",\n" + "  ".repeat(indent + 1); // Tambah 1 level tab agar menonjol menjorok ke dalam
        } else {
          hasil += ", ";
        }
      } else {
        // Cegah penumpukan spasi kosong berantakan di awal baris baru
        if (char === " " && (hasil.endsWith("\n") || hasil.endsWith("  "))) {
          continue;
        }
        hasil += char;
      }
    }
    
    // Pembersihan akhir (Garbage Character Trim) untuk membuang kurung kurawal kesasar di baris awal/akhir
    return hasil
      .replace(/^\s*}\s*/, "") // Hapus kurung tutup yang nyasar di paling atas video kamu!
      .replace(/\n\s*\n/g, "\n") // Buang baris kosong ganda
      .trim();
  }

  return kodeMentah;
}

export const CodeBox: React.FC<CodeBoxProps> = ({
  kode,
  bahasa,
  durasiKetikDetik = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const theme = LANGUAGE_THEMES[bahasa] || {
    primaryColor: "#00ffcc",
    name: bahasa.toUpperCase(),
  };

  const kodeTerformatRapi = useMemo(() => {
    return superFormatter(kode, bahasa);
  }, [kode, bahasa]);

  // 1. SOLUSI UPGRADE A: Dynamic Font Sizing (Mengecilkan font otomatis jika kode sangat panjang)
  const dynamicFontSize = useMemo(() => {
    const panjangKarakter = kodeTerformatRapi.length;
    if (panjangKarakter > 300) return 24; // Sangat panjang -> font diperkecil ke 24px
    if (panjangKarakter > 180) return 28; // Cukup panjang -> font diperkecil ke 28px
    return 34; // Normal standar TikTok -> 34px
  }, [kodeTerformatRapi]);

  const prismLang = useMemo(() => {
    const lang = bahasa.toLowerCase();
    if (lang === "html" || lang === "web" || lang === "markup") return Prism.languages.markup;
    if (lang === "javascript" || lang === "js") return Prism.languages.javascript;
    if (lang === "typescript" || lang === "ts") return Prism.languages.typescript;
    if (lang === "python" || lang === "py") return Prism.languages.python;
    if (lang === "css") return Prism.languages.css;
    return Prism.languages.javascript;
  }, [bahasa]);

  const totalFrameKetik = durasiKetikDetik * fps;

  const jumlahKarakterTampil = Math.floor(
    interpolate(frame, [0, totalFrameKetik], [0, kodeTerformatRapi.length], {
      extrapolateRight: "clamp",
    })
  );

  const teksTerpotong = kodeTerformatRapi.substring(0, jumlahKarakterTampil);

  const karakterFrameSebelumnya = Math.floor(
    interpolate(frame - 1, [0, totalFrameKetik], [0, kodeTerformatRapi.length], {
      extrapolateRight: "clamp",
    })
  );
  const isTombolDitekan = jumlahKarakterTampil > karakterFrameSebelumnya && frame <= totalFrameKetik;

  const kodeBerwarnaHtml = useMemo(() => {
    const lang = bahasa.toLowerCase();
    
    if (lang === "web" || lang === "html") {
      const blokBagian = teksTerpotong.split("\n\n");
      
      return blokBagian.map((blok) => {
        const barisTrimmed = blok.trim();
        if (barisTrimmed.startsWith(".") || barisTrimmed.startsWith("#") || barisTrimmed.includes("{") || barisTrimmed.includes(":")) {
          return Prism.highlight(blok, Prism.languages.css, "css");
        }
        return Prism.highlight(blok, Prism.languages.markup, "markup");
      }).join("\n\n");
    }

    const namaBahasaPrism = lang === "py" ? "python" : (lang === "css" ? "css" : "javascript");
    return Prism.highlight(teksTerpotong, prismLang, namaBahasaPrism);
  }, [teksTerpotong, bahasa, prismLang]);

  // 2. SOLUSI UPGRADE B: Smooth Auto-Scrolling Linier Berbasis Progres Frame Ketikan
  // Menghitung pergeseran ke atas (Y) secara bertahap seiring teks bertambah panjang
  const totalBaris = kodeTerformatRapi.split("\n").length;
  const barisMaksimalAman = dynamicFontSize === 34 ? 7 : (dynamicFontSize === 28 ? 9 : 11);
  
  const translateY = useMemo(() => {
    if (totalBaris <= barisMaksimalAman) return 0;
    
    // Mulai melakukan scrolling saat proses mengetik sudah berjalan 40%
    const frameMulaiScroll = totalFrameKetik * 0.4;
    // Berhenti scroll tepat di akhir pengetikan
    const totalJarakScrollY = (totalBaris - barisMaksimalAman) * (dynamicFontSize * 1.6); // 1.6 adalah lineHeight
    
    return interpolate(frame, [frameMulaiScroll, totalFrameKetik], [0, -totalJarakScrollY], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }, [frame, totalBaris, totalFrameKetik, barisMaksimalAman, dynamicFontSize]);

  const kursorOpacity = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, rgba(20,24,40,0.98), rgba(8,10,18,1))",
        borderRadius: 28,
        border: `2px solid ${theme.primaryColor}35`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 40px ${theme.primaryColor}08`,
      }}
    >
      {isTombolDitekan && <Audio src={staticFile("/click.mp3")} volume={0.3} />}

      {/* Top windows bar */}
      <div
        style={{
          height: 72,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
          flexShrink: 0,
          zIndex: 10,
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
            letterSpacing: 2,
            textShadow: `0 0 15px ${theme.primaryColor}40`,
          }}
        >
          {theme.name}
        </div>
      </div>

      {/* Code Editor Workspace */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          padding: "30px 34px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <style>{`
          .token.comment { color: #6272a4; font-style: italic; }
          .token.punctuation { color: #f8f8f2; }
          .token.property, .token.tag, .token.constant, .token.symbol, .token.deleted, .token.selector { color: #ff79c6; }
          .token.boolean, .token.number { color: #bd93f9; }
          .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #f1fa8c; }
          .token.operator, .token.entity, .token.url { color: #ff79c6; }
          .token.atrule, .token.attr-value, .token.keyword { color: #ff79c6; }
          .token.function, .token.class-name { color: #50fa7b; text-shadow: 0 0 10px rgba(80,250,123,0.2); }
          .token.regex, .token.important, .token.variable { color: #f1fa8c; }
        `}</style>

        <pre
          style={{
            margin: 0,
            width: "100%",
            color: "#f8f8f2",
            fontFamily: "'Fira Code', monospace",
            // UPGRADE KUNCI: Menerapkan ukuran font dinamis & animasi translasi Y (Auto-Scrolling)
            fontSize: dynamicFontSize,
            transform: `translateY(${translateY}px)`,
            fontWeight: 500,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowWrap: "break-word",
            tabSize: 2,
            letterSpacing: -0.5,
            transition: "transform 0.1s linear", // Membuat pergerakan scroll terasa linear & mulus
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: kodeBerwarnaHtml }} />
          
          {/* Kursor Ketik Balok Neon Menyala */}
          {frame <= totalFrameKetik && (
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: `${dynamicFontSize + 2}px`,
                backgroundColor: theme.primaryColor,
                marginLeft: "6px",
                verticalAlign: "middle",
                opacity: kursorOpacity,
                boxShadow: `0 0 15px ${theme.primaryColor}`,
              }}
            />
          )}
        </pre>
      </div>
    </div>
  );
};
