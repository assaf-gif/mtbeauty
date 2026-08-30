// RTL Hebrew caption. Word-by-word rise with a short blur-off — the entrance
// the site's own typography can carry without turning into an effect of its own.
// Sits bottom-right (RTL reading start) and never overlaps the product stage.
import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { T } from '../theme';
import { fontFamily as heebo } from '@remotion/google-fonts/Heebo';

export const Caption: React.FC<{
  lines: { text: string; gold?: boolean }[];
  kicker?: string;
  sub?: string;
  start: number;        // frame the entrance begins
  out?: number;         // frame the exit begins (omit = stays)
  size?: number;
}> = ({ lines, kicker, sub, start, out, size = 96 }) => {
  const frame = useCurrentFrame();
  const exit = out === undefined ? 1 : interpolate(frame, [out, out + 10], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const at = (i: number) => {
    const s = start + i * 6;
    return interpolate(frame, [s, s + 14], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      easing: Easing.bezier(0.2, 0.8, 0.25, 1),
    });
  };

  const kick = interpolate(frame, [start - 8, start + 4], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        // bottom 320px keeps text clear of the caption/CTA chrome TikTok and
        // Reels paint over the lower ~15% of a 1920-tall frame.
        position: 'absolute', right: 80, bottom: 320, left: 80,
        direction: 'rtl', textAlign: 'right', fontFamily: heebo, opacity: exit,
      }}
    >
      {kicker ? (
        <div style={{ opacity: kick }}>
          <div style={{ fontSize: 28, fontWeight: 400, letterSpacing: '.36em', color: T.muted }}>
            {kicker}
          </div>
          <div
            style={{
              width: 88, height: 2, marginTop: 24, marginRight: 0, marginLeft: 'auto',
              background: `linear-gradient(270deg, ${T.goldBright}, rgba(201,162,39,0))`,
              transform: `scaleX(${kick})`, transformOrigin: 'right center',
            }}
          />
        </div>
      ) : null}

      <div style={{ marginTop: kicker ? 40 : 0 }}>
        {lines.map((l, i) => {
          const p = at(i);
          return (
            <div
              key={i}
              style={{
                fontSize: size, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-.015em',
                color: l.gold ? T.goldBright : T.cream,
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`,
                filter: `blur(${(1 - p) * 5}px)`,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>

      {sub ? (
        <div
          style={{
            marginTop: 30, fontSize: 38, fontWeight: 300, color: T.muted,
            opacity: at(lines.length),
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
