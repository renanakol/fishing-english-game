import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, sec } from "./config";

// Fonts are bundled in public/fonts so rendering works offline.
export const fontFamily = "Heebo"; // Hebrew + Latin, variable weight: small UI text
export const titleFont = "buDrakonit"; // the studio's headline font: big titles
export const handFont = "Lia Michal-Kasov"; // the studio's handwritten font: supporting lines
const fontFaces: { family: string; file: string; weight: string; range?: string }[] = [
  { family: fontFamily, file: "fonts/heebo-hebrew.woff2", weight: "100 900", range: "U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F" },
  { family: fontFamily, file: "fonts/heebo-latin.woff2", weight: "100 900", range: "U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+20AC, U+2122" },
  { family: titleFont, file: "fonts/budrakonit-bold.otf", weight: "700" },
  { family: handFont, file: "fonts/liamichal-kasov.ttf", weight: "400" },
];
const fontHandle = delayRender("Loading fonts");
Promise.all(
  fontFaces.map(async ({ family, file, weight, range }) => {
    const face = new FontFace(family, `url(${staticFile(file)})`, { weight, ...(range ? { unicodeRange: range } : {}) });
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
const isScroll = (src: string) => /-scroll\.(png|jpe?g)$/i.test(src);
// Logos (*-logo.*) and landscape footage (*-wide.*) are always shown whole, never cropped.
const isLogo = (src: string) => /-logo\.(png|jpe?g|webp)$/i.test(src);
const isWide = (src: string) => /-wide\.(mp4|mov|webm|png|jpe?g)$/i.test(src);

export const Source: React.FC<{ src: string; style: React.CSSProperties }> = ({ src, style }) =>
  isVideo(src) ? <OffthreadVideo src={staticFile(src)} muted style={style} /> : <Img src={staticFile(src)} style={style} />;

// How a work sits in the frame:
// "fill" covers the whole frame (cropping the edges); "fit" shows it whole and as large as possible above the
// titles; "card" shows it whole as a square card near the top. Left unset, logos and *-wide files fit and
// everything else fills.
export type Display = "fill" | "fit" | "card" | "tv" | "phone" | "easel" | "polaroid";

export const Media: React.FC<{ src: string; duration: number; dim?: number; display?: Display; focus?: string }> = ({
  src,
  duration,
  dim = 0,
  display,
  focus = "50% 50%",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const shade = dim > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null;
  // Logos sit on their own background color (their top-left pixel, stretched); everything else on a blurred copy.
  const backdrop = (
    <Source
      src={src}
      style={
        isLogo(src)
          ? { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "fill", transform: "scale(300)", transformOrigin: "0 0" }
          : { position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.6)", transform: "scale(1.2)" }
      }
    />
  );
  const enter = interpolate(frame, [0, sec(0.5)], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

  if (display === "card") {
    const zoom = interpolate(frame, [0, duration], [1, 1.04], clamp);
    const side = Math.min(width * 0.88, height * 0.6);
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: brand.colors.ink, alignItems: "center" }}>
        {backdrop}
        <div
          style={{
            position: "absolute",
            top: height * 0.09,
            width: side,
            height: side,
            borderRadius: side * 0.04,
            overflow: "hidden",
            boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
            opacity: enter,
            transform: `translateY(${(1 - enter) * 60}px) scale(${0.96 + 0.04 * enter})`,
          }}
        >
          <Source src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
        </div>
        {shade}
      </AbsoluteFill>
    );
  }

  if (display === "fit" || (display === undefined && (isLogo(src) || isWide(src)))) {
    const zoom = interpolate(frame, [0, duration], [1, 1.04], clamp);
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: brand.colors.ink }}>
        {backdrop}
        {/* The upper ~70% of the frame, clear of the titles at the bottom. */}
        <AbsoluteFill
          style={{ top: "4%", height: "68%", padding: `0 ${width * 0.03}px`, justifyContent: "center", alignItems: "center" }}
        >
          <Source
            src={src}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: isLogo(src) ? 0 : width * 0.02,
              boxShadow: isLogo(src) ? undefined : "0 30px 80px rgba(0,0,0,0.45)",
              opacity: enter,
              transform: `scale(${(0.96 + 0.04 * enter) * zoom})`,
            }}
          />
        </AbsoluteFill>
        {shade}
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
        {shade}
      </AbsoluteFill>
    );
  }

  const zoom = interpolate(frame, [0, duration], [1.08, 1], clamp);
  const drift = interpolate(frame, [0, duration], [-0.8, 0.8], clamp);
  return (
    <AbsoluteFill style={{ background: brand.colors.ink, overflow: "hidden" }}>
      <Source
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: focus,
          transform: `scale(${zoom}) translateX(${drift}%)`,
        }}
      />
      {shade}
    </AbsoluteFill>
  );
};

// Smooth "expo out" curve used by every text entrance: fast start, long gentle settle.
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const progress = (frame: number, at: number, length: number) =>
  interpolate(frame - at, [0, length], [0, 1], { ...clamp, easing: easeOut });

// A headline whose letters rise out of a mask one after another (right to left).
export const RevealWord: React.FC<{
  text: string;
  delay: number;
  size: number;
  color?: string;
  outline?: boolean;
  stagger?: number;
}> = ({ text, delay, size, color = brand.colors.paper, outline = false, stagger = sec(0.04) }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        direction: "rtl",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        // Room for descenders (ק ך ן ף ץ) inside the mask.
        padding: `${size * 0.05}px ${size * 0.05}px ${size * 0.2}px`,
        marginBottom: -size * 0.15,
        fontFamily: titleFont,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: -size * 0.02,
        whiteSpace: "pre",
      }}
    >
      {Array.from(text).map((ch, i) => {
        const p = progress(frame, delay + i * stagger, sec(0.53));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - p) * 120}%)`,
              color: outline ? "transparent" : color,
              WebkitTextStroke: outline ? `${Math.max(2, size * 0.02)}px ${color}` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// A supporting line that slides up from behind a mask, optionally on a highlight bar that draws in.
export const LineWord: React.FC<{
  text: string;
  delay: number;
  size: number;
  color?: string;
  background?: string;
}> = ({ text, delay, size, color = brand.colors.paper, background }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, sec(0.47));
  const box = progress(frame, delay - sec(0.1), sec(0.47));
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: `0 ${size * 0.22}px`, direction: "rtl" }}>
      {background ? (
        <div
          style={{
            position: "absolute",
            inset: `${size * 0.1}px 0`,
            background,
            transform: `scaleX(${box})`,
            transformOrigin: "right",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          fontFamily: handFont,
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1.1,
          color,
          whiteSpace: "pre",
          transform: `translateY(${(1 - p) * 110}%)`,
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
  const t = interpolate(frame - at, [0, length], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
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

// Rounded "pill" button with an arrow bubble, like a website CTA.
export const PillButton: React.FC<{ text: string; size: number; background: string; color: string }> = ({
  text,
  size,
  background,
  color,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: size * 0.6,
      background,
      color,
      fontFamily,
      fontWeight: 700,
      fontSize: size,
      padding: `${size * 0.35}px ${size * 0.4}px ${size * 0.35}px ${size * 0.9}px`,
      borderRadius: 999,
      direction: "ltr",
    }}
  >
    <div
      style={{
        width: size * 1.5,
        height: size * 1.5,
        borderRadius: "50%",
        background: color,
        color: background,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: size * 0.9,
      }}
    >
      ←
    </div>
    {text}
  </div>
);
