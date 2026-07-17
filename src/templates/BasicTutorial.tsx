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
  output = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const theme = LANGUAGE_THEMES[bahasa] || { primaryColor: "#00ffcc" };
  const isWeb = bahasa === "html" || bahasa === "css" || bahasa === "web";

  // Durasi intro & outro
  const introEnd = fps * 3;
  const outroStart = durationInFrames - fps * 3;

  // =========================
  // INTRO 3 DETIK
  // =========================
  if (frame < introEnd) {
    const opacity = interpolate(frame, [0, introEnd * 0.5, introEnd], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: 72, color: theme.primaryColor, textShadow: `0 0 30px ${theme.primaryColor}`, opacity }}>
          {judul}
        </h1>
        <h2 style={{ fontSize: 36, color: "#fff", marginTop: 20, opacity }}>
          Tutorial Premium Coding
        </h2>
      </AbsoluteFill>
    );
  }

  // =========================
  // OUTRO 3 DETIK
  // =========================
  if (frame >= outroStart) {
    const opacity = interpolate(frame, [outroStart, outroStart + fps * 1.5, durationInFrames], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill style={{ background: "#080a10", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontSize: 48, color: theme.primaryColor, textShadow: `0 0 25px ${theme.primaryColor}`, opacity }}>
          {output || "Terima kasih sudah menonton!"}
        </h2>
      </AbsoluteFill>
    );
  }

  // =========================
  // KONTEN UTAMA (kode asli kamu)
  // =========================
  // Format gabungan kode
  const fullCode = isWeb 
    ? `${html ? html + "\n\n" : ""}${
        css ? css.replace(/{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/}/g, "\n}\n\n") : ""
      }${js ? js : ""}`.trim()
    : kode;

  const startTypingFrame = 30;
  const totalLength = Math.max(fullCode.length, 1);
  const totalFrameKetik = Math.floor(durationInFrames * 0.75);
  const durasiKetikDetik = totalFrameKetik / fps;
  const typingEndFrame = startTypingFrame + totalFrameKetik;

  const progressKetik = interpolate(
    frame,
    [startTypingFrame, typingEndFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const currentCharCount = frame >= typingEndFrame ? totalLength : Math.floor(totalLength * progressKetik);
  const liveFullCodeForWeb = fullCode.slice(0, currentCharCount);

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

  const entrance = spring({ frame: Math.max(0, frame - startTypingFrame), fps, config: { damping: 15, mass: 0.6 } });
  const cameraScale = interpolate(frame, [0, durationInFrames], [1.02, 1.07]);
  const cameraY = interpolate(frame, [0, startTypingFrame, typingEndFrame], [-15, 5, 0]);
  const progressPercent = (frame / durationInFrames) * 100;

  return (
    <AbsoluteFill style={{ background: "#08090d", color: "#fff", padding: "50px 60px", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box", transform: `scale(${cameraScale}) translateY(${cameraY}px)` }}>
      <AudioStream suaraUrl={suaraUrl} isMengetik={frame >= startTypingFrame && frame <= typingEndFrame} />

      <div style={{ height: "24%", flexShrink: 0 }}>
        <Header judul={judul} bahasa={bahasa} />
      </div>

      <div style={{ height: "76%", display: "flex", flexDirection: "column", gap: 30, paddingBottom: 40 }}>
        <div style={{ height: "48%", width: "100%" }}>
          <CodeBox kode={fullCode} bahasa={bahasa} durasiKetikDetik={durasiKetikDetik} />
        </div>
        <div style={{ height: "48%", width: "100%" }}>
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

      <div style={{ position: "absolute", bottom: 0, left: 0, height: 10, width: `${progressPercent}%`, background: `linear-gradient(90deg, ${theme.primaryColor}, #ffffff)`, boxShadow: `0 0 15px ${theme.primaryColor}` }} />
    </AbsoluteFill>
  );
};
