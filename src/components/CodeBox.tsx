import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { LANGUAGE_THEMES } from "../config/themes";
import Prism from "prismjs";

// Load blueprint tokenisasi bahasa dasar global resmi
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
 * INTELLIGENT AUTO-FORMATTER ENGINE
 * Secara pintar mendeteksi susunan sintaksis baris baru dan menambahkan indentasi tabulasi berjenjang
 * untuk HTML, CSS, JS, dan Python agar tidak memanjang lurus ke kanan.
 */
function superFormatter(kodeMentah: string, bahasa: string): string {
  if (!kodeMentah) return "";
  const lang = bahasa.toLowerCase();
  
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
        hasil += "\n" + "  ".repeat(indent) + "}";
      } else if (char === ";") {
        // PERBAIKAN TS(2448): Deklarasikan 'databaseLastIndex' terlebih dahulu di atas sebelum digunakan
        const databaseLastIndex = hasil.lastIndexOf("\n");
        const diDalamLoopFor = (hasil.lastIndexOf("for") > databaseLastIndex && !hasil.slice(hasil.lastIndexOf("for")).includes(")"));
        
        if (diDalamLoopFor) {
          hasil += "; ";
        } else {
          hasil += ";\n" + "  ".repeat(indent);
        }
      } else {
        hasil += char;
      }
    }
    return hasil.replace(/;\s*\n\s*}/g, ";\n}").trim();
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

  const theme = LANGUAGE_THEMES[bahasa] || {
    primaryColor: "#00ffcc",
    name: bahasa.toUpperCase(),
  };

  const kodeTerformatRapi = useMemo(() => {
    return superFormatter(kode, bahasa);
  }, [kode, bahasa]);

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

  // MESIN PENOLONG MULTI-TOKENIZER
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

    // PERBAIKAN TS(6133): Membaca kembali variabel 'prismLang' untuk bahasa mandiri agar tidak menganggur
    const namaBahasaPrism = lang === "py" ? "python" : (lang === "css" ? "css" : "javascript");
    return Prism.highlight(teksTerpotong, prismLang, namaBahasaPrism);
  }, [teksTerpotong, bahasa, prismLang]);

  // Detak denyut kursor (Pulsing Effect) menggunakan gelombang Sinus matematika
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
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap", 
            wordBreak: "break-word",
            overflowWrap: "break-word",
            tabSize: 2,
            letterSpacing: -0.5,
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: kodeBerwarnaHtml }} />
          
          {/* Kursor Ketik Balok Neon Menyala & Berdenyut */}
          {frame <= totalFrameKetik && (
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "36px",
                backgroundColor: theme.primaryColor,
                marginLeft: "6px",
                verticalAlign: "middle",
                opacity: kursorOpacity,
                boxShadow: `0 0 15px ${theme.primaryColor}, 0 0 30px ${theme.primaryColor}`,
              }}
            />
          )}
        </pre>
      </div>
    </div>
  );
};
