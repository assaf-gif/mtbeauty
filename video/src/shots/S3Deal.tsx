// S3 · deck-deal-flyin (references/shots/ui-entrance/deck-deal-flyin.md)
// Reference implementation: demos/ui-entrance/deck-deal-flyin/DeckDealFlyin.tsx
//
// Load-bearing mechanics carried over from the demo:
//   1) ANTICIPATION before the first card leaves: the stack presses down and the
//      top card pulls back AGAINST the deal direction. The demo records that
//      this must clear the perceptual threshold (48/30px precedent) or it reads
//      as a glitch rather than a wind-up. Kept at 48/30.
//   2) Inter-card gap HARD-ACCELERATES. Even spacing is what turns a deal into
//      a slideshow — here 7f, 4f between three deals.
//   3) Per card: z-arc apex mid-flight → settle overshoot → press rebound.
//   4) Full-board rest ≥15f at the end. Non-negotiable per the card.
//
// ADAPTATION: the demo deals 26 UI cards into a content wall to say "there is a
// lot here". The equivalent claim for this product is the offer ladder, so the
// three dealt cards are MTBeauty's own bundle creatives — 4/100, 4/299, 11/250.
// Fewer cards than the demo, so the acceleration ramp is re-fit across three.
import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { Caption } from '../lib/Caption';
import { T } from '../theme';

export const S3_DUR = 104;

const CARDS = ['brand/card-b100.jpg', 'brand/card-b299.jpg', 'brand/card-b250.jpg'];
const CARD_W = 430;
// Fanned cascade, heavily overlapped: three 430px squares laid end-to-end
// would run past the frame and into the caption, so they shingle instead —
// each card still fully readable at its headline, which is the part that sells.
const SLOTS = [
  { x:  46, y: -600, r: -3.5 },
  { x: -52, y: -380, r:  2.5 },
  { x:  30, y: -150, r: -1.5 },
];
const STARTS = [30, 37, 41];   // gaps 7f → 4f
const FLIGHT = 18;
const SETTLE = Easing.bezier(0.16, 1.22, 0.34, 1);

const Card: React.FC<{ src: string; w: number }> = ({ src, w }) => (
  <div
    style={{
      width: w, borderRadius: 8, overflow: 'hidden',
      boxShadow: `0 22px 44px rgba(0,0,0,.72), inset 0 0 0 1px ${T.gold}33`,
    }}
  >
    <Img src={staticFile(src)} style={{ width: '100%', display: 'block' }} />
  </div>
);

export const S3Deal: React.FC<{ cards?: string[] }> = ({ cards = CARDS }) => {
  const frame = useCurrentFrame();

  // (1) anticipation — press down + pull back at the 48/30 precedent
  const antic = interpolate(frame, [14, 26, 30], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.4, 1),
  });
  const stackPress = antic * 30;
  const topPull = antic * 48;

  const restStart = STARTS[2] + FLIGHT;

  return (
    <AbsoluteFill>
      <Stage spotX={50} spotY={26} poolR={700} vignette={0.42}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 1, height: 1 }}>
            {/* the undealt stack */}
            {frame < STARTS[2] + 2 ? (
              <div style={{ position: 'absolute', left: -CARD_W / 2, top: -CARD_W / 2,
                            transform: `translateY(${stackPress}px)` }}>
                {[2, 1, 0].map((k) => {
                  const gone = STARTS.filter((s) => frame >= s).length > (2 - k);
                  if (gone) return null;
                  return (
                    <div key={k} style={{
                      position: 'absolute', left: k * 5, top: -k * 9,
                      transform: k === 0 ? `translateY(${topPull}px)` : undefined,
                      opacity: 1 - k * 0.08,
                    }}>
                      <Card src={cards[k]} w={CARD_W} />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* dealt cards */}
            {SLOTS.map((slot, i) => {
              const s = STARTS[i];
              if (frame < s) return null;
              const p = interpolate(frame, [s, s + FLIGHT], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SETTLE,
              });
              // (3) z-arc apex mid-flight
              const arc = Math.sin(Math.min(1, Math.max(0, (frame - s) / FLIGHT)) * Math.PI);
              const press = interpolate(frame, [s + FLIGHT - 1, s + FLIGHT + 2, s + FLIGHT + 5],
                [1, 0.974, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const x = interpolate(p, [0, 1], [0, slot.x]);
              const y = interpolate(p, [0, 1], [-CARD_W / 2, slot.y]);
              const rot = interpolate(p, [0, 1], [i % 2 ? 11 : -11, slot.r]);
              return (
                <div key={i} style={{
                  position: 'absolute', left: x - CARD_W / 2, top: y,
                  transform: `scale(${(1 + arc * 0.14) * press}) rotate(${rot}deg)`,
                  filter: arc > 0.25 ? `blur(${arc * 1.8}px)` : undefined,
                }}>
                  <Card src={cards[i]} w={CARD_W} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Stage>

      {/* (4) board full from restStart — caption lands into the rest */}
      <Caption
        lines={[{ text: 'שלושה באנדלים.' }, { text: 'מ־25 ₪ לבושם.', gold: true }]}
        start={Math.round(restStart) + 3}
        size={82}
      />
    </AbsoluteFill>
  );
};
