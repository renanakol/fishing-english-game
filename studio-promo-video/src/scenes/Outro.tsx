import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Media, PillButton, RevealWord, Wipe, accentAt, fitSize, fontFamily } from "../components";
import { BEAT, brand, outro, sec } from "../config";

// Two clean screens: the call to action over a photo of the studio, then the logo and contact details.
export const Outro: React.FC = () => {
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const photoPart = 5 * BEAT;
  const size = Math.min(...outro.words.map((w) => fitSize(w, width, unit * 0.26)));

  return (
    <AbsoluteFill style={{ background: brand.colors.paper }}>
      <Sequence durationInFrames={photoPart}>
        <Media src={outro.photo} duration={photoPart} />
        <AbsoluteFill
          style={{ background: "linear-gradient(to top, rgba(20,18,32,0.85) 0%, rgba(20,18,32,0.4) 45%, rgba(20,18,32,0) 70%)" }}
        />
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: height * 0.1 }}>
          {outro.words.map((w, i) => (
            <RevealWord
              key={w}
              text={w}
              delay={sec(0.3) + i * BEAT}
              size={size}
              color={i === 1 ? accentAt(1) : brand.colors.paper}
            />
          ))}
        </AbsoluteFill>
        <Wipe at={0} length={sec(0.4)} color={brand.colors.paper} mode="out" />
        <Wipe at={photoPart - sec(0.4)} length={sec(0.4)} color={brand.colors.paper} mode="in" />
      </Sequence>

      <Sequence from={photoPart}>
        <ContactCard />
      </Sequence>
    </AbsoluteFill>
  );
};

// The logo settles in, then the website button and Instagram handle under it.
const ContactCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const settle = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: unit * 0.06 }}>
      {brand.logo ? (
        <Img
          src={staticFile(brand.logo)}
          style={{
            width: unit * 0.72,
            opacity: settle(sec(0.2)),
            transform: `scale(${interpolate(settle(sec(0.2)), [0, 1], [0.9, 1])})`,
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: unit * 0.03,
          fontFamily,
          opacity: settle(sec(0.9)),
          transform: `translateY(${(1 - settle(sec(0.9))) * 50}px)`,
        }}
      >
        <PillButton text={outro.website} size={unit * 0.055} background={brand.colors.ink} color={brand.colors.paper} />
        <div style={{ fontWeight: 400, fontSize: unit * 0.05, color: accentAt(0), direction: "ltr" }}>{outro.instagram}</div>
      </div>
    </AbsoluteFill>
  );
};
