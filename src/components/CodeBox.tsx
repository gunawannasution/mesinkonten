import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { LANGUAGE_THEMES } from "../config/themes";
import { superFormatter } from "../utils/formatter";
import { getPrismLang } from "../utils/prismLang";
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";

interface CodeBoxProps {
  kode: string;
  bahasa: string;
  durasiKetikDetik?: number;
}

export const CodeBox: React.FC<CodeBoxProps> = ({ kode, bahasa, durasiKetikDetik = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const theme = LANGUAGE_THEMES[bahasa] || { primaryColor: "#00ffcc", name: bahasa.toUpperCase() };

  const kodeTerformatRapi = useMemo(() => superFormatter(kode, bahasa), [kode, bahasa]);

  const dynamicFontSize = useMemo(() => {
    const panjangKarakter = kodeTerformatRapi.length;
    if (panjangKarakter > 300) return 22;
    if (panjangKarakter > 180) return 26;
    return 32;
  }, [kodeTerformatRapi]);

  const prismLang = useMemo(() => getPrismLang(bahasa), [bahasa]);

  const totalFrameKetik = durasiKetikDetik * fps;
  const jumlahKarakterTampil = Math.floor(
    interpolate(frame, [0, totalFrameKetik], [0, kodeTerformatRapi.length], { extrapolateRight: "clamp" })
  );

  const teksTerpotong = kodeTerformatRapi.substring(0, jumlahKarakterTampil);

  const kodeBerwarnaHtml = useMemo(() => {
    const lang = bahasa.toLowerCase();
    if (lang === "web" || lang === "html") {
      const blokBagian = teksTerpotong.split("\n\n");
      return blokBagian.map((blok) => {
        const barisTrimmed = blok.trim();
        if (barisTrimmed.includes("{") || barisTrimmed.includes(":")) {
          return Prism.highlight(blok, Prism.languages.css, "css");
        }
        return Prism.highlight(blok, Prism.languages.markup, "markup");
      }).join("\n\n");
    }
    return Prism.highlight(teksTerpotong, prismLang, bahasa.toLowerCase());
  }, [teksTerpotong, bahasa, prismLang]);

  // Hitung translateY untuk auto-scroll
  const totalBaris = kodeTerformatRapi.split("\n").length;
  const barisMaksimal = dynamicFontSize === 32 ? 8 : (dynamicFontSize === 26 ? 10 : 12);
  const frameMulaiScroll = totalFrameKetik * 0.4;
  const totalScrollY = (totalBaris - barisMaksimal) * (dynamicFontSize * 1.6);
  const translateY = interpolate(frame, [frameMulaiScroll, totalFrameKetik], [0, -totalScrollY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kursorOpacity = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, rgba(20,24,40,0.98), rgba(8,10,18,1))",
        borderRadius: 28,
        border: `2px solid ${theme.primaryColor}35`,
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 40px ${theme.primaryColor}08`,
        overflow: "hidden", // clip isi editor
      }}
    >
      {/* Top bar */}
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

      {/* Code editor */}
      <div
        style={{
          flex: 1,
          padding: "30px 34px",
          position: "relative",
          overflow: "hidden", // tidak ada scrollbar
        }}
      >
        <pre
          style={{
            margin: 0,
            width: "100%",
            color: "#f8f8f2",
            fontFamily: "'Fira Code', monospace",
            fontSize: dynamicFontSize,
            fontWeight: 500,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            tabSize: 2,
            letterSpacing: -0.5,
            transform: `translateY(${translateY}px)`, // auto-scroll mulus
            transition: "transform 0.1s linear",
          }}
        >
          <code dangerouslySetInnerHTML={{ __html: kodeBerwarnaHtml }} />
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
