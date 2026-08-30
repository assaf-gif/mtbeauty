// S2 · spotlight-sweep-moves (references/shots/effects/spotlight-sweep-moves.md)
// Reference implementation: demos/effects/spotlight-sweep-moves/SlideSpotlightPan.tsx
//
// Load-bearing rule from the demo, recorded there as an explicit user ruling:
// "聚光的移动是匀速的" — the spotlight travels at CONSTANT speed. Easing the
// travel kills the effect, so Easing.linear here is deliberate, not an omission.
// Lit subjects develop; subjects the light has left sink back to near-black.
// The card notes A and B may be chained into a tour segment — that is what this
// shot is: one continuous pass revealing three bottles in turn.
import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { Flacon, Contact } from '../lib/Flacon';
import { Caption } from '../lib/Caption';

export const S2_DUR = 100;

const BOTTLES = [
  { x: 22, w: 340, src: undefined as string | undefined },
  { x: 50, w: 430, src: undefined as string | undefined },
  { x: 78, w: 340, src: undefined as string | undefined },
];

export const S2Sweep: React.FC<{ srcs?: (string | undefined)[] }> = ({ srcs = [] }) => {
  const frame = useCurrentFrame();

  // constant-speed traverse, right → left (RTL reading direction)
  const headX = interpolate(frame, [6, 86], [96, 4], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });

  // slow lateral drift so the room breathes under the moving light
  const drift = interpolate(frame, [0, 99], [12, -12], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });

  return (
    <AbsoluteFill>
      <Stage spotX={headX} spotY={38} poolR={430} vignette={0.46}>
        <AbsoluteFill style={{ transform: `translateX(${drift}px)` }}>
          {BOTTLES.map((b, i) => {
            // develop as the head arrives, sink as it leaves
            const d = Math.abs(headX - b.x);
            const litRaw = interpolate(d, [4, 26], [1, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            // never fully black — a hint of form keeps the room readable
            const lit = 0.1 + 0.9 * litRaw;
            const rise = interpolate(litRaw, [0, 1], [16, 0]);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute', left: `${b.x}%`, top: 560,
                  transform: `translateX(-50%) translateY(${rise}px)`,
                }}
              >
                <div style={{ position: 'relative', opacity: lit, filter: `brightness(${0.35 + 0.65 * litRaw})` }}>
                  <Flacon src={srcs[i]} w={b.w} glow={litRaw} />
                  <Contact w={b.w} opacity={0.25 + 0.6 * litRaw} />
                </div>
              </div>
            );
          })}
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
