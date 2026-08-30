// S5 · logo-shrink-wordmark-lockup (references/shots/outro/logo-shrink-wordmark-lockup.md)
// Reference implementation: demos/outro/logo-shrink-wordmark-lockup/LogoShrinkWordmarkLockup.tsx
//
// Beat structure from the card (132f native), re-fit to 120f:
//   collapse 0.1–1.2s · make-room 1.5–2.1s · letters 2–2.7s · tagline 3.2–3.7s
// carried as: ring collapse 3→36 (easeInOut with a small overshoot brake),
// MT mark lands 30→44, BEAUTY wipes in left→right 52→78, tagline 92→107 as one
// line, then ≥30f of stillness. Every past pacing note points the same way —
// slower — so the hold is generous rather than trimmed.
//
// ADAPTATION: the demo animates five letters as separate nodes. The real
// wordmark is a single flat vector (brand/mtb-logo-footer.svg), and redrawing it
// as per-letter glyphs would mean rebuilding the logo by hand — a worse trade
// than losing per-letter stagger. So BEAUTY is revealed by a left→right wipe,
// which keeps the card's "letters arrive in reading order" read while the
// artwork stays the brand's own file, pixel-exact at any scale.
import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { T } from '../theme';
import { fontFamily as heebo } from '@remotion/google-fonts/Heebo';

export const S5_DUR = 120;

const LOGO = 'brand/logo.svg';
const LOGO_W = 760;
const LOGO_AR = 562.72 / 73.8;
// where "MT" ends and "BEAUTY" begins, as a fraction of the artwork's width
const SPLIT = 0.285;

export const S5Logo: React.FC = () => {
  const frame = useCurrentFrame();

  const collapse = interpolate(frame, [3, 36], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.5, 0, 0.15, 1.06),
  });
  const ringR = interpolate(collapse, [0, 1], [330, 74]);
  const ringW = interpolate(collapse, [0, 1], [9, 0]);
  const ringOp = interpolate(frame, [28, 40], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const markIn = interpolate(frame, [30, 44], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });
  const markSettle = interpolate(frame, [30, 44], [1.14, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 1.1, 0.3, 1),
  });
  const wipe = interpolate(frame, [52, 78], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.7, 0.25, 1),
  });
  const tagline = interpolate(frame, [92, 107], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

  const H = LOGO_W / LOGO_AR;
  const logoStyle: React.CSSProperties = {
    position: 'absolute', left: 0, top: 0, width: LOGO_W, height: H, display: 'block',
  };

  return (
    <AbsoluteFill>
      <Stage spotX={50} spotY={30} poolR={660} vignette={0.44}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          {ringOp > 0.01 ? (
            <div
              style={{
                position: 'absolute', width: ringR * 2, height: ringR * 2, borderRadius: '50%',
                border: `${Math.max(0, ringW)}px solid ${T.goldBright}`, opacity: ringOp,
                filter: 'drop-shadow(0 0 24px rgba(217,178,91,.5))',
              }}
            />
          ) : null}

          <div style={{ position: 'relative', width: LOGO_W, height: H }}>
            {/* MT — lands first, with a settle */}
            <div
              style={{
                position: 'absolute', inset: 0, opacity: markIn,
                transform: `scale(${markSettle})`, transformOrigin: `${SPLIT * 50}% 50%`,
                clipPath: `inset(0 ${(1 - SPLIT) * 100}% 0 0)`,
              }}
            >
              <Img src={staticFile(LOGO)} style={logoStyle} />
            </div>
            {/* BEAUTY — wipes in left→right */}
            <div
              style={{
                position: 'absolute', inset: 0,
                clipPath: `inset(0 ${(1 - (SPLIT + (1 - SPLIT) * wipe)) * 100}% 0 ${SPLIT * 100}%)`,
              }}
            >
              <Img src={staticFile(LOGO)} style={logoStyle} />
            </div>
          </div>

          <div
            style={{
              marginTop: 44, fontFamily: heebo, direction: 'rtl',
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
