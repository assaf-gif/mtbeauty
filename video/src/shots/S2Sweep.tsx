// S2 · spotlight-sweep-moves (references/shots/effects/spotlight-sweep-moves.md)
// Reference implementation: demos/effects/spotlight-sweep-moves/SlideSpotlightPan.tsx
//
// Load-bearing rule from the demo, recorded there as an explicit user ruling:
// "聚光的移动是匀速的" — the spotlight travels at CONSTANT speed. Easing the
// travel kills the effect, so Easing.linear below is deliberate.
//
// The subject is MTBeauty's own bundle plate (bottles on dark marble under a
// gold key light). Its baked lighting already matches this film's direction, so
// the plate is knocked down to near-black and the travelling head brings each
// bottle back up as it passes — lit regions develop, passed regions sink.
import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { T } from '../theme';
import { Caption } from '../lib/Caption';

export const S2_DUR = 100;

const PLATE = 'brand/plate-b100.png';
// The knock-down floor cannot go so low that the plate's own black background
// falls BELOW the stage ground it sits on — at 0.18 it reached rgb(2,2,0)
// against a rgb(25,19,13) ground, and the plate's rectangle edge became
// visible as a seam. 0.30 keeps them in the same family; the ground-coloured
// falloffs below hide what is left of the boundary.
const FLOOR = 0.30;

export const S2Sweep: React.FC<{ plate?: string }> = ({ plate = PLATE }) => {
  const frame = useCurrentFrame();

  // constant-speed traverse, right → left to match Hebrew reading direction
  const head = interpolate(frame, [6, 86], [96, 6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });
  // slow counter-drift so the room breathes under the moving light
  const drift = interpolate(frame, [0, 99], [-26, 26], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });
  const scale = interpolate(frame, [0, 99], [1.16, 1.24], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });

  return (
    <AbsoluteFill>
      <Stage spotX={head} spotY={40} poolR={340} vignette={0.5}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'relative', width: '100%',
              transform: `translateX(${drift}px) scale(${scale})`,
            }}
          >
            {/* knocked-down base */}
            <Img
              src={staticFile(plate)}
              style={{ width: '100%', display: 'block', filter: `brightness(${FLOOR})` }}
            />
            {/* full-brightness copy, revealed only inside the travelling head */}
            <Img
              src={staticFile(plate)}
              style={{
                position: 'absolute', inset: 0, width: '100%', display: 'block',
                WebkitMaskImage:
                  `radial-gradient(38% 62% at ${head}% 50%, #000 0%, rgba(0,0,0,.55) 46%, transparent 78%)`,
                maskImage:
                  `radial-gradient(38% 62% at ${head}% 50%, #000 0%, rgba(0,0,0,.55) 46%, transparent 78%)`,
              }}
            />
            {/* Ground-coloured falloff top and bottom. A landscape plate in a
                vertical frame always leaves a horizontal edge; painting the
                fade (rather than masking it) is what works here, since
                mask-image on a div is ignored by the headless renderer. */}
            <div
              style={{
                position: 'absolute', left: 0, right: 0, top: -1, height: '26%',
                background: `linear-gradient(180deg, ${T.ground} 0%, rgba(20,16,12,.92) 22%, rgba(20,16,12,0) 100%)`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute', left: 0, right: 0, bottom: -1, height: '30%',
                background: `linear-gradient(0deg, ${T.ground} 0%, rgba(20,16,12,.92) 22%, rgba(20,16,12,0) 100%)`,
                pointerEvents: 'none',
              }}
            />
            {/* warm bloom riding just ahead of the head */}
            <div
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen',
                background:
                  `radial-gradient(26% 40% at ${head - 3}% 46%, rgba(217,178,91,.30), transparent 70%)`,
              }}
            />
          </div>
        </AbsoluteFill>
      </Stage>

      <Caption
        kicker="קונים חכם"
        lines={[{ text: 'הבית של' }, { text: 'בשמי דובאי', gold: true }, { text: 'בישראל.' }]}
        start={20}
        size={88}
      />
    </AbsoluteFill>
  );
};
