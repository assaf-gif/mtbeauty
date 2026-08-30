// S3 · deck-deal-flyin (references/shots/ui-entrance/deck-deal-flyin.md)
// Reference implementation: demos/ui-entrance/deck-deal-flyin/DeckDealFlyin.tsx
//
// Three load-bearing mechanics carried over verbatim from the demo:
//   1) ANTICIPATION before the first card leaves: the stack presses down and the
//      top card pulls back AGAINST the deal direction. The demo records a
//      precedent that this must clear the perceptual threshold (48/30px) — under
//      that it reads as a glitch, not as a wind-up. Kept at 48/30.
//   2) Inter-card gap HARD-ACCELERATES (4f → 0.2f in the demo). Even spacing is
//      what makes a deal read as a slideshow.
//   3) Each card: z-arc apex mid-flight → settle overshoot → press rebound.
//   4) 0.5s (15f) full-board rest at the end. Non-negotiable per the card.
//
// ADAPTATION: 26 UI cards into a 3-col grid becomes 4 cartons into a 2×2 — the
// bundle is "4 בשמים ב-100 ₪", so the board is four. Fewer items means the gap
// ramp is re-fit across 4 deals rather than 26; the ratio (first gap 5f, last
// 1.5f) preserves the acceleration the card asks for.
import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { Carton } from '../lib/Carton';
import { Caption } from '../lib/Caption';

export const S3_DUR = 104;

const CARD_W = 320;
const SLOTS = [
  // grid sits high in frame: the caption owns the lower third, and the two
  // must not collide (they did on the first QA pass).
  { x: -176, y: -628 }, { x: 176, y: -628 },
  { x: -176, y: -90 },  { x: 176, y: -90 },
];
// hard-accelerating deal starts: gaps 5f, 3f, 1.5f
const STARTS = [30, 35, 38, 39.5];
const FLIGHT = 17;

const SETTLE = Easing.bezier(0.16, 1.22, 0.34, 1);

export const S3Deal: React.FC<{ srcs?: (string | undefined)[] }> = ({ srcs = [] }) => {
  const frame = useCurrentFrame();

  // (1) anticipation — press down + pull back, amplitudes at the 48/30 precedent
  const antic = interpolate(frame, [14, 26, 30], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.4, 1),
  });
  const stackPress = antic * 30;   // 30px down
  const topPull = antic * 48;      // 48px back, against the deal

  const dealt = STARTS.filter((s) => frame >= s + FLIGHT).length;
  const restStart = STARTS[3] + FLIGHT;

  return (
    <AbsoluteFill>
      <Stage spotX={50} spotY={30} poolR={620} vignette={0.4}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 1, height: 1 }}>
            {/* the stack, still un-dealt */}
            {frame < STARTS[3] + 2 ? (
              <div
                style={{
                  position: 'absolute', left: -CARD_W / 2, top: -CARD_W * 0.81,
                  transform: `translateY(${stackPress}px)`,
                }}
              >
                {[3, 2, 1, 0].map((k) => {
                  const isTop = k === 0;
                  const stillHere = STARTS.filter((s) => frame >= s).length <= (3 - k);
                  if (!stillHere) return null;
                  return (
                    <div
                      key={k}
                      style={{
                        position: 'absolute', left: k * 3, top: -k * 7,
                        transform: isTop ? `translateY(${topPull}px)` : undefined,
                        opacity: 1 - k * 0.06,
                      }}
                    >
                      <Carton w={CARD_W} />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* dealt cartons */}
            {SLOTS.map((slot, i) => {
              const s = STARTS[i];
              if (frame < s) return null;
              const p = interpolate(frame, [s, s + FLIGHT], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SETTLE,
              });
              // (3) z-arc apex mid-flight
              const arc = Math.sin(Math.min(1, Math.max(0, (frame - s) / FLIGHT)) * Math.PI);
              const scale = 1 + arc * 0.16;
              // press rebound on touchdown
              const press = interpolate(frame, [s + FLIGHT - 1, s + FLIGHT + 2, s + FLIGHT + 5],
                [1, 0.972, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const x = interpolate(p, [0, 1], [0, slot.x]);
              const y = interpolate(p, [0, 1], [-CARD_W * 0.4, slot.y]);
              const rot = interpolate(p, [0, 1], [i % 2 ? 9 : -9, 0]);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', left: x - CARD_W / 2, top: y,
                    transform: `scale(${scale * press}) rotate(${rot}deg)`,
                    filter: arc > 0.25 ? `blur(${arc * 1.6}px)` : undefined,
                  }}
                >
                  <Carton src={srcs[i]} w={CARD_W} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Stage>

      {/* (4) the board is full from `restStart`; caption lands into the rest */}
      <Caption
        kicker={dealt === 4 ? 'הבאנדל' : undefined}
        lines={[{ text: '4 בשמים', gold: true }, { text: 'ב־100 ₪' }]}
        start={Math.round(restStart) + 2}
        size={100}
      />
    </AbsoluteFill>
  );
};
