// S1 · spotlight-hero-card (references/shots/opening/spotlight-hero-card.md)
// Reference implementation: demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx
//
// Timing skeleton is lifted verbatim from the demo — these are the tuned values
// the card marks as load-bearing, so they are NOT re-derived:
//   roving spotlight waypoints 4/8/16/22/28 → lock 48
//   pool 620→420→360 @ 22/32/48 · lock pulse 32→36→41 · vignette .16→.34→.42
//   rise 48→58 (overshoot ease) · hover 58→112 (40f sin bob, amp 4) ·
//   reseat 112→130 · beam lap1 60→74 fast+bright, lap2 80→100 slow+weak,
//   trail fades 100→112
//
// ADAPTATION: the demo runs a rounded-rect perimeter beam around a UI card. A
// rectangle traced around a bottle reads as a box, not as light, so the same two
// laps are expressed as a vertical specular sweep across the glass — identical
// metaphor (scan / inspect), identical timing, correct for a physical object.
import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { Flacon, Contact } from '../lib/Flacon';
import { Caption } from '../lib/Caption';

export const S1_DUR = 139;

const POP_EASE = Easing.bezier(0.2, 1.25, 0.3, 1);
const RESEAT_EASE = Easing.bezier(0.4, 0, 0.3, 1.05);
const SPOT_EASE = Easing.bezier(0.4, 0, 0.3, 1);

const BOTTLE_W = 580;

export const S1Hero: React.FC<{ src?: string }> = ({ src }) => {
  const frame = useCurrentFrame();

  const macroIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  // roving spotlight → locks on the bottle
  const spotX = interpolate(frame, [4, 8, 16, 22, 28, 48], [25, 25, 70, 42, 50, 50], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SPOT_EASE,
  });
  const spotY = interpolate(frame, [4, 8, 16, 22, 28, 48], [18, 18, 30, 40, 34, 30], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SPOT_EASE,
  });
  const poolBase = interpolate(frame, [22, 32, 48], [620, 420, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SPOT_EASE,
  });
  const poolPulse = interpolate(frame, [32, 36, 41], [0, 0.06, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const vignette = interpolate(frame, [22, 32, 48], [0.16, 0.34, 0.42], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // rise → hover (sin bob) → reseat
  const rise = interpolate(frame, [48, 58], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: POP_EASE,
  });
  const reseat = interpolate(frame, [112, 130], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: RESEAT_EASE,
  });
  const lift = rise * (1 - reseat);
  const bob = Math.sin(((frame - 58) / 40) * Math.PI * 2) * 4 * lift;
  const y = -110 * lift + bob;
  const press = interpolate(frame, [126, 129, 130], [1, 0.997, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // slow camera push, riding the whole shot
  const zoom = interpolate(frame, [0, 48, 138], [1.0, 1.13, 1.17], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.35, 0, 0.2, 1),
  });

  // two-lap light sweep across the glass (see ADAPTATION above)
  const lap1On = frame >= 59 && frame <= 75;
  const lap2On = frame >= 79 && frame <= 101;
  const lap1 = interpolate(frame, [60, 74], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });
  const lap2 = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.4, 1),
  });
  const trail = interpolate(frame, [100, 112], [0.35, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sweepP = lap1On ? lap1 : lap2On ? lap2 : -1;
  const sweepStrength = lap1On ? 1 : 0.62;

  return (
    <AbsoluteFill style={{ opacity: macroIn }}>
      <Stage
        spotX={spotX}
        spotY={spotY}
        poolR={poolBase * (1 + poolPulse)}
        vignette={vignette}
      >
        <AbsoluteFill
          style={{
            alignItems: 'center', justifyContent: 'flex-start', paddingTop: 380,
            transform: `scale(${zoom})`, transformOrigin: '50% 42%',
          }}
        >
          <div style={{ position: 'relative', transform: `translateY(${y}px) scale(${press})` }}>
            <Flacon src={src} w={BOTTLE_W} glow={0.55 + 0.45 * lift + trail} />
            {/* Two-lap light sweep. A masked overlay div does NOT work here:
                mask-image on a <div> is not honoured by the headless renderer,
                so the effect painted the cut-out's bounding box as a bright
                rectangle. Instead a brightened COPY of the artwork is clipped
                to a travelling horizontal band — the copy carries the product's
                own alpha, so the light can only land on the glass. */}
            {sweepP >= 0 && src ? (
              <Img
                src={staticFile(src)}
                style={{
                  position: 'absolute', left: 0, top: 0, width: BOTTLE_W, display: 'block',
                  filter: `brightness(${1 + 1.05 * sweepStrength}) saturate(1.15) contrast(1.05)`,
                  clipPath: `inset(${Math.max(0, sweepP * 116 - 14)}% 0 ${Math.max(0, 100 - sweepP * 116)}% 0)`,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
            <Contact w={BOTTLE_W} opacity={0.35 + 0.65 * (1 - lift)} />
          </div>
        </AbsoluteFill>
      </Stage>

      <Caption
        kicker="בשמי דובאי"
        lines={[{ text: 'הריח נשאר.' }, { text: 'המחיר לא.', gold: true }]}
        start={62}
      />
    </AbsoluteFill>
  );
};
