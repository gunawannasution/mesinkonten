import {
  AbsoluteFill,
  Audio,
  IFrame,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import React, { useMemo } from "react";
import { VideoProps } from "../types/video";
import { Header } from "../components/Header";
import { CodeBox } from "../components/CodeBox";
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

  const theme = LANGUAGE_THEMES[bahasa] || {
    primaryColor: "#00ffcc",
  };

  const isWeb = bahasa === "html" || bahasa === "css" || bahasa === "web";
  
  const fullCode = isWeb 
    ? `${html ? html + "\n\n" : ""}${
        css ? css.replace(/{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/}/g, "\n}\n\n") : ""
      }${js ? js : ""}`.trim()
    : kode;

  const startTypingFrame = 30;
  const totalLength = Math.max(fullCode.length, 1);
  const totalFrameKetik = Math.min(
    Math.ceil(totalLength * 1.2), 
    Math.floor(durationInFrames * 0.7)
  );
  const durasiKetikDetik = totalFrameKetik / fps;
  const typingEndFrame = startTypingFrame + totalFrameKetik;

  const typingProgress = Math.max(
    0,
    Math.min((frame - startTypingFrame) / Math.max(totalFrameKetik, 1), 1)
  );
  const currentCharCount = Math.floor(totalLength * typingProgress);
  const liveFullCodeForWeb = fullCode.slice(0, currentCharCount);

  const charFrameSebelumnya = Math.floor(
    totalLength * Math.max(0, Math.min((frame - 1 - startTypingFrame) / Math.max(totalFrameKetik, 1), 1))
  );
  const isMengetik = currentCharCount > charFrameSebelumnya && frame >= startTypingFrame && frame <= typingEndFrame;

  const outputStartFrame = typingEndFrame + 15;
  const cleanOutput = output?.trim() || "➔ Program executed successfully.";
  
  const outputProgress = Math.max(
    0,
    Math.min((frame - outputStartFrame) / Math.max(cleanOutput.length * 0.5, 1), 1)
  );
  const outputChars = Math.floor(cleanOutput.length * outputProgress);
  const liveOutputText = cleanOutput.slice(0, outputChars);

  let previewHtml = "";
  let previewCss = "";

  if (isWeb) {
    if (html && liveFullCodeForWeb.length <= html.length) {
      previewHtml = liveFullCodeForWeb;
    } else if (html) {
      previewHtml = html;
      const sisaTeks = liveFullCodeForWeb.slice(html.length + 2);
      if (css) {
        previewCss = sisaTeks.slice(0, css.length);
      }
    } else if (css) {
      previewCss = liveFullCodeForWeb.slice(0, css.length);
    }
  }

  const entrance = spring({
    frame: Math.max(0, frame - startTypingFrame),
    fps,
    config: { damping: 15, mass: 0.6 },
  });

  // UPGRADE ANIMASI: Kamera bergerak maju perlahan dari awal sampai akhir video (Ambient Zoom)
  // Membuat video terasa dinamis dan tidak membosankan bagi mata penonton
  const cameraScale = interpolate(frame, [0, durationInFrames], [1.02, 1.07]);
  const cameraY = interpolate(frame, [0, startTypingFrame, typingEndFrame], [-10, 3, 0]);
  const progressPercent = (frame / durationInFrames) * 100;

  // ANIMASI UPGRADE: Opasitas teks output console memudar naik secara berjenjang
  const outputOpacity = interpolate(frame, [outputStartFrame, outputStartFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolvedSuaraUrl = useMemo(() => {
    if (!suaraUrl) return "";
    if (suaraUrl.startsWith("/static")) return suaraUrl;
    if (suaraUrl.startsWith("/public")) {
      const jalurBersih = suaraUrl.replace("/public", "");
      return staticFile(jalurBersih);
    }
    return staticFile(suaraUrl);
  }, [suaraUrl]);

  const renderPreview = () => {
    if (frame < startTypingFrame) return <div style={{ flex: 1 }} />;

    if (isWeb) {
      const srcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 25px; 
              font-family: sans-serif; 
              color: #ffffff; 
              background-color: #0b0f19; 
              display: flex;
              justify-content: center;
              align-items: center;
              height: 80vh;
            }
            ${previewCss}
          </style>
        </head>
        <body>
          ${previewHtml}
          ${typingProgress >= 1 && js ? `<script>try { ${js} } catch(e) { console.error(e); }</script>` : ""}
        </body>
        </html>
      `;

      return (
        <div style={{ flex: 1, background: "#0b0f19", borderRadius: 20, overflow: "hidden", transform: `scale(${entrance})`, opacity: entrance, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ height: 52, background: "#111625", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
            </div>
            <div style={{ color: "#9ca3af", fontSize: 14, fontFamily: "sans-serif", fontWeight: 600, marginLeft: 10 }}>🌐 LIVE PREVIEW</div>
          </div>
          <IFrame srcDoc={srcDoc} sandbox="allow-scripts" style={{ width: "100%", height: "100%", border: "none" }} />
        </div>
      );
    }

    return (
      <div
        style={{
          flex: 1,
          borderRadius: 20,
          overflow: "hidden",
          transform: `scale(${entrance})`,
          opacity: entrance,
          background: "linear-gradient(180deg, rgba(22,24,35,0.95) 0%, rgba(10,12,18,1) 100%)",
          border: `1px solid ${theme.primaryColor}35`,
          boxShadow: "0 25px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
          </div>
          <div style={{ color: "#9ca3af", fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>
            {bahasa === "python" ? "python3 app.py" : "node index.js"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4ade80" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
            Active
          </div>
        </div>

        <div style={{ flex: 1, padding: 28, fontFamily: "'Fira Code', monospace", position: "relative" }}>
          <div style={{ color: "#6b7280", fontSize: 18, marginBottom: 20 }}>
            $ {bahasa === "python" ? "python app.py" : "node index.js"}
          </div>
          
          {frame >= typingEndFrame && frame < outputStartFrame && (
            <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: 500 }}>➔ Running...</div>
          )}

          {/* UPGRADE VISUAL: Hasil output memudar naik secara lembut menggunakan variabel outputOpacity */}
          <pre style={{ margin: 0, fontSize: 24, lineHeight: 1.7, whiteSpace: "pre-wrap", color: theme.primaryColor, textShadow: `0 0 12px ${theme.primaryColor}40`, opacity: outputOpacity }}>
            {liveOutputText}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: "#08090d", // Sedikit lebih gelap premium untuk memaksimalkan kontras neon glow
        color: "#fff",
        padding: "50px 60px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
      }}
    >
      {resolvedSuaraUrl && <Audio src={resolvedSuaraUrl} />}
      {isMengetik && <Audio src={staticFile("/click.mp3")} volume={0.25} />}

      <Header judul={judul} bahasa={bahasa} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24, marginTop: 20 }}>
        <div style={{ flex: 1.2 }}>
          <CodeBox kode={fullCode} bahasa={bahasa} durasiKetikDetik={durasiKetikDetik} />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#6272a4" }}>
            {isWeb ? "🌐 Live Preview" : "💻 Output Console"}
          </div>
          {renderPreview()}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 10, // Sedikit lebih tebal agar bar kemajuan terlihat jelas di HP
          width: `${progressPercent}%`,
          background: `linear-gradient(90deg, ${theme.primaryColor}, #ffffff)`,
          boxShadow: `0 0 15px ${theme.primaryColor}`,
        }}
      />
    </AbsoluteFill>
  );
};
