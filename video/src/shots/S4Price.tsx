// S4 · odometer-digit-roll (references/shots/data/odometer-digit-roll.md)
// Reference implementation: demos/data/odometer-digit-roll/OdometerDigitRoll.tsx
//
// The card's whole point is that the number is COMPUTED, not flown in: each
// digit is a 0–9 strip spinning behind an overflow box, decelerating per-digit
// left→right, overshooting half a row, then clicking back. Values carried over
// verbatim — the card marks these as the ones that must not be downgraded:
//   SPIN 0.85 rows/frame · digit i decelerates at 20 + i*7 · 16f decel
//   (Easing.out(cubic)) to T+0.5 · 6f settle back to T
//   speed-gated ghost copies at ±ROW/2, opacity .25/.12, gate over speed .06→.5
//   after the last lock: colour pulse + 1.035 micro-scale over 8f
//   then FULL STILLNESS ≥45f
// Two digits (25), so locks land at 42 and 49, the pulse runs 49→57 and the
// shot holds still from 70 to 116 — 46f, clearing the card's ≥45f minimum.
//
// THE NUMBER: ₪25 is arithmetic on MTBeauty's own published bundle offer,
// "4 בשמים 30 מ״ל ב-100 ש״ח" — 100 / 4 = 25. It is shown with its derivation
// on screen so the claim is checkable. This replaces an earlier ₪1,250 → ₪99
// comparison that paired two prices that never appear together on the site;
// an unverifiable number is exactly what draws an ad complaint, and there is
// no need for one when the real offer divides this well.
import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { T } from '../theme';
import { fontFamily as heebo } from '@remotion/google-fonts/Heebo';
import { fontFamily as mont } from '@remotion/google-fonts/Montserrat';

export const S4_DUR = 116;

const ROW = 260;
const DW = 138;
const FS = 236;
const SPIN = 0.85;
const DIGITS = [2, 5];

const posAt = (f: number, i: number): number => {
  const d = DIGITS[i];
  const s = 20 + i * 7;
  const p0 = SPIN * s;
  const target = Math.ceil((p0 + 6 - d) / 10) * 10 + d;
  if (f < s) return SPIN * Math.max(f, 0);
  if (f < s + 16)
    return interpolate(f, [s, s + 16], [p0, target + 0.5], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
    });
  if (f < s + 22)
    return interpolate(f, [s + 16, s + 22], [target + 0.5, target], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
    });
  return target;
};

const Strip: React.FC<{ pos: number; opacity?: number; dy?: number }> = ({ pos, opacity = 1, dy = 0 }) => (
  <div
    style={{
      position: 'absolute', left: 0, top: 0, width: DW, opacity,
      transform: `translateY(${-(pos % 10) * ROW + dy}px)`,
    }}
  >
    {Array.from({ length: 20 }).map((_, k) => (
      <div
        key={k}
        style={{
          width: DW, height: ROW, lineHeight: `${ROW}px`, textAlign: 'center',
          fontSize: FS, fontWeight: 900, fontFamily: mont, fontVariantNumeric: 'tabular-nums',
          background: `linear-gradient(180deg,#F3D48A,${T.goldDeep})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}
      >
        {k % 10}
      </div>
    ))}
  </div>
);

const Reel: React.FC<{ frame: number; i: number }> = ({ frame, i }) => {
  const pos = posAt(frame, i);
  const speed = Math.abs(pos - posAt(frame - 1, i));
  const gate = interpolate(speed, [0.06, 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{ position: 'relative', width: DW, height: ROW, overflow: 'hidden' }}>
      {gate > 0.001 ? (
        <>
          <Strip pos={pos} opacity={0.25 * gate} dy={ROW * 0.5} />
          <Strip pos={pos} opacity={0.12 * gate} dy={-ROW * 0.5} />
        </>
      ) : null}
      <Strip pos={pos} />
    </div>
  );
};

export const S4Price: React.FC = () => {
  const frame = useCurrentFrame();
  const LOCK = 20 + 1 * 7 + 22; // last digit settles: 49

  const pulseScale = interpolate(frame, [LOCK, LOCK + 4, LOCK + 8], [1, 1.035, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad),
  });
  const glow = interpolateColors(frame, [LOCK, LOCK + 4, LOCK + 8],
    ['rgba(201,162,39,0)', 'rgba(201,162,39,.45)', 'rgba(201,162,39,.18)']);

  const oldIn = interpolate(frame, [6, 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const labelOp = interpolate(frame, [LOCK + 3, LOCK + 21], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill>
      <Stage spotX={50} spotY={34} poolR={560} vignette={0.5}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: heebo }}>
          {/* the offer this number comes from, so the maths is visible */}
          <div
            style={{
              opacity: oldIn, marginBottom: 30, direction: 'rtl',
              fontSize: 52, fontWeight: 700, color: T.muted,
              transform: `translateY(${(1 - oldIn) * 12}px)`,
            }}
          >
            4 בשמים ב־100 ₪
          </div>

          <div
            style={{
              display: 'flex', direction: 'ltr', alignItems: 'flex-start',
              transform: `scale(${pulseScale})`, position: 'relative',
            }}
          >
            {/* glow sits BEHIND the reels: a drop-shadow on the row silhouettes
                the opaque digit boxes as a dark rounded rectangle. */}
            <div
              style={{
                position: 'absolute', inset: '-18% -12%', borderRadius: '50%',
                background: `radial-gradient(50% 50%, ${glow}, transparent 70%)`,
                filter: 'blur(30px)', pointerEvents: 'none',
              }}
            />
            <Reel frame={frame} i={0} />
            <Reel frame={frame} i={1} />
            <div
              style={{
                height: ROW, lineHeight: `${ROW}px`, fontSize: FS, fontWeight: 900, fontFamily: mont,
                background: `linear-gradient(180deg,#F3D48A,${T.goldDeep})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                paddingLeft: 8,
              }}
            >
              ₪
            </div>
          </div>

          <div style={{ marginTop: 34, opacity: labelOp, direction: 'rtl', textAlign: 'center' }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: T.cream }}>לבושם</div>
            <div style={{ fontSize: 34, fontWeight: 300, color: T.muted, marginTop: 10 }}>30 מ״ל</div>
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
