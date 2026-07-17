import React, { useRef, useEffect } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveOutputText]);

  const isRunning = frame >= typingEndFrame && frame < outputStartFrame;
  const isFinished = frame >= outputStartFrame;
  
  const commandText = bahasa === "python" ? "python app.py" : "node index.js";

  return (
    <div 
      style={{
        ...styles.container,
        borderColor: `${theme.primaryColor}35`,
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      <div style={styles.header}>
        <div style={styles.dotsContainer}>
          <div style={{ ...styles.dot, background: "#ff5f56" }} />
          <div style={{ ...styles.dot, background: "#ffbd2e" }} />
          <div style={{ ...styles.dot, background: "#27c93f" }} />
        </div>
        <div style={styles.commandLabel}>{commandText}</div>
        <div style={styles.statusIndicator}>
          <div style={styles.statusDot} />
          Active
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.promptLine}>
          $ {commandText}
        </div>

        {isRunning && (
          <div style={styles.runningText}>➔ Running...</div>
        )}

        <div ref={scrollRef} style={styles.outputArea}>
          <pre style={styles.preText(theme.primaryColor)}>
            {liveOutputText}
            {isFinished && liveOutputText.length > 0 && (
              <span style={styles.cursor(theme.primaryColor)} />
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "83%",
    borderRadius: 20,
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(22,24,35,0.95) 0%, rgba(10,12,18,1) 100%)",
    border: "1px solid",
    boxShadow: "0 25px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column" as const,
  },
  header: {
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
  },
  dotsContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: "50%",
  },
  commandLabel: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "monospace",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#4ade80",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4ade80",
  },
  body: {
    flex: 1,
    padding: 28,
    fontFamily: "'Fira Code', monospace",
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
  },
  promptLine: {
    color: "#6b7280",
    fontSize: 18,
    marginBottom: 20,
  },
  runningText: {
    color: "#fbbf24",
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 10,
  },
  outputArea: {
    flex: 1,
    overflowY: "auto" as const,
  },
  preText: (color: string) => ({
    margin: 0,
    fontSize: 24,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap" as const,
    color: color,
    textShadow: `0 0 12px ${color}40`,
  }),
  cursor: (color: string) => ({
    display: "inline-block",
    width: 12,
    height: 24,
    backgroundColor: color,
    marginLeft: 4,
    verticalAlign: "middle",
    animation: "blink 1s step-end infinite",
  }),
};