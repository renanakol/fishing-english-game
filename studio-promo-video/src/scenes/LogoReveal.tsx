import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, sec } from "../config";
import { logoPaths, logoSize } from "../logoPaths";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

// Each ink's outline is drawn on stroke by stroke, then its color fills in. The figure (navy) draws first,
// the "סטודיו לעיצוב גרפי" text (red) follows.
const inks = [
  { paths: logoPaths.navy, color: brand.colors.ink, start: 0, draw: 1.3 },
  { paths: logoPaths.red, color: brand.colors.accents[0], start: 0.9, draw: 0.9 },
];

export const LogoReveal: React.FC<{ width: number; delay?: number }> = ({ width, delay = 0 }) => {
  const frame = useCurrentFrame() - delay;
  return (
    <svg viewBox={`0 0 ${logoSize.width} ${logoSize.height}`} width={width} height={(width * logoSize.height) / logoSize.width}>
      {inks.map(({ paths, color, start, draw }) => {
        // Stroke each contour separately so they can be staggered; fill the whole compound path so holes stay holes.
        const contours = paths.flatMap((d) => d.split(/(?=M )/));
        const fill = interpolate(frame, [sec(start + draw * 0.8), sec(start + draw + 0.3)], [0, 1], clamp);
        return (
          <g key={color}>
            {paths.map((d, i) => (
              <path key={`fill-${i}`} d={d} fill={color} fillOpacity={fill} />
            ))}
            {contours.map((d, i) => {
              // Contours start one after another across the first 60% of the draw time.
              const at = sec(start) + (sec(draw) * 0.6 * i) / Math.max(1, contours.length - 1);
              const p = interpolate(frame, [at, at + sec(draw * 0.4)], [0, 1], { ...clamp, easing: ease });
              return (
                <path
                  key={`line-${i}`}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  opacity={p > 0 ? 1 - fill * 0.6 : 0}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};
