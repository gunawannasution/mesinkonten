import React from "react";
import { Composition, Sequence, staticFile } from "remotion";
import { BasicTutorial } from "./templates/BasicTutorial";
import { VideoProps } from "./types/video";
import dataKonten from "../konten.json";

interface KontenItem extends VideoProps {
  id: string;
  durasiDetik?: number;
}

// Fungsi pembantu untuk menghitung durasi total frame per video secara dinamis
const hitungTotalFrameVideo = (konten: KontenItem): number => {
  const durasiAudio = konten.durasiDetik || 8;
  const introDetik = konten.durasiIntroDetik || 3; // Default 3 detik jika di json kosong
  const outroDetik = konten.durasiOutroDetik || 3; // Default 3 detik jika di json kosong
  
  // Total durasi = Audio + Buffer (1.5s) + Intro + Outro
  const totalDetik = durasiAudio + 1.5 + introDetik + outroDetik;
  return Math.ceil(totalDetik * 30);
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
              // Meneruskan parameter baru ke komponen
              durasiIntroDetik={konten.durasiIntroDetik}
              durasiOutroDetik={konten.durasiOutroDetik}
              teksIntroSub={konten.teksIntroSub}
              teksOutroUtama={konten.teksOutroUtama}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  const listKonten = dataKonten as KontenItem[];
  
  // Menghitung total frame untuk gabungan seluruh video di bundle
  const totalFrameBundle = listKonten.reduce((total, konten) => {
    return total + hitungTotalFrameVideo(konten);
  }, 0);

  return (
    <>
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
              // Mendaftarkan properti baru di defaultProps Composition individual
              durasiIntroDetik: konten.durasiIntroDetik,
              durasiOutroDetik: konten.durasiOutroDetik,
              teksIntroSub: konten.teksIntroSub,
              teksOutroUtama: konten.teksOutroUtama,
            }}
          />
        );
      })}
    </>
  );
};
