import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { sec } from "../config";
import { logoParts, logoViewBox } from "../logoParts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoots a little, then settles
const smooth = Easing.bezier(0.16, 1, 0.3, 1);

const lines = logoParts.filter((p) => p.kind === "line");
const thread = logoParts.filter((p) => p.kind === "thread");
const dots = logoParts.filter((p) => p.kind === "dots");
// The "סטודיו לעיצוב גרפי" letters, right to left.
const text = logoParts.filter((p) => p.kind === "text").sort((a, b) => b.box[0] - a.box[0]);

// The logo builds itself from its vector shapes: the figure pops in piece by piece, the red thread runs down,
// the dots bounce in, then the tagline's letters rise one after another.
export const LogoBuild: React.FC<{ width: number; delay?: number }> = ({ width, delay = 0 }) => {
  const frame = useCurrentFrame() - delay;
  const [x, y, w, h] = logoViewBox;
  const appear = (at: number, length: number, easing = pop) =>
    interpolate(frame, [at, at + length], [0, 1], { ...clamp, easing });
  const threadTop = Math.min(...thread.map((p) => p.box[1]));
  const threadBottom = Math.max(...thread.map((p) => p.box[3]));
  const threadP = appear(sec(0.55), sec(0.6), smooth);

  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} width={width} height={(width * h) / w} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="logo-thread">
          <rect x={x} y={threadTop} width={w} height={(threadBottom - threadTop) * threadP + 0.5} />
        </clipPath>
      </defs>
      {lines.map((p, i) => {
        const t = appear(sec(0.04 * i), sec(0.4));
        return <Part key={`l${i}`} d={p.d} color={p.color} rule={p.rule} opacity={Math.min(1, t * 2)} scale={0.6 + 0.4 * t} />;
      })}
      <g clipPath="url(#logo-thread)">
        {thread.map((p, i) => (
          <path key={`t${i}`} d={p.d} fill={p.color} fillRule={p.rule as "nonzero" | "evenodd"} />
        ))}
      </g>
      {dots.map((p, i) => {
        const t = appear(sec(0.9 + 0.08 * i), sec(0.35));
        return <Part key={`d${i}`} d={p.d} color={p.color} rule={p.rule} opacity={Math.min(1, t * 3)} scale={t} />;
      })}
      {text.map((p, i) => {
        const t = appear(sec(1.0 + 0.035 * i), sec(0.4), smooth);
        return (
          <Part key={`x${i}`} d={p.d} color={p.color} rule={p.rule} opacity={t} scale={1} shift={(1 - t) * (p.box[3] - p.box[1]) * 0.8} />
        );
      })}
    </svg>
  );
};

const Part: React.FC<{ d: string; color: string; rule: string; opacity: number; scale: number; shift?: number }> = ({
  d,
  color,
  rule,
  opacity,
  scale,
  shift = 0,
}) => (
  <path
    d={d}
    fill={color}
    fillRule={rule as "nonzero" | "evenodd"}
    opacity={opacity}
    style={{ transformBox: "fill-box", transformOrigin: "center", transform: `translateY(${shift}px) scale(${scale})` }}
  />
);
