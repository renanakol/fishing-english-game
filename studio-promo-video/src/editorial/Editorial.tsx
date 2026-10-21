import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Source, editorialFont, fontFamily, handFont } from "../components";
import { BEAT, Shot, brand, music, outro, sec, shotDuration, shotSrc } from "../config";
import { logoParts, logoViewBox } from "../logoParts";

// A grown-up cut of the promo: a fast hook, big gallery frames, clean bold type, hairlines and punch-in cuts
// on the beat. Same works, same 120 BPM grid.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// The studio's own colors (reni.co.il), used as solid blocks.
const [red, yellow, turquoise] = brand.colors.accents;
const black = "#0D0D10";
const palette = {
  cream: brand.colors.paper,
  charcoal: black,
  accent: red,
};

type Frame = { width: number; height: number };
type Chapter = {
  title: string;
  // Heavy line set above the big colored title.
  kicker: string;
  // Scene background, title color and text color.
  bg: string;
  titleColor: string;
  fg: string;
  // Shape of the gallery frame, as width / height.
  aspect: number;
  fit: "cover" | "contain";
  media: Shot[];
};

const chapters: Chapter[] = [
  {
    title: "מיתוג",
    kicker: "זהות שזוכרים של",
    bg: black,
    titleColor: yellow,
    fg: brand.colors.paper,
    aspect: 4 / 5,
    fit: "cover",
    media: [
      { src: "works/branding/smash-eat-bag.jpg", beats: 2 },
      { src: "works/branding/stargazing-logo.jpg", beats: 2 },
      { src: "works/branding/wine-and-beard.jpg", beats: 2 },
      { src: "works/branding/unity-logo.jpg", beats: 2 },
      { src: "works/branding/live-jar.jpg", beats: 2 },
      { src: "works/branding/live-logo.jpg", beats: 2 },
    ],
  },
  {
    title: "אתרים",
    kicker: "עיצוב ובנייה של",
    bg: black,
    titleColor: turquoise,
    fg: brand.colors.paper,
    aspect: 9 / 16,
    fit: "cover",
    media: [{ src: "works/web/agamon-hula-long.mp4", beats: 9 }],
  },
  {
    title: "איור",
    kicker: "עולמות שלמים ב",
    bg: black,
    titleColor: red,
    fg: brand.colors.paper,
    aspect: 1,
    fit: "cover",
    media: [
      { src: "works/illustration/beach-dancer.jpg", beats: 4 },
      { src: "works/illustration/swim-ring.jpg", beats: 4 },
      { src: "works/illustration/moon.jpg", beats: 4 },
    ],
  },
  {
    title: "וידאו",
    kicker: "אנימציה ותנועה ב",
    bg: black,
    titleColor: yellow,
    fg: brand.colors.paper,
    aspect: 16 / 9,
    fit: "contain",
    media: [
      { src: "works/video/boots-ad-1-wide.mp4", beats: 9 },
      { src: "works/video/princess-frog.mp4", beats: 5 },
      { src: "works/video/boots-ad-2-wide.mp4", beats: 4 },
    ],
  },
];

const studioPhotos = ["works/studio/studio.jpg", "works/studio/studio-boots.jpg", "works/studio/studio-owl.jpg"];

const editorialTiming = {
  opening: 11 * BEAT,
  closing: studioPhotos.length * 2 * BEAT,
  endCard: 8 * BEAT,
};
const chapterDuration = (c: Chapter) => c.media.reduce((sum, s) => sum + shotDuration(s), 0);

export const editorialDuration =
  editorialTiming.opening +
  chapters.reduce((sum, c) => sum + chapterDuration(c), 0) +
  editorialTiming.closing +
  editorialTiming.endCard;

