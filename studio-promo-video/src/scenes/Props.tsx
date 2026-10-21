import React, { useId } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Source } from "../components";
import { Shot, brand, sec, shotDuration, shotSrc } from "../config";

// Illustrated "props" that show a service's works whole, drawn like the illustrations: thick ink outlines,
// flat colors and a hard offset shadow.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const ink = brand.colors.ink;

const startsOf = (media: Shot[]) => media.map((_, i) => media.slice(0, i).reduce((sum, s) => sum + shotDuration(s), 0));

// A wall, and optionally a floor line at `floorY` (px from the top).
export const Room: React.FC<{ wall: string; floorY?: number; line: number }> = ({ wall, floorY, line }) => (
  <AbsoluteFill style={{ background: wall }}>
    {floorY !== undefined ? (
      <div
        style={{
          position: "absolute",
          top: floorY,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(${ink}33, ${ink}66)`,
          borderTop: `${line}px solid ${ink}`,
        }}
      />
    ) : null}
  </AbsoluteFill>
);

// Branding: each work is a taped polaroid that drops onto a growing pile.
export const PolaroidPile: React.FC<{ media: Shot[]; wall: string; tape: string }> = ({ media, wall, tape }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const starts = startsOf(media);
  const line = width * 0.012;
  const side = Math.min(width * 0.82, height * 0.48);
  const border = side * 0.05;
  const tilts = [-6, 5, -3, 7, -5, 4];
  const current = starts.filter((s) => s <= frame).length - 1;

  return (
    <AbsoluteFill>
      <Room wall={wall} line={line} />
      <AbsoluteFill style={{ alignItems: "center" }}>
        {media.map((shot, i) => {
          // Only the newest few stay on the pile.
          if (i > current || i < current - 2) return null;
          const drop = spring({ frame: frame - starts[i], fps, config: { damping: 14, stiffness: 220 } });
          const tilt = tilts[i % tilts.length];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: height * 0.1,
                width: side + border * 2,
                padding: `${border}px ${border}px ${border * 3.2}px`,
                background: brand.colors.paper,
                border: `${line}px solid ${ink}`,
                boxShadow: `${line * 1.6}px ${line * 2}px 0 ${ink}`,
                transform: `translateY(${(1 - drop) * -height * 0.7}px) rotate(${tilt * drop + (1 - drop) * tilt * 3}deg)`,
              }}
            >
              {/* The work fills the whole photo. */}
              <div style={{ width: side, height: side, overflow: "hidden", border: `${line * 0.6}px solid ${ink}` }}>
                <Source src={shotSrc(shot)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Tape */}
              <div
                style={{
                  position: "absolute",
                  top: -side * 0.05,
                  left: "50%",
                  width: side * 0.34,
                  height: side * 0.1,
                  marginLeft: -side * 0.17,
                  background: tape,
                  opacity: 0.85,
                  border: `${line * 0.5}px solid ${ink}`,
                  transform: `rotate(${-tilt * 0.8}deg)`,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Websites: screen recordings play inside an illustrated phone; each new site slides up into view.
export const PhoneShowcase: React.FC<{ media: Shot[]; wall: string; body: string }> = ({ media, wall, body }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const starts = startsOf(media);
  const line = width * 0.012;
  const screenH = height * 0.56;
  const screenW = (screenH * 9) / 16;
  const bezel = screenW * 0.05;
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const bob = Math.sin((frame / fps) * 1.6) * height * 0.004;

  return (
    <AbsoluteFill>
      <Room wall={wall} line={line} />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: height * 0.06,
            padding: `${bezel * 2.4}px ${bezel}px ${bezel * 2.8}px`,
            background: body,
            border: `${line}px solid ${ink}`,
            borderRadius: screenW * 0.13,
            boxShadow: `${line * 2}px ${line * 2.4}px 0 ${ink}`,
            transform: `translateY(${(1 - enter) * height * 0.8 + bob}px) rotate(${-4 + (1 - enter) * 10}deg)`,
          }}
        >
          {/* Speaker slot */}
          <div
            style={{
              position: "absolute",
              top: bezel * 0.9,
              left: "50%",
              width: screenW * 0.22,
              height: line,
              marginLeft: -screenW * 0.11,
              background: ink,
              borderRadius: line,
            }}
          />
          <div
            style={{
              position: "relative",
              width: screenW,
              height: screenH,
              borderRadius: screenW * 0.06,
              border: `${line * 0.8}px solid ${ink}`,
              overflow: "hidden",
              background: "#0B0B12",
            }}
          >
            {media.map((shot, i) => {
              const slide = i === 0 ? 1 : interpolate(frame - starts[i], [0, sec(0.45)], [0, 1], { ...clamp, easing: easeOut });
              return (
                <Sequence key={i} from={starts[i]} durationInFrames={shotDuration(shot) + (i < media.length - 1 ? 0 : 0)}>
                  <AbsoluteFill style={{ transform: `translateY(${(1 - slide) * 100}%)` }}>
                    <Source src={shotSrc(shot)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </AbsoluteFill>
                </Sequence>
              );
            })}
            {/* Glass glare */}
            <AbsoluteFill
              style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%)" }}
            />
          </div>
          {/* Home button */}
          <div
            style={{
              position: "absolute",
              bottom: bezel * 0.8,
              left: "50%",
              width: bezel * 1.6,
              height: bezel * 1.6,
              marginLeft: -bezel * 0.8,
              borderRadius: "50%",
              border: `${line * 0.8}px solid ${ink}`,
              boxSizing: "border-box",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Illustration: works on a canvas on a wooden easel, each one painted in with wide strokes, row by row.
export const EaselShowcase: React.FC<{ media: Shot[]; wall: string; wood: string }> = ({ media, wall, wood }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const starts = startsOf(media);
  const line = width * 0.012;
  const side = Math.min(width * 0.8, height * 0.45);
  const top = height * 0.09;
  const legLen = height * 0.3;
  const floorY = top + side + legLen * 0.62;
  const current = Math.max(0, starts.filter((s) => s <= frame).length - 1);
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  // The first painting waits for the easel to land.
  const paintStart = (i: number) => (i === 0 ? sec(0.35) : starts[i]);
  const paintLength = sec(1.2);
  const paintP = (i: number) =>
    interpolate(frame - paintStart(i), [0, paintLength], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) });
  const p = paintP(current);
  const stroke = makeStroke(side);
  // The canvas nudges a little while it is being painted.
  const wobble = p > 0 && p < 1 ? Math.sin(frame * 0.9) * 0.4 : 0;
  const woodStyle: React.CSSProperties = {
    position: "absolute",
    width: line * 3.2,
    background: wood,
    border: `${line * 0.6}px solid ${ink}`,
    borderRadius: line,
    transformOrigin: "top center",
  };

  return (
    <AbsoluteFill>
      <Room wall={wall} floorY={floorY} line={line} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          transform: `translateY(${(1 - enter) * -height * 0.7}px) scaleY(${1 + (1 - enter) * 0.05})`,
          transformOrigin: "bottom center",
        }}
      >
        <div style={{ position: "absolute", top, width: side, height: side + legLen }}>
          {/* Legs: two in front, one behind, and the top post. */}
          <div style={{ ...woodStyle, left: side * 0.5 - line * 1.6, top: -side * 0.08, height: side * 0.2 }} />
          <div style={{ ...woodStyle, left: side * 0.22, top: side * 0.1, height: side * 0.9 + legLen, transform: "rotate(9deg)" }} />
          <div style={{ ...woodStyle, left: side * 0.74, top: side * 0.1, height: side * 0.9 + legLen, transform: "rotate(-9deg)" }} />
          <div style={{ ...woodStyle, left: side * 0.49, top: side * 0.4, height: side * 0.6 + legLen * 0.8, opacity: 0.85 }} />
          <div
            style={{
              position: "absolute",
              left: -side * 0.06,
              top: side * 1.02,
              width: side * 1.12,
              height: line * 3,
              background: wood,
              border: `${line * 0.6}px solid ${ink}`,
              borderRadius: line,
            }}
          />
          {/* Canvas */}
          <div
            style={{
              position: "absolute",
              top: 0,
              width: side,
              height: side,
              background: brand.colors.paper,
              border: `${line}px solid ${ink}`,
              boxShadow: `${line * 1.6}px ${line * 2}px 0 ${ink}`,
              overflow: "hidden",
              transform: `rotate(${wobble}deg)`,
            }}
          >
            {media.map((shot, i) => {
              if (i > current || i < current - 1) return null;
              return <PaintedImage key={i} src={shotSrc(shot)} side={side} stroke={stroke} p={i === current ? p : 1} />;
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The painting path: wide strokes back and forth across the canvas, top to bottom, starting at the right.
const makeStroke = (side: number) => {
  const rows = [0.12, 0.37, 0.63, 0.88].map((r) => r * side);
  const right = side * 1.08;
  const left = -side * 0.08;
  const points = rows.flatMap((y, i) => (i % 2 === 0 ? [{ x: right, y }, { x: left, y }] : [{ x: left, y }, { x: right, y }]));
  const lengths = points.slice(1).map((pt, i) => Math.hypot(pt.x - points[i].x, pt.y - points[i].y));
  const length = lengths.reduce((a, b) => a + b, 0);
  const at = (d: number) => {
    let rest = Math.max(0, Math.min(length, d));
    for (let i = 0; i < lengths.length; i++) {
      if (rest <= lengths[i] || i === lengths.length - 1) {
        const t = lengths[i] === 0 ? 0 : rest / lengths[i];
        return { x: points[i].x + (points[i + 1].x - points[i].x) * t, y: points[i].y + (points[i + 1].y - points[i].y) * t };
      }
      rest -= lengths[i];
    }
    return points[points.length - 1];
  };
  const d = points.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
  return { d, length, at, width: side * 0.3 };
};

// An image revealed through a mask of the brush strokes painted so far.
const PaintedImage: React.FC<{ src: string; side: number; stroke: ReturnType<typeof makeStroke>; p: number }> = ({
  src,
  side,
  stroke,
  p,
}) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={side} height={side} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <mask id={`paint-${id}`}>
          <path
            d={stroke.d}
            fill="none"
            stroke="#fff"
            strokeWidth={stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={stroke.length}
            strokeDashoffset={stroke.length * (1 - p)}
          />
        </mask>
      </defs>
      <image href={staticFile(src)} width={side} height={side} preserveAspectRatio="xMidYMid slice" mask={`url(#paint-${id})`} />
    </svg>
  );
};
