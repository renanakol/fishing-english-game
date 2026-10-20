// Everything you'd want to change lives here: studio name, colors, texts, works.
// Media paths are relative to the `public/` folder. Videos (.mp4/.mov/.webm) play full screen, muted.

export const brand = {
  studioName: "רני סטודיו",
  logo: "logo/logo.png" as string | null,
  // Studio name + "עיצוב עם קריצה ;)" lockup (white + yellow, for dark backgrounds).
  slogan: "logo/slogan.png" as string | null,
  colors: {
    ink: "#000E2A",
    paper: "#FFFFFF",
    // Each scene's wipe/highlight color, cycled. Taken from the logo and slogan.
    accents: ["#C64B4C", "#EBDE17", "#FFFFFF"],
  },
};

// Words that slam in one per beat over the opening montage.
export const intro = {
  words: ["עיצוב", "עם", "קריצה", ";)"],
};

export type Service = {
  title: string;
  // Each line slams in on its own beat after the title.
  lines: string[];
  media: string[];
};

export const services: Service[] = [
  {
    title: "מיתוג",
    lines: ["זהות", "שאי אפשר", "לפספס"],
    media: [
      "works/branding/smash-eat-bag.jpg",
      "works/branding/wine-and-beard.jpg",
      "works/branding/unity-sign-wide.jpg",
      "works/branding/live-jar.jpg",
      "works/branding/shawarma-wide.jpg",
      "works/branding/stargazing-logo.jpg",
      "works/branding/solano-booth.jpg",
      "works/branding/foraging-poster.jpg",
      "works/branding/unity-logo.jpg",
      "works/branding/live-logo.jpg",
    ],
  },
  {
    title: "אתרים",
    lines: ["עיצוב", "ובנייה", "מא' ועד ת'"],
    media: ["works/web/1.jpg", "works/web/2.jpg", "works/web/3.jpg"],
  },
  {
    title: "איור",
    lines: ["עולמות", "שלמים", "ביד"],
    media: [
      "works/illustration/wizard-of-oz.jpg",
      "works/illustration/party.jpg",
      "works/illustration/peter-pan.jpg",
      "works/illustration/beach.jpg",
    ],
  },
  {
    title: "וידאו",
    lines: ["ואנימציה", "שזזה", "קדימה"],
    media: [
      "works/video/bar-mitzva-1-wide.mp4",
      "works/video/bar-mitzva-2-wide.mp4",
      "works/video/bar-mitzva-3-wide.mp4",
      "works/video/bar-mitzva-4-wide.mp4",
    ],
  },
];

export const outro = {
  words: ["בואי", "ניצור", "יחד"],
  website: "www.reni.co.il",
  instagram: "@reniart8",
};

export const music: string | null = null; // e.g. "audio/music.mp3"

export const FPS = 30;
// Everything is cut to a 120 BPM grid: one beat = 15 frames.
export const BEAT = 15;
export const timing = {
  intro: 8 * BEAT,
  service: 9 * BEAT,
  outro: 10 * BEAT,
};

export const totalDuration = timing.intro + services.length * timing.service + timing.outro;

// Every work, in order — used by the opening montage.
export const allMedia = services.flatMap((s) => s.media);