export const Editorial: React.FC = () => {
  const starts = chapters.map(
    (_, i) => editorialTiming.opening + chapters.slice(0, i).reduce((sum, c) => sum + chapterDuration(c), 0),
  );
  const closingStart = editorialTiming.opening + chapters.reduce((sum, c) => sum + chapterDuration(c), 0);

  return (
    <AbsoluteFill style={{ background: black, fontFamily: `"${editorialFont}", ${fontFamily}` }}>
      <Sequence durationInFrames={editorialTiming.opening}>
        <Opening />
      </Sequence>
      {chapters.map((c, i) => (
        <Sequence key={c.title} from={starts[i]} durationInFrames={chapterDuration(c)}>
          <ChapterScene chapter={c} index={i} duration={chapterDuration(c)} />
        </Sequence>
      ))}
      <Sequence from={closingStart} durationInFrames={editorialTiming.closing}>
        <Closing />
      </Sequence>
      <Sequence from={closingStart + editorialTiming.closing} durationInFrames={editorialTiming.endCard}>
        <EndCard />
      </Sequence>
      {music ? <Audio src={staticFile(music)} /> : null}
    </AbsoluteFill>
  );
};

// ---------- building blocks ----------

const useIn = (at: number, length = sec(0.7)) => {
  const frame = useCurrentFrame();
  return interpolate(frame - at, [0, length], [0, 1], { ...clamp, easing: ease });
};

