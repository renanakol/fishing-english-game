import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash, Media, RiseWord, SlamWord, Wipe, accentAt, fitSize, fontFamily, useShake } from "../components";
import { BEAT, Service, brand, services } from "../config";

// Full-screen works cut on every other beat, with a giant title and lines that hit on the beat.
export const ServiceScene: React.FC<{ service: Service; index: number; duration: number }> = ({
  service,
  index,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const accent = accentAt(index + 1);
  const nextAccent = accentAt(index + 2);
  const shot = 2 * BEAT;
  const shots = Math.ceil(duration / shot);
  const titleAt = 6;
  const shake = useShake(titleAt + 4, 22);
  const titleSize = fitSize(service.title, width, Math.min(width, height) * 0.42, 0.92);
  const lineSize = Math.min(width, height) * 0.13;
  const exitAt = duration - 8;
  const counterOpacity = interpolate(frame, [4, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      {Array.from({ length: shots }, (_, i) => (
        <Sequence key={i} from={i * shot} durationInFrames={shot}>
          <Media src={service.media[i % service.media.length]} duration={shot} />
          {i > 0 ? <Flash at={0} strength={0.5} /> : null}
        </Sequence>
      ))}

      {/* Legibility: darken toward where the text sits. */}
      <AbsoluteFill
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.15) 100%)" }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: height * 0.1,
          gap: lineSize * 0.05,
          transform: shake,
        }}
      >
        <SlamWord text={service.title} delay={titleAt} size={titleSize} color={accent} />
        {service.lines.map((line, i) => (
          <RiseWord
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
          fontWeight: 900,
          fontSize: Math.min(width, height) * 0.05,
          color: brand.colors.paper,
          opacity: counterOpacity,
          direction: "ltr",
        }}
      >
        <span style={{ color: accent }}>{String(index + 1).padStart(2, "0")}</span>
        <span style={{ opacity: 0.6 }}> / {String(services.length).padStart(2, "0")}</span>
      </div>

      <Wipe at={0} length={8} color={accent} mode="out" />
      <Wipe at={exitAt} length={8} color={nextAccent} mode="in" />
    </AbsoluteFill>
  );
};
