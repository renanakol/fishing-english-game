import React from "react";
import { brand } from "../config";

// Small illustrated icons for the opening, drawn in the same ink-outline style as the props.
export type IconName = "branding" | "web" | "illustration" | "video";

const ink = brand.colors.ink;
const [red, yellow, turquoise] = brand.colors.accents;
const paper = brand.colors.paper;
const stroke = { stroke: ink, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export const Icon: React.FC<{ name: IconName; size: number }> = ({ name, size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {name === "branding" ? (
      // Pen nib
      <g {...stroke}>
        <path d="M50 12 L78 46 L62 88 L38 88 L22 46 Z" fill={yellow} />
        <line x1="50" y1="48" x2="50" y2="74" />
        <circle cx="50" cy="44" r="6" fill={paper} />
        <line x1="38" y1="88" x2="62" y2="88" strokeWidth="8" />
      </g>
    ) : null}
    {name === "web" ? (
      // Browser window with a cursor
      <g {...stroke}>
        <rect x="12" y="20" width="76" height="58" rx="8" fill={paper} />
        <path d="M12 36 H88" />
        <path d="M12 28 a8 8 0 0 1 8 -8 H80 a8 8 0 0 1 8 8 V36 H12 Z" fill={turquoise} />
        <circle cx="22" cy="28" r="2.5" fill={ink} />
        <circle cx="31" cy="28" r="2.5" fill={ink} />
        <rect x="22" y="46" width="30" height="8" rx="3" fill={yellow} />
        <path d="M22 62 H70" />
        <path d="M60 52 L60 82 L68 74 L74 86 L80 83 L74 71 L84 70 Z" fill={paper} />
      </g>
    ) : null}
    {name === "illustration" ? (
      // Pencil
      <g {...stroke} transform="rotate(40 50 50)">
        <rect x="40" y="10" width="20" height="58" rx="3" fill={red} />
        <rect x="40" y="10" width="20" height="10" fill={paper} />
        <path d="M40 68 L60 68 L50 90 Z" fill="#F3D9B1" />
        <path d="M46 82 L54 82 L50 90 Z" fill={ink} />
      </g>
    ) : null}
    {name === "video" ? (
      // Mini retro TV
      <g {...stroke}>
        <path d="M38 14 L50 28 L62 12" fill="none" />
        <rect x="10" y="28" width="80" height="56" rx="10" fill={red} />
        <rect x="18" y="36" width="52" height="40" rx="6" fill={turquoise} />
        <path d="M38 48 L52 56 L38 64 Z" fill={paper} />
        <circle cx="80" cy="46" r="4.5" fill={yellow} />
        <circle cx="80" cy="62" r="4.5" fill={paper} />
      </g>
    ) : null}
  </svg>
);
