import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { brand, music, services, timing } from "./config";
import { CompareScene } from "./scenes/CompareScene";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { ServiceScene } from "./scenes/ServiceScene";

// Scenes are hard cuts; each one sweeps a color panel in/out at its edges to hide the cut.
export const StudioPromo: React.FC = () => {
  const { intro, service, compare, outro } = timing;
  const serviceStart = (i: number) => intro + i * service;

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      <Sequence durationInFrames={intro}>
        <Intro />
      </Sequence>
      {services.map((s, i) => (
        <Sequence key={s.title} from={serviceStart(i)} durationInFrames={service}>
          <ServiceScene service={s} index={i} duration={service} />
        </Sequence>
      ))}
      <Sequence from={serviceStart(services.length)} durationInFrames={compare}>
        <CompareScene duration={compare} />
      </Sequence>
      <Sequence from={serviceStart(services.length) + compare} durationInFrames={outro}>
        <Outro />
      </Sequence>
      {music ? <Audio src={staticFile(music)} /> : null}
    </AbsoluteFill>
  );
};
