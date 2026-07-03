// src/Root.tsx
import React from "react";
import { Composition, Sequence, staticFile } from "remotion";
import { BasicTutorial } from "./templates/BasicTutorial";
import { VideoProps } from "./types/video";
import dataKonten from "../konten.json";

interface KontenItem extends VideoProps {
  id: string;
  durasiDetik?: number;
}

const BundleVideoCollection: React.FC<{
  listKonten: KontenItem[];
}> = ({ listKonten }) => {
  let currentFramePointer = 0;

  return (
    <>
      {listKonten.map((konten) => {
        const fileAudio = `suara-${konten.id}.mp3`;

        const durasiAudio = konten.durasiDetik || 8;
        const durasiFrameVideoIni = Math.ceil(
          (durasiAudio + 1.5) * 30
        );

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
            />
          </Sequence>
        );
      })}
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  const listKonten = dataKonten as KontenItem[];

  const totalFrameBundle = listKonten.reduce(
    (total, konten) => {
      const durasiAudio = konten.durasiDetik || 8;

      return (
        total +
        Math.ceil((durasiAudio + 1.5) * 30)
      );
    },
    0
  );

  return (
    <>
      <Composition
        id="bundle-konten"
        component={
          BundleVideoCollection as unknown as React.ComponentType<
            Record<string, unknown>
          >
        }
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

        const durasiAudio = konten.durasiDetik || 8;

        const totalFramePasti = Math.ceil(
          (durasiAudio + 1.5) * 30
        );

        return (
          <Composition
            key={konten.id}
            id={konten.id}
            component={
              BasicTutorial as unknown as React.ComponentType<
                Record<string, unknown>
              >
            }
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
            }}
          />
        );
      })}
    </>
  );
};