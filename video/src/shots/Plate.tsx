// A still plate given life: slow dolly, a bloom that swells where the action is,
// and a light that settles. Used for the two spray shots and the offer beat.
//
// Honest about what this is — these are photographs, not footage. A push and a
// bloom read as "camera moving through a lit room"; they cannot invent motion
// that was never shot. The spray plumes carry the shot because the plume is
// already in the frame; the bloom just makes the light around it breathe.
import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Stage } from '../lib/Stage';
import { Caption } from '../lib/Caption';
import { T } from '../theme';

export type PlateProps = {
  src: string;
  /** where the action is, in % of the plate — the bloom centres here */
  focus?: { x: number; y: number };
  /** frame the bloom peaks on */
  hit?: number;
  /** plate width as a fraction of frame width at the start of the push */
  cover?: number;
  /** vertical placement of the plate's centre, in % of frame height */
  anchor?: number;
  push?: [number, number];
  drift?: [number, number];
  kicker?: string;
  lines?: { text: string; gold?: boolean }[];
  sub?: string;
  captionStart?: number;
  size?: number;
};

export const Plate: React.FC<PlateProps> = ({
  src, focus = { x: 50, y: 40 }, hit = 18, cover = 1.5, anchor = 42,
  push = [1, 1.14], drift = [0, 0], kicker, lines, sub, captionStart = 16, size = 92,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 120], push, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.3, 0, 0.35, 1),
  });
  const dx = interpolate(frame, [0, 120], drift, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear,
  });
  // bloom: swells to the hit, then decays — the light around the spray, breathing
  const bloom = interpolate(frame, [hit - 14, hit, hit + 34], [0, 1, 0.18], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.9, 0.3, 1),
  });
  const lift = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Stage spotX={focus.x} spotY={focus.y - 8} poolR={520} vignette={0.5}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute', top: `${anchor}%`, left: '50%',
              width: `${cover * 100}%`,
              transform: `translate(-50%,-50%) translateX(${dx}px) scale(${scale})`,
              opacity: lift,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{ width: '100%', display: 'block', filter: `brightness(${0.86 + 0.22 * bloom})` }}
            />
            <div
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen',
                background:
                  `radial-gradient(34% 30% at ${focus.x}% ${focus.y}%, rgba(217,178,91,${0.34 * bloom}), transparent 72%)`,
              }}
            />
          </div>
        </AbsoluteFill>
      </Stage>

      {lines ? (
        <Caption kicker={kicker} lines={lines} sub={sub} start={captionStart} size={size} />
      ) : null}
    </AbsoluteFill>
  );
};
