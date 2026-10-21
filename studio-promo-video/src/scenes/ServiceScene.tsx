import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { LineWord, Media, RevealWord, Wipe, accentAt, fitSize } from "../components";
import { BEAT, Service, brand, sec, services, shotDuration, shotSrc } from "../config";

// Works shown full screen one after another, with a title and a single line at the bottom.
export const ServiceScene: React.FC<{ service: Service; index: number; duration: number }> = ({
  service,
  index,
  duration,
}) => {
  const { width, height } = useVideoConfig();
  const accent = accentAt(index + 1);
  // The last service hands over to the white comparison/outro screens.
  const nextAccent = index === services.length - 1 ? brand.colors.paper : accentAt(index + 2);
  const unit = Math.min(width, height);
  const titleSize = fitSize(service.title, width, unit * 0.32, 0.85);
  const starts = service.media.map((_, i) => service.media.slice(0, i).reduce((sum, s) => sum + shotDuration(s), 0));

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      {service.media.map((shot, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={shotDuration(shot)}>
          <Media src={shotSrc(shot)} duration={shotDuration(shot)} />
        </Sequence>
      ))}

      {/* Legibility: a short, soft shade only behind the text, so the works stay visible. */}
      <AbsoluteFill
        style={{ background: "linear-gradient(to top, rgba(20,18,32,0.9) 0%, rgba(20,18,32,0.55) 22%, rgba(20,18,32,0) 40%)" }}
      />

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: height * 0.07 }}>
        <RevealWord text={service.title} delay={sec(0.27)} size={titleSize} color={accent} />
        <LineWord text={service.line} delay={BEAT * 2} size={unit * 0.065} color={brand.colors.ink} background={accent} />
      </AbsoluteFill>

      <Wipe at={0} length={sec(0.4)} color={accent} mode="out" />
      <Wipe at={duration - sec(0.4)} length={sec(0.4)} color={nextAccent} mode="in" />
    </AbsoluteFill>
  );
};
