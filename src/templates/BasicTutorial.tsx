import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { VideoProps } from "../types/video";

// Impor modul sub-komponen modular hasil perpecahan arsitektur
import { Header } from "../components/Header";
import { CodeBox } from "../components/CodeBox";
import { AudioStream } from "../components/AudioStream";
import { LivePreview } from "../components/LivePreview";
import { ConsoleOutput } from "../components/ConsoleOutput";
import { LANGUAGE_THEMES } from "../config/themes";

export const BasicTutorial: React.FC<VideoProps> = ({
  judul,
  bahasa,
  kode = "",
  html = "",
  css = "",
  js = "",
  suaraUrl,
  output = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const theme = LANGUAGE_THEMES[bahasa] || { primaryColor: "#00ffcc" };
  const isWeb = bahasa === "html" || bahasa === "css" || bahasa === "web";
  
  // Format pemisah baris baru untuk penulisan kode gabungan
  const fullCode = isWeb 
    ? `${html ? html + "\n\n" : ""}${
        css ? css.replace(/{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/}/g, "\n}\n\n") : ""
      }${js ? js : ""}`.trim()
    : kode;

  // =======================================================
  // ENGINE CONFIG TIMES & TIME-BASED EVENT SPLICING
  // =======================================================
  const startTypingFrame = 30;
  const totalLength = Math.max(fullCode.length, 1);
  const totalFrameKetik = Math.floor(durationInFrames * 0.75);
  const durasiKetikDetik = totalFrameKetik / fps;
  const typingEndFrame = startTypingFrame + totalFrameKetik;

  // Gelombang matematika interpolasi pengetikan sinkron narasi suara
  const progressKetik = interpolate(
    frame,
    [startTypingFrame, startTypingFrame + (totalFrameKetik * 0.3), startTypingFrame + (totalFrameKetik * 0.6), typingEndFrame],
    [0, 0.35, 0.65, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const currentCharCount = frame >= typingEndFrame ? totalLength : Math.floor(totalLength * progressKetik);
  const liveFullCodeForWeb = fullCode.slice(0, currentCharCount);

  // Deteksi audio klik keyboard mekanik
  const progressSebelumnya = interpolate(
    frame - 1,
    [startTypingFrame, startTypingFrame + (totalFrameKetik * 0.3), startTypingFrame + (totalFrameKetik * 0.6), typingEndFrame],
    [0, 0.35, 0.65, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const charFrameSebelumnya = Math.floor(totalLength * progressSebelumnya);
  const isMengetik = currentCharCount > charFrameSebelumnya && frame >= startTypingFrame && frame <= typingEndFrame;

  // Output terminal processor
  const outputStartFrame = typingEndFrame + 15;
  const cleanOutput = output?.trim() || "➔ Program executed successfully.";
  const outputProgress = Math.max(0, Math.min((frame - outputStartFrame) / Math.max(cleanOutput.length * 0.5, 1), 1));
  const outputChars = Math.floor(cleanOutput.length * outputProgress);
  const liveOutputText = cleanOutput.slice(0, outputChars);

  // Web segmentations
  let previewHtml = "";
  let previewCss = "";
  if (isWeb) {
    if (frame >= typingEndFrame) {
      previewHtml = html;
      previewCss = css;
    } else {
      if (html && liveFullCodeForWeb.length <= html.length) {
        previewHtml = liveFullCodeForWeb;
      } else if (html) {
        previewHtml = html;
        const sisaTeks = liveFullCodeForWeb.slice(html.length + 2);
        if (css) previewCss = sisaTeks.slice(0, css.length);
      } else if (css) {
        previewCss = liveFullCodeForWeb.slice(0, css.length);
      }
    }
  }

  // Cinematic movement animations
  const entrance = spring({ frame: Math.max(0, frame - startTypingFrame), fps, config: { damping: 15, mass: 0.6 } });
  const cameraScale = interpolate(frame, [0, durationInFrames], [1.02, 1.07]);
  const cameraY = interpolate(frame, [0, startTypingFrame, typingEndFrame], [-15, 5, 0]);
  const progressPercent = (frame / durationInFrames) * 100;

  // =======================================================
  // MAIN VIEW ASSEMBLY (ULTRA-CLEAN MASK LAYER)
  // =======================================================
  return (
    <AbsoluteFill style={{ background: "#08090d", color: "#fff", padding: "50px 60px", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box", transform: `scale(${cameraScale}) translateY(${cameraY}px)` }}>
      
      {/* 1. Pemanggilan Mesin Kelola Aliran Audio (Vokal AI & SFX Keyboard) */}
      <AudioStream suaraUrl={suaraUrl} isMengetik={isMengetik} />

      {/* Area Atas: Header Judul Video (Tinggi dikunci pas 24%) */}
      <div style={{ height: "24%", flexShrink: 0, boxSizing: "border-box" }}>
        <Header judul={judul} bahasa={bahasa} />
      </div>

      {/* Area Utama: Split-Screen Vertikal (Tinggi dikunci pas 76%) */}
      <div style={{ height: "76%", display: "flex", flexDirection: "column", gap: 30, boxSizing: "border-box", paddingBottom: 40 }}>
        
        {/* PANEL ATAS: Tempat Papan Ketik Dracula CodeBox */}
        <div style={{ height: "48%", width: "100%", flexShrink: 0, boxSizing: "border-box" }}>
          <CodeBox kode={fullCode} bahasa={bahasa} durasiKetikDetik={durasiKetikDetik} />
        </div>
        
        {/* PANEL BAWAH: Mesin Deteksi Bahasa untuk Live Preview atau Terminal Console */}
        <div style={{ height: "48%", width: "100%", flexShrink: 0, boxSizing: "border-box" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#6272a4", fontFamily: "sans-serif" }}>
            {isWeb ? "🌐 Live Preview" : "💻 Output Console"}
          </div>
          {frame >= startTypingFrame && (
            isWeb ? (
              <LivePreview previewHtml={previewHtml} previewCss={previewCss} js={js} frame={frame} typingEndFrame={typingEndFrame} entrance={entrance} />
            ) : (
              <ConsoleOutput bahasa={bahasa} theme={theme} frame={frame} typingEndFrame={typingEndFrame} outputStartFrame={outputStartFrame} liveOutputText={liveOutputText} entrance={entrance} />
            )
          )}
        </div>

      </div>

      {/* Garis Kemajuan Progress Bar Tebal Menyala */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 10, width: `${progressPercent}%`, background: `linear-gradient(90deg, ${theme.primaryColor}, #ffffff)`, boxShadow: `0 0 15px ${theme.primaryColor}` }} />
    </AbsoluteFill>
  );
};
