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

// Words that slam in one per beat over the opening montage.
export const intro = {
  words: ["עיצוב", "עם", "קריצה", ";)"],
};

export type Service = {
  title: string;
  // Giant English word drifting behind the title.
  ghost: string;
  // Beats each work stays on screen (default: 2, or 1 when there are many works).
  beatsPerShot?: number;
  // Scene length in beats (default: timing.service).
  beats?: number;
  // Each line slams in on its own beat after the title.
  lines: string[];
  media: string[];
};

export const services: Service[] = [
  {
    title: "מיתוג",
    ghost: "BRANDING",
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
    ghost: "WEBSITES",
    lines: ["עיצוב", "ובנייה", "מא' ועד ת'"],
    // Website screen recordings, one second each; the scene runs longer to fit them all.
    beatsPerShot: 2,
    beats: 14,
    media: [
      "works/web/gohar-1.mp4",
      "works/web/agamon-hula-1.mp4",
      "works/web/reni-site-1.mp4",
      "works/web/in-your-own-time-1.mp4",
      "works/web/gohar-2.mp4",
      "works/web/agamon-hula-2.mp4",
      "works/web/in-your-own-time-2.mp4",
    ],
  },
  {
    title: "איור",
    ghost: "ILLUSTRATION",
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
    ghost: "MOTION",
    lines: ["ואנימציה", "שזזה", "קדימה"],
    media: [
      "works/video/bar-mitzva-1-wide.mp4",
      "works/video/bar-mitzva-2-wide.mp4",
      "works/video/bar-mitzva-3-wide.mp4",
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
export const ticker = ["מיתוג", "בניית ועיצוב אתרים", "איור", "וידאו ואנימציה"];

export const outro = {
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
  intro: 8 * BEAT,
  service: 9 * BEAT,
  compare: 8 * BEAT,
  outro: 10 * BEAT,
};

export const serviceDuration = (s: Service) => (s.beats ? s.beats * BEAT : timing.service);

export const totalDuration =
  timing.intro + services.reduce((sum, s) => sum + serviceDuration(s), 0) + timing.compare + timing.outro;

// Every work, in order — used by the opening montage.
export const allMedia = services.flatMap((s) => s.media);
