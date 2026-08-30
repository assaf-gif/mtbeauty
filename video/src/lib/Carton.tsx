// Product carton stand-in — navy box, gold keyline, gold monogram panel.
// Same swap contract as Flacon: pass `src` to use a real cut-out pack shot.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { T } from '../theme';

export const Carton: React.FC<{ src?: string; w?: number }> = ({ src, w = 210 }) => {
  const h = w * 1.62;
  if (src) {
    return (
      <Img
        src={staticFile(src)}
        style={{ width: w, display: 'block', filter: `drop-shadow(0 18px 34px rgba(0,0,0,.6))` }}
      />
    );
  }
  return (
    <div
      style={{
        width: w, height: h, position: 'relative', borderRadius: 3,
        background: 'linear-gradient(104deg,#0F1524 0%,#141C30 40%,#0C1120 100%)',
        boxShadow: '0 18px 34px rgba(0,0,0,.6), inset 0 0 0 1px rgba(232,188,94,.10)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: w * 0.055, border: `1px solid ${T.gold}`, opacity: 0.75 }} />
      <div
        style={{
          position: 'absolute', left: '50%', top: '16%', transform: 'translateX(-50%)',
          width: w * 0.5, height: w * 0.5, borderRadius: 4,
          background: `linear-gradient(150deg, rgba(90,130,190,.55), rgba(20,32,56,.9))`,
          boxShadow: `inset 0 0 0 1px rgba(232,188,94,.5)`,
        }}
      />
      {/* wordmark bar + spec lines — reads as a carton face at a glance */}
      <div
        style={{
          position: 'absolute', left: '50%', bottom: '26%', transform: 'translateX(-50%)',
          width: w * 0.56, height: w * 0.045, background: T.gold, opacity: 0.85, borderRadius: 1,
        }}
      />
      <div
        style={{
          position: 'absolute', left: '50%', bottom: '20%', transform: 'translateX(-50%)',
          width: w * 0.34, height: w * 0.022, background: T.muted, opacity: 0.55, borderRadius: 1,
        }}
      />
      <div
        style={{
          position: 'absolute', left: '50%', bottom: '14%', transform: 'translateX(-50%)',
          width: w * 0.24, height: w * 0.018, background: T.muted, opacity: 0.35, borderRadius: 1,
        }}
      />
      {/* sheen */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(104deg, rgba(255,255,255,.16) 0%, transparent 26%, transparent 74%, rgba(255,255,255,.08) 100%)',
        }}
      />
    </div>
  );
};
