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
// on frame round(k * 14.787). Every cut sits on a beat (max error 0.5f).
export const BPM = 121.75;
export const BEAT = (30 * 60) / BPM; // 14.787 frames
export const beat = (k: number) => Math.round(k * BEAT);

// Seven shots, 33.5s. The first cut ran five shots in 20s and read as a product
// film with no one in it — the note back was "not professional, too short, no
// man or woman". Perfume is sold through people, and the brand's own bundle
// creatives already contain a woman's hand and a man's hand spraying, which the
// first pass cropped out. They open the film now, and the arc is:
//   desire (her) -> the object -> desire (him) -> the range -> the offer ->
//   the price -> the brand
export const SHOTS = {
  sprayHer: { from: beat(0),  dur: beat(8)  - beat(0)  }, //   0 -> 118
  hero:     { from: beat(8),  dur: beat(20) - beat(8)  }, // 118 -> 296
  sprayHim: { from: beat(20), dur: beat(27) - beat(20) }, // 296 -> 399
  range:    { from: beat(27), dur: beat(37) - beat(27) }, // 399 -> 547
  offer:    { from: beat(37), dur: beat(47) - beat(37) }, // 547 -> 695
  price:    { from: beat(47), dur: beat(57) - beat(47) }, // 695 -> 843
  logo:     { from: beat(57), dur: beat(68) - beat(57) }, // 843 -> 1006
} as const;
export const TOTAL = beat(68); // 1006f = 33.5s
