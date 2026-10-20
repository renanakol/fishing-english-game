import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SlamWord, Wipe, accentAt, fitSize, fontFamily, useShake } from "../components";
import { BEAT, brand, outro, services } from "../config";

// Call to action words hit one per beat, then logo and contact details pop in.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const bg = accentAt(services.length + 1);
  const unit = Math.min(width, height);
  const wordsDone = outro.words.length * BEAT;
  const lastWord = Math.min(outro.words.length - 1, Math.floor(frame / BEAT));
  const shake = useShake(lastWord * BEAT + 2, 16);
  const pop = spring({ frame: frame - wordsDone, fps, config: { damping: 11 } });
  const size = Math.min(...outro.words.map((w) => fitSize(w, width, unit * 0.3)));

  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", gap: unit * 0.05 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: shake }}>
        {outro.words.map((w, i) => (
          <SlamWord key={w} text={w} delay={i * BEAT} size={size} color={i === 1 ? accentAt(0) : brand.colors.ink} />
        ))}
      </div>
      <div
        style={{
          transform: `scale(${pop})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: unit * 0.025,
        }}
      >
        {brand.logo ? <Img src={staticFile(brand.logo)} style={{ width: unit * 0.5 }} /> : null}
        <div
          style={{
            background: brand.colors.ink,
            color: brand.colors.paper,
            fontFamily,
            fontWeight: 700,
            fontSize: unit * 0.045,
            padding: `${unit * 0.02}px ${unit * 0.06}px`,
            borderRadius: 999,
            direction: "ltr",
            textAlign: "center",
          }}
        >
          {outro.website}
          <div style={{ fontSize: unit * 0.034, fontWeight: 400, opacity: 0.8 }}>{outro.instagram}</div>
        </div>
      </div>
      <Wipe at={0} length={8} color={bg} mode="out" />
    </AbsoluteFill>
  );
};
