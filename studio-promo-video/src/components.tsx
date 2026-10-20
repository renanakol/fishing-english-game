import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./config";

// Heebo (variable weight) is bundled in public/fonts so rendering works offline.
export const fontFamily = "Heebo";
const fontFaces = [
  { file: "fonts/heebo-hebrew.woff2", range: "U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F" },
  { file: "fonts/heebo-latin.woff2", range: "U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+20AC, U+2122" },
];
const fontHandle = delayRender("Loading Heebo");
Promise.all(
  fontFaces.map(async ({ file, range }) => {
    const face = new FontFace(fontFamily, `url(${staticFile(file)}) format("woff2")`, {
      weight: "100 900",
      unicodeRange: range,
    });
    document.fonts.add(await face.load());
  }),
)
  .then(() => continueRender(fontHandle))
  .catch((err) => {
    console.error(err);
    continueRender(fontHandle);
  });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const accentAt = (i: number) => brand.colors.accents[i % brand.colors.accents.length];

// Font size that makes `text` fill `share` of the frame width, capped at `max`.
export const fitSize = (text: string, width: number, max: number, share = 0.9) =>
  Math.min(max, (width * share) / (Array.from(text).length * 0.6));

const isVideo = (src: string) => /\.(mp4|mov|webm)$/i.test(src);
// Full-page website captures (see scripts/record-site.mjs) are named *-scroll.png and scroll top to bottom.
// Logo files (*-logo.*) are shown whole instead of cropped to fill the frame.
const isLogo = (src: string) => /-logo\.(png|jpe?g|webp)$/i.test(src);
const isScroll = (src: string) => /-scroll\.(png|jpe?g)$/i.test(src);

// A work filling the whole frame, slowly pushing in.
export const Media: React.FC<{ src: string; duration: number; dim?: number }> = ({ src, duration, dim = 0 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  if (isLogo(src)) {
    // Logos must never be cropped: show the whole image, backed by a blurred copy of itself.
    const zoom = interpolate(frame, [0, duration], [1.08, 0.98], clamp);
    return (
      <AbsoluteFill style={{ overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)", transform: "scale(1.3)" }} />
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain", transform: `scale(${zoom})` }} />
        {dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
      </AbsoluteFill>
    );
  }
  if (isScroll(src)) {
    const p = interpolate(frame, [0, duration], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
    return (
      <AbsoluteFill style={{ background: brand.colors.paper, overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{ position: "absolute", top: 0, width: "100%", transform: `translateY(calc(${-p * 100}% + ${p * height}px))` }}
        />
        {dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
      </AbsoluteFill>
    );
  }
  const zoom = interpolate(frame, [0, duration], [1.18, 1.02], clamp);
  const drift = interpolate(frame, [0, duration], [-1.5, 1.5], clamp);
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${zoom}) translateX(${drift}%)`,
  };
  return (
    <AbsoluteFill style={{ background: brand.colors.ink, overflow: "hidden" }}>
      {isVideo(src) ? <OffthreadVideo src={staticFile(src)} muted style={style} /> : <Img src={staticFile(src)} style={style} />}
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

// White flash that decays over a few frames — punctuates hard cuts.
export const Flash: React.FC<{ at: number; strength?: number }> = ({ at, strength = 0.7 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - at, [0, 5], [strength, 0], clamp);
  return <AbsoluteFill style={{ background: "#fff", opacity, pointerEvents: "none" }} />;
};

// Decaying camera shake kicked off at frame `at`.
export const useShake = (at: number, amount: number) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 12) return "none";
  const decay = 1 - t / 12;
  return `translate(${Math.sin(t * 2.1) * amount * decay}px, ${Math.cos(t * 2.9) * amount * decay}px)`;
};

// A word whose letters slam in from huge and blurred, one after another (right to left).
export const SlamWord: React.FC<{
  text: string;
  delay: number;
  size: number;
  color?: string;
  outline?: boolean;
  stagger?: number;
}> = ({ text, delay, size, color = brand.colors.paper, outline = false, stagger = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        direction: "rtl",
        display: "flex",
        justifyContent: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: -size * 0.02,
        whiteSpace: "pre",
      }}
    >
      {Array.from(text).map((ch, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 14, stiffness: 220 } });
        const appear = interpolate(frame - delay - i * stagger, [0, 3], [0, 1], clamp);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: appear,
              transform: `scale(${interpolate(p, [0, 1], [2.6, 1])}) translateY(${(1 - p) * -30}%)`,
              filter: `blur(${Math.max(0, (1 - appear) * 12)}px)`,
              color: outline ? "transparent" : color,
              WebkitTextStroke: outline ? `${Math.max(2, size * 0.025)}px ${color}` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// A word that shoots up from behind a mask.
export const RiseWord: React.FC<{
  text: string;
  delay: number;
  size: number;
  color?: string;
  background?: string;
}> = ({ text, delay, size, color = brand.colors.paper, background }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 180 } });
  const box = spring({ frame: frame - delay + 2, fps, config: { damping: 200 } });
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: `0 ${size * 0.18}px`, direction: "rtl" }}>
      {background ? (
        <div
          style={{
            position: "absolute",
            inset: `${size * 0.08}px 0`,
            background,
            transform: `scaleX(${box})`,
            transformOrigin: "right",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          fontFamily,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.05,
          color,
          whiteSpace: "pre",
          transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * -6}deg)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Full-screen color panel that sweeps across: `mode="in"` covers the frame, `"out"` uncovers it.
export const Wipe: React.FC<{ at: number; length: number; color: string; mode: "in" | "out" }> = ({
  at,
  length,
  color,
  mode,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - at, [0, length], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  // Panel travels right-to-left, matching Hebrew reading direction.
  const left = mode === "in" ? 100 - t * 100 : 0;
  const right = mode === "in" ? 0 : t * 100;
  if ((mode === "in" && t === 0) || (mode === "out" && t === 1)) return null;
  return (
    <AbsoluteFill
      style={{ background: color, clipPath: `polygon(${left}% 0, ${100 - right}% 0, ${100 - right}% 100%, ${left}% 100%)` }}
    />
  );
};
