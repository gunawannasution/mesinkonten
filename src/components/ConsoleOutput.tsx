import React from "react";

interface ConsoleOutputProps {
  bahasa: string;
  theme: { primaryColor: string };
  frame: number;
  typingEndFrame: number;
  outputStartFrame: number;
  liveOutputText: string;
  entrance: number;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  bahasa,
  theme,
  frame,
  typingEndFrame,
  outputStartFrame,
  liveOutputText,
  entrance,
}) => {
  return (
    <div style={{ width: "100%", height: "83%", borderRadius: 20, overflow: "hidden", transform: `scale(${entrance})`, opacity: entrance, background: "linear-gradient(180deg, rgba(22,24,35,0.95) 0%, rgba(10,12,18,1) 100%)", border: `1px solid ${theme.primaryColor}35`, boxShadow: "0 25px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column" }}>
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />Active
        </div>
      </div>
      <div style={{ flex: 1, padding: 28, fontFamily: "'Fira Code', monospace", position: "relative" }}>
        <div style={{ color: "#6b7280", fontSize: 18, marginBottom: 20 }}>
          $ {bahasa === "python" ? "python app.py" : "node index.js"}
        </div>
        {frame >= typingEndFrame && frame < outputStartFrame && (
          <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: 500 }}>➔ Running...</div>
        )}
        <pre style={{ margin: 0, fontSize: 24, lineHeight: 1.7, whiteSpace: "pre-wrap", color: theme.primaryColor, textShadow: `0 0 12px ${theme.primaryColor}40` }}>
          {liveOutputText}
        </pre>
      </div>
    </div>
  );
};
