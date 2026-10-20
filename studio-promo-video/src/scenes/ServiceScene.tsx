import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { GhostWord, LineWord, Media, NumberBadge, RevealWord, Wipe, accentAt, fitSize } from "../components";
import { BEAT, Service, brand, sec, services } from "../config";

// Full-screen works cut on the beat, with a big title and supporting lines that rise in on the beat.
export const ServiceScene: React.FC<{ service: Service; index: number; duration: number }> = ({
  service,
  index,
  duration,
}) => {
  const { width, height } = useVideoConfig();
  const accent = accentAt(index + 1);
  // The last service hands over to the white comparison/outro screens.
  const nextAccent = index === services.length - 1 ? brand.colors.paper : accentAt(index + 2);
  // Two beats per work, or one beat when there are more works than fit — every cut lands on the beat.
  const shot =
    (service.beatsPerShot ?? Math.max(1, Math.min(2, Math.floor(duration / BEAT / service.media.length)))) * BEAT;
  const shots = Math.ceil(duration / shot);
  const titleAt = sec(0.27);
  const titleSize = fitSize(service.title, width, Math.min(width, height) * 0.38, 0.9);
  const lineSize = Math.min(width, height) * 0.1;

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      {Array.from({ length: shots }, (_, i) => (
        <Sequence key={i} from={i * shot} durationInFrames={shot}>
          <Media src={service.media[i % service.media.length]} duration={shot} />
        </Sequence>
      ))}

      {/* Legibility: darken toward where the text sits. */}
      <AbsoluteFill
        style={{ background: "linear-gradient(to top, rgba(20,18,32,0.94) 0%, rgba(20,18,32,0.75) 40%, rgba(20,18,32,0.25) 62%, rgba(20,18,32,0) 78%)" }}
      />

      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: height * 0.1, gap: lineSize * 0.1 }}
      >
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* Sits above the title, so the two never collide. */}
          <div
            style={{ position: "absolute", bottom: titleSize * 0.75, display: "flex", justifyContent: "center", width: width * 2 }}
          >
            <GhostWord text={service.ghost} duration={duration} size={titleSize * 1.5} />
          </div>
          <RevealWord text={service.title} delay={titleAt} size={titleSize} color={accent} />
        </div>
        {service.lines.map((line, i) => (
          <LineWord
            key={line}
            text={line}
            delay={(i + 2) * BEAT}
            size={lineSize}
            color={i === 1 ? brand.colors.ink : brand.colors.paper}
            background={i === 1 ? accent : undefined}
          />
        ))}
      </AbsoluteFill>

      <div style={{ position: "absolute", top: height * 0.05, right: width * 0.08 }}>
        <NumberBadge index={index} size={Math.min(width, height) * 0.16} color={accent} delay={sec(0.15)} />
      </div>

      <Wipe at={0} length={sec(0.4)} color={accent} mode="out" />
      <Wipe at={duration - sec(0.4)} length={sec(0.4)} color={nextAccent} mode="in" />
    </AbsoluteFill>
  );
};
