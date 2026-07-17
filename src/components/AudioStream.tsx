import React, { useMemo } from "react";
import { Audio, staticFile } from "remotion";

interface AudioStreamProps {
  suaraUrl: string;
  suaraIntroUrl?: string;
  suaraOutroUrl?: string;
  isMengetik: boolean;
  startTypingFrame: number;
  frameOutroMulai: number;
}

export const AudioStream: React.FC<AudioStreamProps> = ({
  suaraUrl,
  isMengetik,
}) => {
  const resolvedSuaraUrl = useMemo(() => {
    if (!suaraUrl) return "";
    return suaraUrl;
  }, [suaraUrl]);

  return (
    <>
      {/* 🌟 SOLUSI AUDIO: Suara generator tunggal diputar utuh dari frame 0 tanpa pembatas sekuens */}
      {resolvedSuaraUrl && (
        <Audio src={resolvedSuaraUrl} startFrom={0} />
      )}

      {/* SFX Mekanikal papan ketik hanya berbunyi saat visual editor mulai mengetik */}
      {isMengetik && (
        <Audio src={staticFile("/click.mp3")} volume={0.25} />
      )}
    </>
  );
};
