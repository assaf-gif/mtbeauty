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

## Swapping in real product assets

Every shot falls back to a CSS stand-in. Drop cut-out PNGs into `public/brand/`
and name them in `Main.tsx`:

```tsx
<Main assets={{
  hero: 'brand/cobra.png',
  sweep: ['brand/bacat.png', 'brand/cobra.png', 'brand/ombre.png'],
  cartons: ['brand/box1.png','brand/box2.png','brand/box3.png','brand/box4.png'],
}} />
```

Nothing else changes — camera, light, timing, captions and layout are all
asset-independent.

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

## Not final

- All product imagery is a placeholder stand-in.
- The ₪1,250 → ₪99 pair in shot 4 is illustrative and unverified. It must be
  replaced with a real, defensible price pair before the film is published.
- No sound design yet (SFX/BGM selection is the next stage).
