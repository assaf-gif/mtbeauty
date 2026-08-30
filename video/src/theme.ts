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

// Shot budget — 570f / 19s. Each window is sized to the shot card's own
// minimum hold budget; do not compress these without dropping a whole shot.
export const SHOTS = {
  hero:  { from: 0,   dur: 139 },
  sweep: { from: 139, dur: 100 },
  deal:  { from: 239, dur: 104 },
  price: { from: 343, dur: 116 },
  logo:  { from: 459, dur: 120 },
} as const;
export const TOTAL = 579; // 19.3s
