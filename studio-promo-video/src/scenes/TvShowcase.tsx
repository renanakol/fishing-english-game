import React, { useId } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Source } from "../components";
import { Shot, brand, sec, shotDuration, shotSrc } from "../config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// An illustrated retro TV that plays every shot whole inside its screen, flipping "channels" between them.
export const TvShowcase: React.FC<{ media: Shot[]; color: string; knobColor: string; wall: string }> = ({
  media,
  color,
  knobColor,
  wall,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const starts = media.map((_, i) => media.slice(0, i).reduce((sum, s) => sum + shotDuration(s), 0));
  const channel = starts.filter((s) => s <= frame).length - 1;

  // Proportions, all from the body width.
  const W = Math.min(width * 0.96, height * 0.8);
  const line = W * 0.014; // outline thickness, like the illustrations' ink lines
  const pad = W * 0.05;
  const screenW = W * 0.76;
  const screenH = (screenW * 9) / 16;
  const bodyH = screenH + pad * 2;
  const antennaH = W * 0.2;
  const legH = W * 0.06;

  // Drops in with a little bounce, then the screen powers on.
  const drop = spring({ frame, fps, config: { damping: 11, stiffness: 120 } });
  const powerOn = interpolate(frame, [sec(0.35), sec(0.75)], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  // Knob clicks round one notch per channel.
  const lastSwitch = starts[Math.max(0, channel)];
  const knobTurn = channel * 45 + interpolate(frame - lastSwitch, [0, sec(0.2)], [-45, 0], clamp) * (channel > 0 ? 1 : 0);

  const ink = brand.colors.ink;
  const outline = `${line}px solid ${ink}`;

  return (
    <AbsoluteFill style={{ alignItems: "center", background: wall }}>
      {/* Floor the TV stands on. */}
      <div
        style={{
          position: "absolute",
          top: height * 0.15 + antennaH + bodyH + legH * 0.8,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(${brand.colors.ink}33, ${brand.colors.ink}66)`,
          borderTop: `${line}px solid ${brand.colors.ink}`,
        }}
      />
      {/* Soft glow of the screen on the wall behind. */}
      <div
        style={{
          position: "absolute",
          top: height * 0.15,
          width: W * 1.4,
          height: W * 1.1,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, #ffffff88, transparent)`,
          opacity: powerOn,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: height * 0.15,
          width: W,
          transform: `translateY(${(1 - drop) * -height * 0.6}px) rotate(${(1 - drop) * -6}deg)`,
        }}
      >
        {/* Antenna */}
        <div style={{ position: "relative", height: antennaH }}>
          {[-28, 24].map((angle) => (
            <div
              key={angle}
              style={{
                position: "absolute",
                left: W / 2 - line / 2,
                bottom: 0,
                width: line,
                height: antennaH * 1.05,
                background: ink,
                transformOrigin: "bottom center",
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -line * 2.2,
                  left: -line * 1.6,
                  width: line * 4.2,
                  height: line * 4.2,
                  borderRadius: "50%",
                  background: knobColor,
                  border: outline,
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: W / 2 - W * 0.07,
              bottom: -line,
              width: W * 0.14,
              height: W * 0.05,
              borderRadius: `${W * 0.07}px ${W * 0.07}px 0 0`,
              background: color,
              border: outline,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Body */}
        <div
          style={{
            position: "relative",
            height: bodyH,
            background: color,
            border: outline,
            borderRadius: W * 0.06,
            boxSizing: "border-box",
            boxShadow: `${W * 0.02}px ${W * 0.025}px 0 ${ink}`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${pad - line}px`,
            gap: pad * 0.8,
          }}
        >
          <Screen
            width={screenW}
            height={screenH}
            line={line}
            media={media}
            starts={starts}
            powerOn={powerOn}
          />

          {/* Control panel: two knobs and a speaker grille. */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: W * 0.03 }}>
            {[knobTurn, -knobTurn * 0.5].map((turn, i) => (
              <div
                key={i}
                style={{
                  width: W * 0.11,
                  height: W * 0.11,
                  borderRadius: "50%",
                  background: i === 0 ? knobColor : brand.colors.paper,
                  border: outline,
                  boxSizing: "border-box",
                  transform: `rotate(${turn}deg)`,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: line, height: "45%", background: ink, borderRadius: line }} />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: line * 1.2, marginTop: W * 0.01 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: W * 0.12, height: line, background: ink, borderRadius: line }} />
              ))}
            </div>
          </div>
        </div>

        {/* Legs */}
        <div style={{ position: "relative", height: legH }}>
          {[0.18, 0.82].map((x, i) => (
            <div
              key={x}
              style={{
                position: "absolute",
                left: W * x - line * 1.5,
                top: -line,
                width: line * 3,
                height: legH,
                background: ink,
                borderRadius: line,
                transformOrigin: "top center",
                transform: `rotate(${i === 0 ? 14 : -14}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The picture tube: each shot whole, a static burst at every cut, glass glare and scanlines.
const Screen: React.FC<{
  width: number;
  height: number;
  line: number;
  media: Shot[];
  starts: number[];
  powerOn: number;
}> = ({ width, height, line, media, starts, powerOn }) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const sinceCut = frame - starts.filter((s) => s <= frame).slice(-1)[0];
  const isFirst = starts.filter((s) => s <= frame).length === 1;
  const staticAmount = isFirst ? 0 : interpolate(sinceCut, [0, sec(0.18)], [1, 0], clamp);
  // CRT power-on: a bright line opens up into the picture.
  const openY = interpolate(powerOn, [0, 0.5, 1], [0.01, 0.02, 1]);
  const openX = interpolate(powerOn, [0, 0.5], [0, 1], clamp);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        flexShrink: 0,
        borderRadius: width * 0.05,
        border: `${line}px solid ${brand.colors.ink}`,
        background: "#0B0B12",
        overflow: "hidden",
        boxSizing: "content-box",
      }}
    >
      <div style={{ position: "absolute", inset: 0, transform: `scale(${openX}, ${openY})` }}>
        {media.map((shot, i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={shotDuration(shot)}>
            <AbsoluteFill>
              {/* Shots that are not 16:9 sit on a blurred copy of themselves instead of black bars. */}
              <Source
                src={shotSrc(shot)}
                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(24px) brightness(0.75)", transform: "scale(1.15)" }}
              />
              <Source src={shotSrc(shot)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
            </AbsoluteFill>
          </Sequence>
        ))}
        {/* Flash of white while the tube warms up. */}
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(powerOn, [0.4, 1], [1, 0], clamp) }} />
      </div>

      {/* Channel-flip static. */}
      {staticAmount > 0 ? (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: staticAmount }}>
          <filter id={`noise-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#noise-${id})`} />
        </svg>
      ) : null}

      {/* Scanlines and curved-glass glare. */}
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 5px)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45))",
        }}
      />
    </div>
  );
};
