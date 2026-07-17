import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { VideoProps } from "../types/video";
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
  suaraIntroUrl,
  suaraOutroUrl, // Sudah aman digunakan
  output = "",
  durasiIntroDetik = 3,
  durasiOutroDetik = 3,
  teksIntroSub = "",
  teksOutroUtama = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const theme = LANGUAGE_THEMES[bahasa] || { primaryColor: "#00ffcc" };
  const isWeb = bahasa === "html" || bahasa === "css" || bahasa === "web";

  const fullCode = isWeb
    ? `${html ? html + "\n\n" : ""}${
        css ? css.replace(/{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/}/g, "\n}\n\n") : ""
      }${js ? js : ""}`.trim()
    : kode;

  // =======================================================
  // PENGATURAN WAKTU DINAMIS BERDASARKAN DURASI INTRO & OUTRO
  // =======================================================
  const startTypingFrame = durasiIntroDetik * fps;
  const frameOutroMulai = durationInFrames - (durasiOutroDetik * fps);
  const totalFrameKetik = Math.floor((frameOutroMulai - startTypingFrame) * 0.75);
  const durasiKetikDetik = totalFrameKetik / fps;
  const typingEndFrame = startTypingFrame + totalFrameKetik;
  const totalLength = Math.max(fullCode.length, 1);

  // Gelombang matematika interpolasi pengetikan sinkron narasi suara
  const progressKetik = interpolate(
    frame,
    [startTypingFrame, startTypingFrame + (totalFrameKetik * 0.3), startTypingFrame + (totalFrameKetik * 0.6), typingEndFrame],
    [0, 0.35, 0.65, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const currentCharCount = frame >= typingEndFrame ? totalLength : Math.floor(totalLength * progressKetik);
  const liveFullCodeForWeb = fullCode.slice(0, currentCharCount);

  // Perhitungan suara klik tombol keyboard
  const progressSebelumnya = interpolate(
    frame - 1,
    [startTypingFrame, startTypingFrame + (totalFrameKetik * 0.3), startTypingFrame + (totalFrameKetik * 0.6), typingEndFrame],
    [0, 0.35, 0.65, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const charFrameSebelumnya = Math.floor(totalLength * progressSebelumnya);
  const isMengetik = currentCharCount > charFrameSebelumnya && frame >= startTypingFrame && frame <= typingEndFrame;

  // Sistem pemroses teks keluaran terminal console
  const outputStartFrame = typingEndFrame + 15;
  const cleanOutput = output?.trim() || "➔ Program executed successfully.";
  const outputProgress = Math.max(0, Math.min((frame - outputStartFrame) / Math.max(cleanOutput.length * 0.5, 1), 1));
  const outputChars = Math.floor(cleanOutput.length * outputProgress);
  const liveOutputText = cleanOutput.slice(0, outputChars);

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

  // Efek kamera sinematik
  const entrance = spring({
    frame: Math.max(0, frame - startTypingFrame),
    fps,
    config: { damping: 15, mass: 0.6 }
  });

  const cameraScale = interpolate(frame, [0, durationInFrames], [1.02, 1.07]);
  const cameraY = interpolate(frame, [0, startTypingFrame, typingEndFrame], [-15, 5, 0]);
  const progressPercent = (frame / durationInFrames) * 100;

  // Transisi memudar (fade-out intro & fade-in outro)
  const introOpacity = interpolate(frame, [startTypingFrame - 15, startTypingFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outroOpacity = interpolate(frame, [frameOutroMulai, frameOutroMulai + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#08090d", color: "#fff", padding: "50px 60px", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box", transform: `scale(${cameraScale}) translateY(${cameraY}px)` }}>
      
      {/* Pemanggilan Mesin Aliran Audio */}
      <AudioStream 
        suaraUrl={suaraUrl} 
        suaraIntroUrl={suaraIntroUrl} 
        suaraOutroUrl={suaraOutroUrl} 
        isMengetik={isMengetik} 
        startTypingFrame={startTypingFrame} 
        frameOutroMulai={frameOutroMulai} 
      />

      {/* Area Atas: Header Judul Video */}
      <div style={{ height: "24%", flexShrink: 0, boxSizing: "border-box" }}>
        <Header judul={judul} bahasa={bahasa} />
      </div>

      {/* Area Utama: Struktur Split-Screen */}
      <div style={{ height: "76%", display: "flex", flexDirection: "column", gap: 30, boxSizing: "border-box", paddingBottom: 40 }}>
        <div style={{ height: "48%", width: "100%", flexShrink: 0, boxSizing: "border-box" }}>
          <CodeBox kode={fullCode} bahasa={bahasa} durasiKetikDetik={durasiKetikDetik} />
        </div>

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

      {/* Progress Bar Neon */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 10, width: `${progressPercent}%`, background: `linear-gradient(90deg, ${theme.primaryColor}, #ffffff)`, boxShadow: `0 0 15px ${theme.primaryColor}` }} />

      {/* LAYAR PEMBUKA (INTRO) */}
      {frame < startTypingFrame && (
        <AbsoluteFill style={{ background: "#0b0f19", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", zIndex: 10, opacity: introOpacity }}>
          <h1 style={{ fontSize: 64, fontWeight: 900, color: "#fff", textAlign: "center", maxWidth: "80%" }}>{judul}</h1>
          {teksIntroSub && <p style={{ fontSize: 28, color: theme.primaryColor, marginTop: 20 }}>{teksIntroSub}</p>}
        </AbsoluteFill>
      )}

      {/* LAYAR PENUTUP (OUTRO) */}
      {frame >= frameOutroMulai && (
        <AbsoluteFill style={{ background: "#0b0f19", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", zIndex: 10, opacity: outroOpacity }}>
          {teksOutroUtama ? (
            <h1 style={{ fontSize: 72, fontWeight: 900, color: theme.primaryColor, textAlign: "center", maxWidth: "80%" }}>{teksOutroUtama}</h1>
          ) : (
            <h1 style={{ fontSize: 72, fontWeight: 900, color: theme.primaryColor, textAlign: "center" }}>Terima Kasih!</h1>
          )}
          <p style={{ fontSize: 24, color: "#6272a4", marginTop: 20 }}>Jangan lupa like & subscribe!</p>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
