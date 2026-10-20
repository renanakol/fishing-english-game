import React from "react";
import { Composition } from "remotion";
import { FPS, totalDuration } from "./config";
import { StudioPromo } from "./StudioPromo";

const formats = [
  { id: "StudioPromo", width: 1080, height: 1920 }, // 9:16 — Reels / Stories / TikTok
  { id: "StudioPromoSquare", width: 1080, height: 1080 }, // 1:1 — feed
  { id: "StudioPromoWide", width: 1920, height: 1080 }, // 16:9 — website / YouTube
];

export const RemotionRoot: React.FC = () => (
  <>
    {formats.map((f) => (
      <Composition
        key={f.id}
        id={f.id}
        component={StudioPromo}
        durationInFrames={totalDuration}
        fps={FPS}
        width={f.width}
        height={f.height}
      />
    ))}
  </>
);
