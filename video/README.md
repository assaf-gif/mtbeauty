# MTBeauty promo — vertical (1080×1920, 30fps, 621f / 20.7s)

Built with the `video-shotcraft` skill. Direction: **אור על זכוכית** — dark
marble ground, one gold cone, price landing as the payoff.

## Shots

| # | frames | beat | card | reference implementation |
|---|--------|------|------|--------------------------|
| 1 | 0–147 | 0 | `spotlight-hero-card` | `demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx` |
| 2 | 148–250 | 10 | `spotlight-sweep-moves` | `demos/effects/spotlight-sweep-moves/SlideSpotlightPan.tsx` |
| 3 | 251–354 | 17 | `deck-deal-flyin` | `demos/ui-entrance/deck-deal-flyin/DeckDealFlyin.tsx` |
| 4 | 355–472 | 24 | `odometer-digit-roll` | `demos/data/odometer-digit-roll/OdometerDigitRoll.tsx` |
| 5 | 473–620 | 32 | `logo-shrink-wordmark-lockup` | `demos/outro/logo-shrink-wordmark-lockup/LogoShrinkWordmarkLockup.tsx` |

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

## Sound

BGM is `bgm-tech-house.mp3` from the skill library, trimmed to the 21.5s the
film needs. It is **not** taken from 0:00: the track ramps from -23 dB to full
over its first 16 seconds, so starting at zero would put the film's energy peak
(the card deal) on the track's weakest bar. It enters at **7.990s**, which is
both a downbeat and the point where full energy arrives on the deal.

That entry also sets the film's beat phase to 0, which is why `theme.ts` can
express every cut as `beat(k)`.

Analysis: 121.75 BPM, one beat = 14.787 frames. Every cut lands within 0.5
frames of a beat.

### Cue trimming

Several library cues are far longer than the beat they mark — `impact-cine-big`
is 8 seconds, `riser-cine` and `swoosh-slow` are over 5. Untrimmed they bleed
across cuts, and the two `impact-cine-big` hits overlap each other. Each cue
therefore carries a `dur` and fades over its final 7 frames so the truncation
does not click. If you add a cue, check its natural length against the shot it
sits in.

### Two deliverables

```bash
npm run render          # with BGM
npm run render:nobgm    # SFX only, same timeline
```

The music-free version exists so the film can be re-scored in an editor without
losing the sound design.

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

- **Picture is not locked.** The SFX table is pinned to specific frames; if
  shot boundaries move, the whole table has to be re-pinned.
- **No horizontal cut.** Vertical only so far.
- BGM licensing: the track ships with the skill under a free-commercial
  licence, but the library's own notes say its Mixkit provenance can no longer
  be traced per-track. Worth re-checking before a paid campaign.
- Shot 4's ₪25 is arithmetic on the published "4 בשמים ב-100 ש״ח" bundle. If
  that offer changes, the number and the line above it both have to change.
