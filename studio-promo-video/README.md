# Studio promo video

Motion-graphics promo video built with [Remotion](https://www.remotion.dev).

## Editing
- Studio name, colors, texts, contact details and the list of works: `src/config.ts`
- Works go in `public/works/<branding|web|illustration|video>/`
- Logo: `public/logo/`, music: `public/audio/` (then set the paths in `src/config.ts`)
- `./make-placeholders.sh` fills missing work slots with placeholder images

## Commands
```bash
npm install
npm run studio          # live preview in the browser
npm run render          # 9:16  -> out/studio-promo.mp4
npm run render:square   # 1:1
npm run render:wide     # 16:9
```

Font: Heebo (SIL Open Font License, `public/fonts/OFL.txt`).