// Text that slides up out of a mask.
const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const p = useIn(at);
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 105}%)` }}>{children}</div>
    </div>
  );
};

// A stacked headline: heavy lines set tight, the last line huge in an accent color with a small sparkle beside it.
type HeadLine = { text: string; color: string };
// `bigScale` sets how much larger the last line is than the others.
const Headline: React.FC<{ lines: HeadLine[]; size: number; at: number; bigScale?: number; align?: "right" | "center" }> = ({
  lines,
  size,
  at,
  bigScale = 1.45,
  align = "right",
}) => {
  const frame = useCurrentFrame();
  const last = lines.length - 1;
  const spark = interpolate(frame - at - last * sec(0.12), [sec(0.2), sec(0.6)], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ direction: "rtl", textAlign: align, letterSpacing: -size * 0.02 }}>
      {lines.map((l, i) => {
        const big = i === last;
        return (
          <Rise key={i} at={at + i * sec(0.12)}>
            <div style={{ position: "relative", display: "inline-block", fontSize: big ? size * bigScale : size, fontWeight: big ? 900 : 700, lineHeight: 1.02, color: l.color }}>
              {l.text}
              {big ? (
                <span
                  style={{
                    position: "absolute",
                    top: -size * 0.05,
                    right: -size * 0.42,
                    fontSize: size * 0.4,
                    color: l.color,
                    opacity: spark,
                    transform: `scale(${spark}) rotate(${(1 - spark) * 90}deg)`,
                  }}
                >
                  ✦
                </span>
              ) : null}
            </div>
          </Rise>
        );
      })}
    </div>
  );
};

// Fades a whole scene out over its last few frames.
const SceneOut: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [duration - sec(0.25), duration], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: out }}>{children}</AbsoluteFill>;
};

// ---------- scenes ----------

// Opening: a headline, then one service per beat in big type over a full-bleed work, then the logo.
const hook = [
  { label: "מיתוג", src: "works/branding/smash-eat-bag.jpg" },
  { label: "אתרים", src: "works/web/agamon-hula-long.mp4" },
  { label: "איור", src: "works/illustration/beach-dancer.jpg" },
  { label: "וידאו", src: "works/video/boots-ad-1-wide.mp4" },
];

const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const headlineEnd = 3 * BEAT;
  const hookEnd = headlineEnd + hook.length * BEAT;
  const logo = useIn(hookEnd + sec(0.1), sec(0.8));

  return (
    <SceneOut duration={editorialTiming.opening}>
      <AbsoluteFill style={{ background: palette.charcoal }}>
        <Sequence durationInFrames={headlineEnd}>
          <AbsoluteFill style={{ justifyContent: "center", padding: `0 ${width * 0.08}px` }}>
            <Headline
              at={sec(0.1)}
              size={unit * 0.15}
              bigScale={1.7}
              lines={[
                { text: "עיצוב שמספר", color: palette.cream },
                { text: "את הסיפור", color: palette.cream },
                { text: "שלך", color: yellow },
              ]}
            />
          </AbsoluteFill>
        </Sequence>
        {hook.map((h, i) => (
          <Sequence key={h.label} from={headlineEnd + i * BEAT} durationInFrames={BEAT}>
            <PunchIn>
              <Source src={h.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </PunchIn>
            <AbsoluteFill style={{ background: "rgba(20,19,26,0.55)" }} />
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", direction: "rtl" }}>
              <Rise at={0}>
                <div style={{ fontSize: unit * 0.24, fontWeight: 900, letterSpacing: -unit * 0.006, color: [yellow, turquoise, red, yellow][i] }}>
                  {h.label}
                </div>
              </Rise>
            </AbsoluteFill>
          </Sequence>
        ))}
        {frame >= hookEnd ? (
          <AbsoluteFill style={{ background: black, alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: logo, transform: `scale(${1.08 - 0.08 * logo})` }}>
              <LogoOnDark width={unit * 0.66} />
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </SceneOut>
  );
};

// A quick zoom-in punch as a shot cuts in, then a slow settle.
const PunchIn: React.FC<{ children: React.ReactNode; length?: number }> = ({ children, length }) => {
  const frame = useCurrentFrame();
  const punch = interpolate(frame, [0, sec(0.3)], [1.18, 1.04], { ...clamp, easing: ease });
  const settle = length ? interpolate(frame, [sec(0.3), length], [0, 0.04], clamp) : 0;
  const blur = interpolate(frame, [0, sec(0.12)], [8, 0], clamp);
  return <AbsoluteFill style={{ transform: `scale(${punch - settle})`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
};

// One service: index and title at the top, then its works in a gallery frame that cross-fades between them.
const ChapterScene: React.FC<{ chapter: Chapter; index: number; duration: number }> = ({ chapter, index, duration }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const { fg, bg } = chapter;
  const margin = width * 0.06;
  const area = { top: height * 0.32, height: height * 0.62 };
  const box = fitBox(chapter.aspect, { width: width - margin * 1.2, height: area.height });
  const frameIn = useIn(sec(0.35), sec(0.9));
  const starts = chapter.media.map((_, i) => chapter.media.slice(0, i).reduce((sum, s) => sum + shotDuration(s), 0));

  return (
    <SceneOut duration={duration}>
      <AbsoluteFill style={{ background: bg, direction: "rtl", padding: `${height * 0.07}px ${margin}px 0` }}>
        <Rise at={sec(0.05)}>
          <span style={{ fontSize: unit * 0.032, fontWeight: 700, letterSpacing: 3, color: fg, direction: "ltr", display: "inline-block" }}>
            {String(index + 1).padStart(2, "0")}/{String(chapters.length).padStart(2, "0")}
          </span>
        </Rise>
        <div style={{ marginTop: unit * 0.025 }}>
          <Headline
            at={sec(0.15)}
            size={unit * 0.08}
            bigScale={2.4}
            lines={[
              { text: chapter.kicker, color: fg },
              { text: chapter.title, color: chapter.titleColor },
            ]}
          />
        </div>

        {/* Gallery frame */}
        <div
          style={{
            position: "absolute",
            left: (width - box.width) / 2,
            top: area.top + (area.height - box.height) / 2,
            width: box.width,
            height: box.height,
            overflow: "hidden",
            background: "#000",
            opacity: frameIn,
            transform: `translateY(${(1 - frameIn) * 40}px)`,
            border: `${unit * 0.006}px solid ${chapter.titleColor}`,
            boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
          }}
        >
          {chapter.media.map((shot, i) => (
            <Sequence key={i} from={starts[i]} durationInFrames={shotDuration(shot)}>
              <PunchIn length={shotDuration(shot)}>
                {chapter.fit === "contain" ? (
                  <Source
                    src={shotSrc(shot)}
                    style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(0.55)", transform: "scale(1.2)" }}
                  />
                ) : null}
                <Source src={shotSrc(shot)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: chapter.fit }} />
              </PunchIn>
            </Sequence>
          ))}
        </div>

        {/* Progress ticks under the frame, one per work. */}
        {chapter.media.length > 1 ? (
          <div
            style={{
              position: "absolute",
              left: (width - box.width) / 2,
              width: box.width,
              top: area.top + (area.height + box.height) / 2 + unit * 0.025,
              display: "flex",
              gap: unit * 0.012,
              opacity: frameIn,
            }}
          >
            {chapter.media.map((shot, i) => {
              const fill = interpolate(frame - starts[i], [0, shotDuration(shot)], [0, 1], clamp);
              return (
                <div key={i} style={{ flex: 1, height: 3, background: `${fg}26` }}>
                  <div style={{ width: `${fill * 100}%`, height: "100%", background: fg, marginRight: 0, marginLeft: "auto" }} />
                </div>
              );
            })}
          </div>
        ) : null}
      </AbsoluteFill>
    </SceneOut>
  );
};

// Photos of the studio cross-fade under the call to action.
const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const each = 2 * BEAT;

  return (
    <SceneOut duration={editorialTiming.closing}>
      <AbsoluteFill style={{ background: palette.charcoal }}>
        {studioPhotos.map((src, i) => {
          const local = frame - i * each;
          if (local < 0 || local > each + sec(0.4)) return null;
          const opacity = i === 0 ? 1 : interpolate(local, [0, sec(0.4)], [0, 1], clamp);
          const zoom = interpolate(local, [0, each + sec(0.4)], [1.08, 1], clamp);
          return (
            <AbsoluteFill key={src} style={{ opacity }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
            </AbsoluteFill>
          );
        })}
        <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(20,19,26,0.85) 0%, rgba(20,19,26,0.2) 55%, rgba(20,19,26,0) 75%)" }} />
        <AbsoluteFill style={{ justifyContent: "flex-end", padding: `0 ${width * 0.08}px ${height * 0.1}px`, direction: "rtl" }}>
          <Rise at={sec(0.3)}>
            <div style={{ fontFamily: handFont, fontSize: unit * 0.06, color: palette.cream }}>עיצוב עם קריצה ;)</div>
          </Rise>
          <div style={{ marginTop: unit * 0.015 }}>
            <Headline
              at={sec(0.45)}
              size={unit * 0.15}
              bigScale={1.9}
              lines={[
                { text: outro.words.slice(0, -1).join(" "), color: palette.cream },
                { text: outro.words[outro.words.length - 1], color: yellow },
              ]}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneOut>
  );
};

// Logo and contact details on black.
const EndCard: React.FC = () => {
  const { width, height } = useVideoConfig();
  const unit = Math.min(width, height);
  const logo = useIn(sec(0.15), sec(1));

  return (
    <AbsoluteFill style={{ background: black, alignItems: "center", justifyContent: "center", direction: "rtl" }}>
      <div style={{ opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }}>
        <LogoOnDark width={unit * 0.6} />
      </div>
      <div style={{ height: height * 0.05 }} />
      <Rise at={sec(0.9)} style={{ marginTop: unit * 0.045 }}>
        <div
          style={{
            fontSize: unit * 0.05,
            fontWeight: 700,
            color: black,
            background: yellow,
            padding: `${unit * 0.02}px ${unit * 0.06}px`,
            borderRadius: 999,
            direction: "ltr",
          }}
        >
          {outro.website}
        </div>
      </Rise>
      <Rise at={sec(1.05)} style={{ marginTop: unit * 0.012 }}>
        <div style={{ fontSize: unit * 0.036, fontWeight: 300, color: palette.accent, direction: "ltr", letterSpacing: 2 }}>
          {outro.instagram}
        </div>
      </Rise>
      <Rise at={sec(1.3)} style={{ position: "absolute", bottom: height * 0.07 }}>
        <div style={{ fontFamily: handFont, fontSize: unit * 0.05, color: palette.cream }}>מיתוג · אתרים · איור · וידאו ואנימציה</div>
      </Rise>
    </AbsoluteFill>
  );
};

// The vector logo recolored for a dark background: navy lines turn white, the red stays.
const LogoOnDark: React.FC<{ width: number }> = ({ width }) => {
  const [x, y, w, h] = logoViewBox;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} width={width} height={(width * h) / w}>
      {logoParts.map((p, i) => (
        <path key={i} d={p.d} fillRule={p.rule as "nonzero" | "evenodd"} fill={p.kind === "text" || p.kind === "thread" ? p.color : palette.cream} />
      ))}
    </svg>
  );
};

// The largest box of the given aspect ratio that fits in `area`.
const fitBox = (aspect: number, area: Frame): Frame =>
  area.width / area.height > aspect
    ? { width: area.height * aspect, height: area.height }
    : { width: area.width, height: area.width / aspect };
