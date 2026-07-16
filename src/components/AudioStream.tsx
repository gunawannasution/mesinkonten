import React, { useMemo } from "react";
import { Audio, staticFile } from "remotion";

interface AudioStreamProps {
  suaraUrl: string;
  isMengetik: boolean;
}

export const AudioStream: React.FC<AudioStreamProps> = ({ suaraUrl, isMengetik }) => {
  // Melakukan sanitasi jalur string audio hasil download backend
  const resolvedSuaraUrl = useMemo(() => {
    if (!suaraUrl) return "";
    if (suaraUrl.startsWith("/static")) return suaraUrl;
    if (suaraUrl.startsWith("/public")) {
      const jalurBersih = suaraUrl.replace("/public", "");
      return staticFile(jalurBersih);
    }
    return staticFile(suaraUrl);
  }, [suaraUrl]);

  return (
    <>
      {/* Memutar Voice Over AI Utama */}
      {resolvedSuaraUrl && <Audio src={resolvedSuaraUrl} />}
      
      {/* Memutar SFX Klik Keyboard Mekanikal */}
      {isMengetik && <Audio src={staticFile("/click.mp3")} volume={0.25} />}
    </>
  );
};
