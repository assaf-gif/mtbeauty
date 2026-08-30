# MTBeauty promo — vertical (1080×1920, 30fps, 579f / 19.3s)

Built with the `video-shotcraft` skill. Direction: **אור על זכוכית** — dark
marble ground, one gold cone, price landing as the payoff.

## Shots

| # | frames | card | reference implementation |
|---|--------|------|--------------------------|
| 1 | 0–138 | `spotlight-hero-card` | `demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx` |
| 2 | 139–238 | `spotlight-sweep-moves` | `demos/effects/spotlight-sweep-moves/SlideSpotlightPan.tsx` |
| 3 | 239–342 | `deck-deal-flyin` | `demos/ui-entrance/deck-deal-flyin/DeckDealFlyin.tsx` |
| 4 | 343–458 | `odometer-digit-roll` | `demos/data/odometer-digit-roll/OdometerDigitRoll.tsx` |
| 5 | 459–578 | `logo-shrink-wordmark-lockup` | `demos/outro/logo-shrink-wordmark-lockup/LogoShrinkWordmarkLockup.tsx` |

Tuned timing values are copied from those demos, not re-derived. Comments in
each shot file mark which numbers are load-bearing.

## Assets

Originals live in `brand/` at the repo root; the derived files the film loads
are in `video/public/brand/`.

| file | derived from | used by |
|------|--------------|---------|
| `cobra.png`, `cobra-bottle.png` | the COBRA studio pack shot, background removed | S1 |
| `plate-b100.png` | the "4 בשמים ב-100" creative, headline and hands cropped off | S2 |
| `card-b100/299/250.jpg` | the three bundle creatives, whole | S3 |
| `logo.svg` | `mtb-logo-footer.svg` (white wordmark, for dark grounds) | S5 |

### Re-cutting a pack shot

`cobra.png` was cut from a white studio sweep. Two things there are easy to get
wrong and both are worth knowing before cutting another:

1. **The sweep is not pure white** — it sits at 248–254. Mapping alpha straight
   from distance-to-white leaves ~12% alpha across the whole background, which
   composites as a pale rectangle on a dark stage. Force a hard zero above a
   black point (236) before ramping, and re-floor after any blur.
2. **The floor reflection survives the cut** and reads as a bright slab. It is
   not separable by silhouette width — the reflection is the same shape. It IS
   separable by luminance: mean luma of opaque pixels steps from ~48 to ~142
   across the contact line.

### Swapping products

Override in `Root.tsx` / `Main.tsx`:

```tsx
<Main assets={{
  hero: 'brand/cobra-bottle.png',
  plate: 'brand/plate-b100.png',
  cards: ['brand/card-b100.jpg', 'brand/card-b299.jpg', 'brand/card-b250.jpg'],
}} />
```

Camera, light, timing and captions are asset-independent.

## Renderer gotcha

`mask-image` on a `<div>` is **not honoured** by the headless renderer used
here. Any soft-edged overlay masked that way paints its full bounding box
instead — which is how a light sweep turns into a bright rectangle. Clip a
second copy of the artwork with `clip-path` instead: the copy carries the
product's own alpha, so the effect can only land on the product.

## Commands

```bash
npm install
npm run dev      # Remotion studio
npm run render   # out/mtbeauty-promo.mp4
```

Rendering in this container needs the headless shell explicitly:

```bash
npx remotion render src/index.ts MTBeautyPromo out/promo.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Still open

- **No sound design yet.** SFX selection and BGM are the next stage; a
  beat-driven track means cut timing has to be re-fitted to the beat grid
  before the timeline is locked.
- **No horizontal cut.** Vertical only so far.
- Shot 4's ₪25 is arithmetic on the published "4 בשמים ב-100 ש״ח" bundle. If
  that offer changes, the number and the line above it both have to change.
