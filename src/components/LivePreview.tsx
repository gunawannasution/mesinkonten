import React from "react";
import { IFrame } from "remotion";

interface LivePreviewProps {
  previewHtml: string;
  previewCss: string;
  js: string;
  frame: number;
  typingEndFrame: number;
  entrance: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  previewHtml,
  previewCss,
  js,
  frame,
  typingEndFrame,
  entrance,
}) => {
  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        html, body { 
          margin: 0; padding: 0; width: 100%; height: 100%;
          overflow: hidden; box-sizing: border-box;
          background-color: #0b0f19; color: #ffffff; font-family: sans-serif;
          display: flex; justify-content: center; align-items: center;
        }
        .preview-wrapper {
          width: 100%; height: 100%; padding: 25px;
          display: flex; justify-content: center; align-items: center; box-sizing: border-box;
        }
        ${previewCss}
      </style>
    </head>
    <body>
      <div class='preview-wrapper'>${previewHtml}</div>
      ${frame >= typingEndFrame && js ? `<script>try { ${js} } catch(e) { console.error(e); }</script>` : ""}
    </body>
    </html>
  `;

  return (
    <div style={{ width: "100%", height: "83%", background: "#0b0f19", borderRadius: 20, overflow: "hidden", transform: `scale(${entrance})`, opacity: entrance, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
      <div style={{ height: 52, background: "#111625", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <div style={{ color: "#9ca3af", fontSize: 14, fontFamily: "sans-serif", fontWeight: 600, marginLeft: 10 }}>🌐 LIVE PREVIEW</div>
      </div>
      <IFrame srcDoc={srcDoc} sandbox="allow-scripts" scrolling="no" style={{ width: "100%", height: "calc(100% - 52px)", border: "none", overflow: "hidden" }} />
    </div>
  );
};
