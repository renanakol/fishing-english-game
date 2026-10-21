import type { Display } from "./components";
import type { IconName } from "./scenes/Icons";

// Everything you'd want to change lives here: studio name, colors, texts, works.
// Media paths are relative to the `public/` folder. Videos (.mp4/.mov/.webm) play full screen, muted.

export const brand = {
  studioName: "רני סטודיו",
  logo: "logo/logo.png" as string | null,
  // Studio name + "עיצוב עם קריצה ;)" lockup (white + yellow, for dark backgrounds).
  slogan: "logo/slogan.png" as string | null,
  colors: {
    // Sampled from reni.co.il.
    ink: "#202030",
    paper: "#FFFFFF",
    // Each scene's wipe/highlight color, cycled: red, yellow, turquoise.
    accents: ["#C83C3C", "#F8E800", "#60C0C8"],
  },
};

// Opening screen: the slogan, then each service pops in under it with a round thumbnail of a work.
export const intro = {
  services: [
    { label: "מיתוג", icon: "branding" },
    { label: "בניית ועיצוב אתרים", icon: "web" },
    { label: "איור", icon: "illustration" },
    { label: "וידאו ואנימציה", icon: "video" },
  ] as { label: string; icon: IconName }[],
};

// A work on screen: a path, or a path with its own length in beats and/or the point to keep in view when
// the frame crops it (a CSS object-position such as "30% 50%").
export type Shot = string | { src: string; beats?: number; focus?: string };

export type Service = {
  title: string;
  // How the works sit in the frame (default "fill"): see Display in components.tsx.
  display?: Display;
  // One supporting line under the title, on a highlight bar.
  line: string;
  media: Shot[];
};

// Beats each work stays on screen unless it says otherwise (3 beats = 1.5 seconds).
export const BEATS_PER_SHOT = 3;

export const services: Service[] = [
  {
    title: "מיתוג",
    // Taped polaroids dropping onto a pile.
    display: "polaroid",
    line: "זהות שאי אפשר לפספס",
    // Logos and mockups, alternating.
    media: [
      "works/branding/smash-eat-bag.jpg",
      "works/branding/stargazing-logo.jpg",
      "works/branding/wine-and-beard.jpg",
      "works/branding/unity-logo.jpg",
      "works/branding/live-jar.jpg",
      "works/branding/live-logo.jpg",
    ],
  },
  {
    title: "אתרים",
    // Screen recordings inside an illustrated phone.
    display: "phone",
    line: "עיצוב ובנייה מא' ועד ת'",
    media: [{ src: "works/web/agamon-hula-long.mp4", beats: 9 }],
  },
  {
    title: "איור",
    // Painted onto a canvas on an easel.
    display: "easel",
    line: "עולמות שלמים ביד",
    // Each one is painted in, then holds for a moment.
    media: [
      { src: "works/illustration/beach-dancer.jpg", beats: 5 },
      { src: "works/illustration/swim-ring.jpg", beats: 5 },
      { src: "works/illustration/moon.jpg", beats: 5 },
    ],
  },
  {
    title: "וידאו",
    // Played whole inside an illustrated retro TV.
    display: "tv",
    line: "ואנימציה שזזה קדימה",
    media: [
      { src: "works/video/boots-ad-1-wide.mp4", beats: 9 },
      { src: "works/video/princess-frog.mp4", beats: 5 },
      "works/video/boots-ad-2-wide.mp4",
    ],
  },
];

// "Without / with" card: a toggle flips and each generic line is crossed out and replaced.
export const compare = {
  off: "בלי",
  on: "עם רני סטודיו",
  rows: [
    { before: "עיצוב גנרי", after: "עיצוב עם קריצה" },
    { before: "לוגו שאף אחד לא זוכר", after: "זהות שזוכרים" },
    { before: "אתר שעומד במקום", after: "אתר שעובד בשבילך" },
  ],
};

export const outro = {
  // First the call to action over a photo of the studio, then the logo and contact details.
  photo: "works/studio/studio.jpg",
  words: ["בואו", "ניצור", "יחד"],
  website: "www.reni.co.il",
  instagram: "@reniart8",
};

export const music: string | null = null; // e.g. "audio/music.mp3"

export const FPS = 60;
// Everything is cut to a 120 BPM grid: one beat = half a second.
export const BEAT = FPS / 2;
// Seconds -> frames, so motion timing stays the same at any frame rate.
export const sec = (seconds: number) => Math.round(seconds * FPS);
export const timing = {
  intro: 10 * BEAT,
  compare: 8 * BEAT,
  outro: 15 * BEAT,
};

export const shotSrc = (shot: Shot) => (typeof shot === "string" ? shot : shot.src);
export const shotDuration = (shot: Shot) => ((typeof shot === "string" ? undefined : shot.beats) ?? BEATS_PER_SHOT) * BEAT;
export const shotFocus = (shot: Shot) => (typeof shot === "string" ? undefined : shot.focus);
export const serviceDuration = (s: Service) => s.media.reduce((sum, shot) => sum + shotDuration(shot), 0);

export const totalDuration =
  timing.intro + services.reduce((sum, s) => sum + serviceDuration(s), 0) + timing.compare + timing.outro;
