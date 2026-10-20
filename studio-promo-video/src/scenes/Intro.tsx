import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Media, RevealWord, Wipe, accentAt, fitSize } from "../components";
import { BEAT, allMedia, brand, intro, sec, timing } from "../config";

// One work per beat under a word per beat, then the studio name and slogan.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const montageEnd = intro.words.length * BEAT;
  const wordIndex = Math.min(intro.words.length - 1, Math.floor(frame / BEAT));
  const logoIn = spring({ frame: frame - montageEnd, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      {intro.words.map((_, i) => (
        <Sequence key={i} from={i * BEAT} durationInFrames={BEAT}>
          <Media src={allMedia[(i * 3) % allMedia.length]} duration={BEAT} dim={0.5} />
        </Sequence>
      ))}

      {frame < montageEnd ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <RevealWord
            key={wordIndex}
            text={intro.words[wordIndex]}
            delay={wordIndex * BEAT}
            size={fitSize(intro.words[wordIndex], width, 300)}
            outline={wordIndex === intro.words.length - 1}
          />
        </AbsoluteFill>
      ) : null}

      <Sequence from={montageEnd}>
        <AbsoluteFill style={{ background: brand.colors.ink, justifyContent: "center", alignItems: "center" }}>
          {brand.slogan ? (
            <Img
              src={staticFile(brand.slogan)}
              style={{
                width: width * 0.86,
                opacity: logoIn,
                transform: `scale(${interpolate(logoIn, [0, 1], [1.08, 1])}) translateY(${(1 - logoIn) * 40}px)`,
              }}
            />
          ) : (
            <RevealWord text={brand.studioName} delay={0} size={fitSize(brand.studioName, width, 220)} />
          )}
        </AbsoluteFill>
        <Wipe at={0} length={sec(0.33)} color={accentAt(0)} mode="out" />
      </Sequence>
      {/* Covers the montage just before the slogan; the panel then sweeps away inside the sequence above. */}
      <Sequence from={montageEnd - sec(0.33)} durationInFrames={sec(0.33)}>
        <Wipe at={0} length={sec(0.33)} color={accentAt(0)} mode="in" />
      </Sequence>

      <Wipe at={timing.intro - sec(0.4)} length={sec(0.4)} color={accentAt(1)} mode="in" />
    </AbsoluteFill>
  );
};
