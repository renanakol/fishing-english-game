import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RevealWord, Wipe, accentAt, fitSize, fontFamily } from "../components";
import { BEAT, brand, outro, services } from "../config";

// Call to action words rise in one per beat, then the logo and contact details settle in.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const bg = accentAt(services.length + 1);
  const unit = Math.min(width, height);
  const settle = spring({ frame: frame - outro.words.length * BEAT, fps, config: { damping: 200 } });
  const size = Math.min(...outro.words.map((w) => fitSize(w, width, unit * 0.26)));

  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", gap: unit * 0.06 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {outro.words.map((w, i) => (
          <RevealWord key={w} text={w} delay={i * BEAT} size={size} color={i === 1 ? accentAt(0) : brand.colors.ink} />
        ))}
      </div>
      <div
        style={{
          opacity: settle,
          transform: `translateY(${(1 - settle) * 60}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: unit * 0.03,
        }}
      >
        {brand.logo ? <Img src={staticFile(brand.logo)} style={{ width: unit * 0.42 }} /> : null}
        <div
          style={{
            fontFamily,
            color: brand.colors.ink,
            textAlign: "center",
            direction: "ltr",
            lineHeight: 1.35,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: unit * 0.06 }}>{outro.website}</div>
          <div style={{ fontWeight: 400, fontSize: unit * 0.045, color: accentAt(0) }}>{outro.instagram}</div>
        </div>
      </div>
      <Wipe at={0} length={12} color={bg} mode="out" />
    </AbsoluteFill>
  );
};
