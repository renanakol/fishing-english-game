import React from "react";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Media, PillButton, RevealWord, Ticker, Wipe, accentAt, fitSize, fontFamily } from "../components";
import { BEAT, brand, outro, sec, ticker } from "../config";
import { LogoReveal } from "./LogoReveal";

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

// The logo draws itself on, then the website button and Instagram handle settle in under it.
const ContactCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const settle = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: unit * 0.06 }}>
      <LogoReveal width={unit * 0.72} delay={sec(0.2)} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: unit * 0.03,
          fontFamily,
          opacity: settle(sec(2.3)),
          transform: `translateY(${(1 - settle(sec(2.3))) * 50}px)`,
        }}
      >
        <PillButton text={outro.website} size={unit * 0.055} background={brand.colors.ink} color={brand.colors.paper} />
        <div style={{ fontWeight: 400, fontSize: unit * 0.05, color: accentAt(0), direction: "ltr" }}>{outro.instagram}</div>
      </div>
      <div
        style={{ position: "absolute", bottom: height * 0.06, left: -width * 0.1, width: width * 1.2, transform: "rotate(-3deg)" }}
      >
        <Ticker items={ticker} size={unit * 0.045} background={accentAt(1)} color={brand.colors.ink} />
      </div>
    </AbsoluteFill>
  );
};
