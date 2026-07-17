import React from "react";
import { Composition, Sequence, staticFile } from "remotion";
import { BasicTutorial } from "./templates/BasicTutorial";
import { VideoProps } from "./types/video";
import dataKonten from "../konten.json";

interface KontenItem extends VideoProps {
  id: string;
  durasiDetik?: number;
}

// Fungsi pembantu untuk menghitung durasi total video secara presisi
const hitungTotalFrameVideo = (konten: KontenItem): number => {
  // Mengambil nilai durasiDetik asli hasil hitungan akurat skrip generator TTS Anda
  const durasiAudioUtama = konten.durasiDetik || 8;
  
  // Visual intro dikunci 3 detik, visual outro dikunci 3 detik di akhir video
  const introDetik = 3;
  const outroDetik = 3;
  
  // Total durasi video = Panjang suara generator + 3 detik intro + 3 detik outro
  const totalDetik = durasiAudioUtama + introDetik + outroDetik;
  return Math.ceil(totalDetik * 30); // Dikonversi ke satuan Frame (30 FPS)
};

const BundleVideoCollection: React.FC<{ listKonten: KontenItem[] }> = ({ listKonten }) => {
  let currentFramePointer = 0;

  return (
    <>
      {listKonten.map((konten) => {
        const fileAudio = `suara-${konten.id}.mp3`;
        const durasiFrameVideoIni = hitungTotalFrameVideo(konten);
        const startFromFrame = currentFramePointer;
        currentFramePointer += durasiFrameVideoIni;

        return (
          <Sequence
            key={konten.id}
            from={startFromFrame}
            durationInFrames={durasiFrameVideoIni}
          >
            <BasicTutorial
              judul={konten.judul}
              bahasa={konten.bahasa}
              kode={konten.kode}
              html={konten.html}
              css={konten.css}
              js={konten.js}
              suaraUrl={staticFile(fileAudio)}
              narasi={konten.narasi}
              output={konten.output}
              durasiIntroDetik={3} // Mengunci durasi visual intro 3 detik
              durasiOutroDetik={3} // Mengunci durasi visual outro 3 detik
              teksIntroSub={konten.teksIntroSub || "Tutorial Kilat 1 Menit"}
              teksOutroUtama={konten.teksOutroUtama || "Terima Kasih!"}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  const listKonten = (dataKonten as unknown) as KontenItem[];

  // Menghitung total akumulasi frame gabungan seluruh video bundle
  const totalFrameBundle = listKonten.reduce((total, konten) => {
    return total + hitungTotalFrameVideo(konten);
  }, 0);

  return (
    <>
      {/* 1. Komposisi Massal (Bundling Gabungan Video) */}
      <Composition
        id="bundle-konten"
        component={BundleVideoCollection as unknown as React.ComponentType<Record<string, unknown>>}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={totalFrameBundle}
        defaultProps={{
          listKonten,
        }}
      />

      {/* 2. Komposisi Individual (Render per ID Video) */}
      {listKonten.map((konten) => {
        const fileAudio = `suara-${konten.id}.mp3`;
        const totalFramePasti = hitungTotalFrameVideo(konten);

        return (
          <Composition
            key={konten.id}
            id={konten.id}
            component={BasicTutorial as unknown as React.ComponentType<Record<string, unknown>>}
            fps={30}
            width={1080}
            height={1920}
            durationInFrames={totalFramePasti}
            defaultProps={{
              judul: konten.judul,
              bahasa: konten.bahasa,
              kode: konten.kode,
              html: konten.html,
              css: konten.css,
              js: konten.js,
              suaraUrl: staticFile(fileAudio),
              narasi: konten.narasi,
              output: konten.output,
              durasiIntroDetik: 3,
              durasiOutroDetik: 3,
              teksIntroSub: konten.teksIntroSub || "Tutorial Kilat 1 Menit",
              teksOutroUtama: konten.teksOutroUtama || "Terima Kasih!",
            }}
          />
        );
      })}
    </>
  );
};
