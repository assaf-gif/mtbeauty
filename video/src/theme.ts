// Design tokens for mtbeauty.co.il.
// Gold = the site's accent: logo "MT", CTA button, "מבצע" badge, section rule,
// "הוספה לסל". Ground = the bundle-card product photography (dark marble + one
// warm spot). Exact values get re-sampled from computed styles once the site is
// reachable; these are measured off the supplied screenshots.
export const T = {
  ground: '#14100C',
  groundDeep: '#0B0906',
  // Measured from the brand's own logo SVG (brand/mtb-logo-footer.svg), not
  // eyeballed off screenshots: the wordmark's gold is a gradient running
  // #96702a → #d19741 → #d4a34c → #d9b25b.
  gold: '#d19741',
  goldBright: '#d9b25b',
  goldDeep: '#96702a',
  cream: '#F4EDE1',
  muted: '#9C8A70',
  strike: '#665A4C',
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// BEAT GRID. The BGM (public/audio/bgm.mp3) is tech-house at 121.75 BPM, so
// one beat = 60/121.75 * 30 = 14.787 frames. The track is trimmed to enter on
// its downbeat at 7.990s, which puts the film's beat phase at 0 — beat k lands
// on frame round(k * 14.787).
//
// Every cut below sits on a beat (max error 0.5f, well inside the <=3f the
// skill's music-beat-sync reference allows). Each window still clears its shot
// card's own minimum hold budget:
//   hero  148f - reseat completes at 130, 18f of stillness after
//   sweep 103f
//   deal  104f - board full at 59, 45f rest (card wants >=15f)
//   price 118f - last digit locks at 49, pulse to 57, 61f still (card wants >=45f)
//   logo  148f - tagline in by 107, 41f hold (>=1s, per the pacing rule)
// Do not nudge these off the grid to save a few frames.
export const BPM = 121.75;
export const BEAT = (30 * 60) / BPM; // 14.787 frames
export const beat = (k: number) => Math.round(k * BEAT);

export const SHOTS = {
  hero:  { from: beat(0),  dur: beat(10) - beat(0)  }, // 0   -> 148
  sweep: { from: beat(10), dur: beat(17) - beat(10) }, // 148 -> 251
  deal:  { from: beat(17), dur: beat(24) - beat(17) }, // 251 -> 355
  price: { from: beat(24), dur: beat(32) - beat(24) }, // 355 -> 473
  logo:  { from: beat(32), dur: beat(42) - beat(32) }, // 473 -> 621
} as const;
export const TOTAL = beat(42); // 621f = 20.7s
