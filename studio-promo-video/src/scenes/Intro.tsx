import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash, Media, SlamWord, Wipe, accentAt, fitSize, useShake } from "../components";
import { BEAT, allMedia, brand, intro, timing } from "../config";

// Rapid montage of every work under words that slam in on the beat, then the studio name.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const montageEnd = intro.words.length * BEAT;
  const cut = 4; // frames per montage shot
  const shots = Math.ceil(montageEnd / cut);
  const wordIndex = Math.min(intro.words.length - 1, Math.floor(frame / BEAT));
  const shake = useShake(wordIndex * BEAT, 18);
  const nameIn = spring({ frame: frame - montageEnd, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: brand.colors.ink }}>
      {Array.from({ length: shots }, (_, i) => (
        <Sequence key={i} from={i * cut} durationInFrames={cut}>
          <Media src={allMedia[i % allMedia.length]} duration={cut} dim={0.45} />
        </Sequence>
      ))}

      {frame < montageEnd ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: shake }}>
          <SlamWord
            key={wordIndex}
            text={intro.words[wordIndex]}
            delay={wordIndex * BEAT}
            size={fitSize(intro.words[wordIndex], width, 330)}
            outline={wordIndex % 2 === 1}
          />
        </AbsoluteFill>
      ) : null}

      <Sequence from={montageEnd}>
        <AbsoluteFill style={{ background: brand.colors.ink, justifyContent: "center", alignItems: "center" }}>
          {brand.slogan ? (
            <Img
              src={staticFile(brand.slogan)}
              style={{
                width: width * 0.88,
                transform: `scale(${interpolate(nameIn, [0, 1], [1.8, 1])}) rotate(${(1 - nameIn) * -8}deg)`,
                opacity: Math.min(1, nameIn * 2),
              }}
            />
          ) : (
            <SlamWord text={brand.studioName} delay={0} size={fitSize(brand.studioName, width, 220)} />
          )}
        </AbsoluteFill>
        <Flash at={0} strength={0.9} />
      </Sequence>

      <Wipe at={timing.intro - 8} length={8} color={accentAt(1)} mode="in" />
    </AbsoluteFill>
  );
};
