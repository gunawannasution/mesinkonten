// src/components/CodeBox.tsx
import React from "react";
import { LANGUAGE_THEMES } from "../config/themes";

interface CodeBoxProps {
  kode: string;
  bahasa: string;
}

export const CodeBox: React.FC<CodeBoxProps> = ({
  kode,
  bahasa,
}) => {
  const theme = LANGUAGE_THEMES[bahasa] || {
    primaryColor: "#00ffcc",
    name: bahasa.toUpperCase(),
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(180deg, rgba(15,18,30,0.96), rgba(8,10,18,1))",
        borderRadius: 28,
        border: `2px solid ${theme.primaryColor}22`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 20px 60px ${theme.primaryColor}12`,
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
          borderBottom:
            "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#ff5f57",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#febc2e",
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#28c840",
          }}
        />

        <div
          style={{
            marginLeft: 18,
            fontSize: 24,
            fontWeight: 800,
            color: theme.primaryColor,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {theme.name}
        </div>
      </div>

      {/* Code */}
      <div
        style={{
          flex: 1,
          padding: "30px 34px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          overflow: "hidden", // penting
        }}
      >
        <pre
          style={{
            margin: 0,
            width: "100%",
            color: "#ffffff",
            fontFamily:
              "'Fira Code', monospace",

            // Bigger for TikTok
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.6,

            // Important for typing visibility
            whiteSpace: "pre-wrap",

            // Prevent overflow
            overflowWrap: "break-word",
            wordBreak: "break-word",

            // Keep inside box
            maxWidth: "100%",

            // Better readability
            letterSpacing: -0.5,
          }}
        >
          {kode}
        </pre>
      </div>
    </div>
  );
};