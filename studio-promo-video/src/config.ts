import type { Display } from "./components";

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
    { label: "מיתוג", thumb: "works/branding/smash-eat-bag.jpg" },
    { label: "בניית ועיצוב אתרים", thumb: "works/thumbs/web.jpg" },
    { label: "איור", thumb: "works/illustration/wizard-of-oz.jpg" },
    { label: "וידאו ואנימציה", thumb: "works/thumbs/video.jpg" },
  ],
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
    display: "fit",
    line: "זהות שאי אפשר לפספס",
    media: [
      "works/branding/smash-eat-bag.jpg",
      "works/branding/wine-and-beard.jpg",
      "works/branding/shawarma-wide.jpg",
      "works/branding/live-jar.jpg",
      "works/branding/solano-booth.jpg",
      "works/branding/stargazing-logo.jpg",
    ],
  },
  {
    title: "אתרים",
    line: "עיצוב ובנייה מא' ועד ת'",
    media: [
      // Agamon Hula gets a long, unhurried scroll; then two more sites.
      { src: "works/web/agamon-hula-long.mp4", beats: 9 },
      { src: "works/web/in-your-own-time-long.mp4", beats: 4 },
      { src: "works/web/gohar-long.mp4", beats: 4 },
    ],
  },
  {
    title: "איור",
    display: "card",
    line: "עולמות שלמים ביד",
    // More in works/illustration/: wizard-of-oz, peter-pan, party, beach, vessel, helmet, leap, kitchen-knight, storm.
    media: [
      "works/illustration/beach-dancer.jpg",
      "works/illustration/swim-ring.jpg",
      "works/illustration/air-mattress.jpg",
      "works/illustration/sunbather.jpg",
      "works/illustration/balloons.jpg",
      "works/illustration/armadillo.jpg",
      "works/illustration/moon.jpg",
      "works/illustration/bouquet.jpg",
    ],
  },
  {
    title: "וידאו",
    // Played whole inside an illustrated retro TV.
    display: "tv",
    line: "ואנימציה שזזה קדימה",
    media: [
      "works/video/boots-ad-1-wide.mp4",
      "works/video/bar-mitzva-1-wide.mp4",
      { src: "works/video/princess-frog.mp4", beats: 5 },
      "works/video/bar-mitzva-2-wide.mp4",
      "works/video/boots-ad-2-wide.mp4",
      "works/video/bar-mitzva-4-wide.mp4",
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

// Running strip on the final screen.
export const ticker = intro.services.map((s) => s.label);

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
  outro: 12 * BEAT,
};

export const shotSrc = (shot: Shot) => (typeof shot === "string" ? shot : shot.src);
export const shotDuration = (shot: Shot) => ((typeof shot === "string" ? undefined : shot.beats) ?? BEATS_PER_SHOT) * BEAT;
export const shotFocus = (shot: Shot) => (typeof shot === "string" ? undefined : shot.focus);
export const serviceDuration = (s: Service) => s.media.reduce((sum, shot) => sum + shotDuration(shot), 0);

export const totalDuration =
  timing.intro + services.reduce((sum, s) => sum + serviceDuration(s), 0) + timing.compare + timing.outro;
