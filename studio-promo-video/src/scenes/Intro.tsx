import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LineWord, Wipe, accentAt } from "../components";
import { Icon, IconName } from "./Icons";
import { BEAT, brand, intro, sec, timing } from "../config";

// Opening screen: the slogan settles in, then each service pops in on the beat with a round illustrated icon.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const unit = Math.min(width, height);
  const sloganIn = spring({ frame: frame - sec(0.1), fps, config: { damping: 200 } });
  const firstRow = 2 * BEAT;

  return (
    <AbsoluteFill
      style={{ background: brand.colors.ink, alignItems: "center", justifyContent: "center", gap: height * 0.05 }}
    >
      {brand.slogan ? (
        <Img
          src={staticFile(brand.slogan)}
          style={{
            width: width * 0.86,
            opacity: sloganIn,
            transform: `scale(${interpolate(sloganIn, [0, 1], [1.08, 1])}) translateY(${(1 - sloganIn) * 40}px)`,
          }}
        />
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: unit * 0.045, direction: "rtl" }}>
        {intro.services.map((s, i) => (
          <ServiceRow
            key={s.label}
            label={s.label}
            icon={s.icon}
            color={accentAt(i)}
            delay={firstRow + i * BEAT}
            size={unit * 0.17}
          />
        ))}
      </div>

      <Wipe at={timing.intro - sec(0.4)} length={sec(0.4)} color={accentAt(1)} mode="in" />
    </AbsoluteFill>
  );
};

// A round icon badge that pops in with a ring pulse, and the service name rising beside it.
const ServiceRow: React.FC<{ label: string; icon: IconName; color: string; delay: number; size: number }> = ({
  label,
  icon,
  color,
  delay,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 140 } });
  const pulse = interpolate(frame - delay, [sec(0.1), sec(0.7)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3, direction: "rtl" }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `${size * 0.04}px solid ${color}`,
            transform: `scale(${1 + pulse * 0.6})`,
            opacity: pulse > 0 ? 1 - pulse : 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            border: `${size * 0.045}px solid ${color}`,
            transform: `scale(${pop}) rotate(${(1 - pop) * -40}deg)`,
          }}
        >
          <div style={{ width: "100%", height: "100%", background: brand.colors.paper, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Icon name={icon} size={size * 0.72} />
          </div>
        </div>
      </div>
      <LineWord text={label} delay={delay + sec(0.12)} size={size * 0.46} color={brand.colors.paper} />
    </div>
  );
};
