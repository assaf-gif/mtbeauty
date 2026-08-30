// S5 · logo-shrink-wordmark-lockup (references/shots/outro/logo-shrink-wordmark-lockup.md)
// Reference implementation: demos/outro/logo-shrink-wordmark-lockup/LogoShrinkWordmarkLockup.tsx
//
// Beat structure from the card (132f @30fps native), re-fit to 120f:
//   collapse 0.1–1.2s · make-room 1.5–2.1s · letters 2–2.7s · tagline 3.2–3.7s
// carried as: ring collapse 3→36 (easeInOut + a small overshoot brake), mark
// shifts right 45→63 (RTL: room is made on the LEFT for the wordmark), letters
// 60→81 staggered opacity + 8px slide, tagline 96→111 as one line, then hold.
// Brand wordmark holds ≥30f still at the end — the card and the skill's pacing
// rule both require ≥1s, and every past note points the same way: slower.
import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { T } from '../theme';
import { fontFamily as heebo } from '@remotion/google-fonts/Heebo';
import { fontFamily as mont } from '@remotion/google-fonts/Montserrat';

export const S5_DUR = 120;

const WORDMARK = 'BEAUTY';
const MARK_SIZE = 128;

export const S5Logo: React.FC = () => {
  const frame = useCurrentFrame();

  // ring collapses to the solid MT mark, with a brake overshoot at the end
  const collapse = interpolate(frame, [3, 36], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.5, 0, 0.15, 1.06),
  });
  const ringR = interpolate(collapse, [0, 1], [300, MARK_SIZE * 0.62]);
  const ringW = interpolate(collapse, [0, 1], [10, 0]);
  const ringOp = interpolate(frame, [30, 40], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const markIn = interpolate(frame, [28, 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

  // The wordmark reads MTBEAUTY left-to-right: the MT mark shifts LEFT to open
  // room, and BEAUTY fills in on its right. (Latin lockup stays LTR inside the
  // otherwise-RTL film — that is how the logo is set on the site.)
  const shift = interpolate(frame, [45, 63], [0, -172], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  const tagline = interpolate(frame, [96, 111], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill>
      <Stage spotX={50} spotY={30} poolR={640} vignette={0.44}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* collapsing ring */}
          {ringOp > 0.01 ? (
            <div
              style={{
                position: 'absolute', width: ringR * 2, height: ringR * 2, borderRadius: '50%',
                border: `${Math.max(0, ringW)}px solid ${T.goldBright}`,
                opacity: ringOp,
                filter: `drop-shadow(0 0 22px rgba(232,188,94,.55))`,
              }}
            />
          ) : null}

          {/* lockup */}
          <div
            style={{
              position: 'relative', display: 'flex', direction: 'ltr', alignItems: 'baseline',
              fontFamily: mont, fontWeight: 900, fontSize: MARK_SIZE, letterSpacing: '-.02em',
            }}
          >
            <span
              style={{
                transform: `translateX(${shift + 172}px)`, opacity: markIn,
                background: `linear-gradient(95deg,${T.goldBright},${T.goldDeep})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}
            >
              MT
            </span>
            {/* wordmark letters slide in left→right into the room the mark made */}
            <div style={{ display: 'flex', transform: `translateX(${-172 - shift}px)` }}>
              {WORDMARK.split('').map((ch, i) => {
                const s = 60 + i * 3.5;
                const p = interpolate(frame, [s, s + 12], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.2, 0.8, 0.25, 1),
                });
                return (
                  <span
                    key={i}
                    style={{
                      color: T.cream, opacity: p,
                      transform: `translateX(${(1 - p) * -8}px)`, display: 'inline-block',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 34, fontFamily: heebo, direction: 'rtl',
              fontSize: 46, fontWeight: 700, color: T.cream, opacity: tagline,
              transform: `translateY(${(1 - tagline) * 10}px)`,
            }}
          >
            קונים חכם, קונים דובאי
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
