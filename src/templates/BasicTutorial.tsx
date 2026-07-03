// src/templates/BasicTutorial.tsx
import {
  AbsoluteFill,
  Audio,
  IFrame,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";
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

  const isWeb =
    bahasa === "html" ||
    bahasa === "css" ||
    bahasa === "web";

  const fullCode = isWeb
    ? [html, css, js].filter(Boolean).join("\n\n")
    : kode;

  // =========================
  // TYPING
  // =========================
  const startTypingFrame = 30;
  const typingSpeed = 1.2;

  const totalLength = Math.max(fullCode.length, 1);

  const typingEndFrame = Math.min(
    startTypingFrame + Math.ceil(totalLength * typingSpeed),
    Math.floor(durationInFrames * 0.75)
  );

  const typingProgress = Math.max(
    0,
    Math.min(
      (frame - startTypingFrame) /
        Math.max(typingEndFrame - startTypingFrame, 1),
      1
    )
  );

  const currentCharCount = Math.floor(
    totalLength * typingProgress
  );

  const liveFullCode = fullCode.slice(
    0,
    currentCharCount
  );

  // =========================
  // OUTPUT
  // =========================
  const outputStartFrame = typingEndFrame + 20;

  const cleanOutput =
    output?.replace(/\r/g, "") ||
    "Program executed successfully.";

  const outputProgress = Math.max(
    0,
    Math.min(
      (frame - outputStartFrame) /
        Math.max(cleanOutput.length * 0.8, 1),
      1
    )
  );

  const outputChars = Math.floor(
    cleanOutput.length * outputProgress
  );

  const liveOutputText = cleanOutput.slice(
    0,
    outputChars
  );

  // =========================
  // WEB PREVIEW
  // =========================
  let previewHtml = "";
  let previewCss = "";

  if (isWeb) {
    let offset = 0;

    if (html) {
      previewHtml = liveFullCode.slice(
        offset,
        Math.min(html.length, liveFullCode.length)
      );
      offset += html.length + 2;
    }

    if (css && liveFullCode.length > offset) {
      previewCss = liveFullCode.slice(
        offset,
        offset + css.length
      );
    }
  }

  // =========================
  // ANIMATION
  // =========================
  const entrance = spring({
    frame: Math.max(0, frame - startTypingFrame),
    fps,
    config: {
      damping: 14,
      mass: 0.6,
    },
  });

  const cameraScale = interpolate(
    frame,
    [0, startTypingFrame, typingEndFrame],
    [1.04, 1.02, 1]
  );

  const cameraY = interpolate(
    frame,
    [0, startTypingFrame, typingEndFrame],
    [-10, 5, 0]
  );

  const progressPercent =
    (frame / durationInFrames) * 100;

  // =========================
  // PREVIEW RENDER
  // =========================
  const renderPreview = () => {
    if (frame < startTypingFrame) return null;

    if (isWeb) {
      const srcDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: sans-serif;
              }

              ${previewCss}
            </style>
          </head>
          <body>
            ${previewHtml}

            ${
              typingProgress >= 1 && js
                ? `
            <script>
              try {
                ${js}
              } catch(e) {
                console.log(e);
              }
            </script>
            `
                : ""
            }
          </body>
        </html>
      `;

      return (
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            transform: `scale(${entrance})`,
            opacity: entrance,
          }}
        >
          <div
            style={{
              height: 45,
              background: "#f1f3f4",
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ff5f56",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ffbd2e",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#27c93f",
                }}
              />
            </div>
          </div>

          <IFrame
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
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
          background:
            "linear-gradient(180deg, rgba(22,24,35,0.95) 0%, rgba(10,12,18,1) 100%)",
          border: `1px solid ${theme.primaryColor}35`,
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.04)
          `,
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#ff5f56",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#27c93f",
              }}
            />
          </div>
    
          {/* TITLE */}
          <div
            style={{
              color: "#9ca3af",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            {bahasa === "python"
              ? "python3 app.py"
              : "node index.js"}
          </div>
    
          {/* STATUS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#4ade80",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ade80",
              }}
            />
            Active
          </div>
        </div>
    
        {/* BODY */}
        <div
          style={{
            flex: 1,
            padding: 28,
            fontFamily: "'Fira Code', monospace",
            position: "relative",
          }}
        >
          {/* COMMAND */}
          <div
            style={{
              color: "#6b7280",
              fontSize: 18,
              marginBottom: 20,
            }}
          >
            $ {bahasa === "python" ? "python app.py" : "node index.js"}
          </div>
    
          {/* RUNNING */}
          {frame >= typingEndFrame &&
            frame < outputStartFrame && (
              <div
                style={{
                  color: "#fbbf24",
                  fontSize: 22,
                  fontWeight: 500,
                }}
              >
                Running...
              </div>
            )}
    
          {/* OUTPUT */}
          <pre
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              color: theme.primaryColor,
              textShadow: `0 0 12px ${theme.primaryColor}40`,
            }}
          >
            {liveOutputText}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: "#0a0b10",
        color: "#fff",
        padding: "50px 60px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
      }}
    >
      {suaraUrl && <Audio src={suaraUrl} />}

      <Header
        judul={judul}
        bahasa={bahasa}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 24,
          marginTop: 20,
        }}
      >
        <div style={{ flex: 1.2 }}>
          <CodeBox
            kode={liveFullCode}
            bahasa={bahasa}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 10,
              color: "#6272a4",
            }}
          >
            {isWeb
              ? "🌐 Live Preview"
              : "💻 Output Console"}
          </div>

          {renderPreview()}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 8,
          width: `${progressPercent}%`,
          background: `linear-gradient(90deg, ${theme.primaryColor}, #ffffff)`,
        }}
      />
    </AbsoluteFill>
  );
};