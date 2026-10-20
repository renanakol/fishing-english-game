import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RevealWord, Wipe, accentAt, fitSize, fontFamily } from "../components";
import { BEAT, brand, compare, sec } from "../config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const at = (frame: number, start: number, length: number) =>
  interpolate(frame - start, [0, length], [0, 1], { ...clamp, easing: ease });

// A settings-style card: flip the toggle from "without" to "with", and every generic line gets replaced.
export const CompareScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const edge = brand.colors.paper;
  const highlight = accentAt(0);
  const cardIn = at(frame, sec(0.2), sec(0.7));
  const flipAt = 3 * BEAT;
  const flip = at(frame, flipAt, sec(0.4));
  const text = unit * 0.05;

  return (
    <AbsoluteFill
      style={{ background: brand.colors.ink, justifyContent: "center", alignItems: "center", gap: unit * 0.07 }}
    >
      <RevealWord text="מה משתנה?" delay={sec(0.1)} size={fitSize("מה משתנה?", width, unit * 0.13)} />
      <div
        style={{
          width: Math.min(width * 0.86, unit * 0.9),
          background: brand.colors.paper,
          borderRadius: unit * 0.05,
          padding: `${unit * 0.05}px ${unit * 0.06}px`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          direction: "rtl",
          fontFamily,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 120}px)`,
        }}
      >
        {/* Header: בלי ── toggle ── עם רני סטודיו */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: text,
            fontWeight: 800,
            color: brand.colors.ink,
            paddingBottom: unit * 0.035,
            borderBottom: "2px solid #E6E8EE",
          }}
        >
          <span style={{ opacity: 1 - flip * 0.6 }}>{compare.off}</span>
          <div
            style={{
              width: text * 2.2,
              height: text * 1.2,
              borderRadius: 999,
              background: interpolate(flip, [0, 1], [0, 1]) > 0.5 ? highlight : "#C9CDD6",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: text * 0.12,
                // RTL: the knob starts on the "without" (right) side and slides to "with" (left).
                right: interpolate(flip, [0, 1], [text * 0.12, text * 1.12]),
                width: text * 0.96,
                height: text * 0.96,
                borderRadius: "50%",
                background: brand.colors.paper,
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}
            />
          </div>
          <span style={{ opacity: 0.4 + flip * 0.6, color: flip > 0.5 ? highlight : brand.colors.ink }}>{compare.on}</span>
        </div>

        {compare.rows.map((row, i) => {
          const rowIn = at(frame, sec(0.5) + i * sec(0.15), sec(0.5));
          const strike = at(frame, flipAt + sec(0.25) + i * sec(0.2), sec(0.35));
          const swap = at(frame, flipAt + sec(0.5) + i * sec(0.2), sec(0.5));
          return (
            <div
              key={row.before}
              style={{
                padding: `${unit * 0.03}px 0`,
                borderBottom: i < compare.rows.length - 1 ? "2px solid #EEF0F4" : undefined,
                opacity: rowIn,
                transform: `translateY(${(1 - rowIn) * 30}px)`,
              }}
            >
              <div style={{ position: "relative", display: "inline-block", fontSize: text * 0.8, color: "#8A90A0" }}>
                {row.before}
                <div
                  style={{
                    position: "absolute",
                    top: "55%",
                    right: 0,
                    height: Math.max(3, text * 0.07),
                    width: `${strike * 100}%`,
                    background: highlight,
                  }}
                />
              </div>
              <div style={{ overflow: "hidden", height: text * 1.35 * swap }}>
                <div
                  style={{
                    fontSize: text * 1.05,
                    fontWeight: 800,
                    color: brand.colors.ink,
                    transform: `translateY(${(1 - swap) * 100}%)`,
                  }}
                >
                  {row.after}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Wipe at={0} length={sec(0.4)} color={edge} mode="out" />
      <Wipe at={duration - sec(0.4)} length={sec(0.4)} color={edge} mode="in" />
    </AbsoluteFill>
  );
};
