import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LineWord, Media, RevealWord, Wipe, accentAt, fitSize, fontFamily } from "../components";
import { BEAT, Service, brand, sec, services } from "../config";

// Full-screen works cut on the beat, with a big title and supporting lines that rise in on the beat.
export const ServiceScene: React.FC<{ service: Service; index: number; duration: number }> = ({
  service,
  index,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const accent = accentAt(index + 1);
  const nextAccent = accentAt(index + 2);
  // Two beats per work, or one beat when there are more works than fit — every cut lands on the beat.
  const shot = Math.max(1, Math.min(2, Math.floor(duration / BEAT / service.media.length))) * BEAT;
  const shots = Math.ceil(duration / shot);
  const titleAt = sec(0.27);
  const titleSize = fitSize(service.title, width, Math.min(width, height) * 0.38, 0.9);
  const lineSize = Math.min(width, height) * 0.1;
  const counterOpacity = interpolate(frame, [sec(0.2), sec(0.53)], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      {Array.from({ length: shots }, (_, i) => (
        <Sequence key={i} from={i * shot} durationInFrames={shot}>
          <Media src={service.media[i % service.media.length]} duration={shot} />
        </Sequence>
      ))}

      {/* Legibility: darken toward where the text sits. */}
      <AbsoluteFill
        style={{ background: "linear-gradient(to top, rgba(0,8,24,0.88) 0%, rgba(0,8,24,0.35) 50%, rgba(0,8,24,0) 75%)" }}
      />

      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: height * 0.1, gap: lineSize * 0.1 }}
      >
        <RevealWord text={service.title} delay={titleAt} size={titleSize} color={accent} />
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

      <div
        style={{
          position: "absolute",
          top: height * 0.05,
          right: width * 0.07,
          fontFamily,
          fontWeight: 700,
          fontSize: Math.min(width, height) * 0.04,
          letterSpacing: 2,
          color: brand.colors.paper,
          opacity: counterOpacity,
          direction: "ltr",
        }}
      >
        <span style={{ color: accent }}>{String(index + 1).padStart(2, "0")}</span>
        <span style={{ opacity: 0.6 }}> / {String(services.length).padStart(2, "0")}</span>
      </div>

      <Wipe at={0} length={sec(0.4)} color={accent} mode="out" />
      <Wipe at={duration - sec(0.4)} length={sec(0.4)} color={nextAccent} mode="in" />
    </AbsoluteFill>
  );
};
