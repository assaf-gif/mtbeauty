// The product. ONE swap point for the whole film:
//   <Flacon src="brand/cobra.png" />  → renders the real cut-out pack shot
//   <Flacon />                        → renders the CSS stand-in
// Everything else (camera, light, timing, captions) is asset-independent, so
// dropping real cut-outs into public/brand/ finishes the film without touching
// a single shot file.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { T } from '../theme';

export type FlaconProps = {
  src?: string;          // path under public/, e.g. "brand/cobra.png"
  w?: number;            // rendered width in px
  glow?: number;         // 0..1 — rim/edge light intensity
  style?: React.CSSProperties;
};

export const FLACON_W = 300;
export const FLACON_H = 470;

export const Flacon: React.FC<FlaconProps> = ({ src, w = FLACON_W, glow = 1, style }) => {
  const s = w / FLACON_W;
  if (src) {
    return (
      <div style={{ position: 'relative', width: w, ...style }}>
        <Img
          src={staticFile(src)}
          style={{
            width: w, display: 'block',
            filter: `drop-shadow(0 ${26 * s}px ${44 * s}px rgba(0,0,0,.6))`,
          }}
        />
        {/* warm edge light so a cut-out sits in the same room as the stage */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 * glow,
            background: `linear-gradient(96deg, rgba(255,255,255,.16) 0%, transparent 22%, transparent 78%, rgba(232,188,94,.28) 100%)`,
            mixBlendMode: 'screen',
          }}
        />
      </div>
    );
  }

  // ---- CSS stand-in: black matte flacon, sculpted gold cap (COBRA-shaped) ----
  return (
    <div style={{ position: 'relative', width: w, height: FLACON_H * s, ...style }}>
      {/* cap */}
      <div
        style={{
          position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)',
          width: 118 * s, height: 132 * s,
          borderRadius: `${58 * s}px ${20 * s}px ${8 * s}px ${8 * s}px`,
          background: `linear-gradient(96deg,#7A5010,${T.goldBright} 38%,#F0D492 52%,#A06D1C 76%,#6E480E)`,
          boxShadow: `0 ${8 * s}px ${20 * s}px rgba(0,0,0,.6), inset 0 ${2 * s}px ${3 * s}px rgba(255,240,200,.8)`,
        }}
      />
      {/* collar */}
      <div
        style={{
          position: 'absolute', left: '50%', top: 126 * s, transform: 'translateX(-50%)',
          width: 96 * s, height: 26 * s, borderRadius: 3 * s,
          background: `linear-gradient(96deg,#6E480E,${T.goldBright} 45%,#8A5C14)`,
        }}
      />
      {/* body — matte black hexagonal */}
      <div
        style={{
          position: 'absolute', left: '50%', top: 148 * s, transform: 'translateX(-50%)',
          width: 262 * s, height: 318 * s,
          clipPath: 'polygon(12% 0%,88% 0%,100% 14%,100% 92%,92% 100%,8% 100%,0% 92%,0% 14%)',
          background:
            `linear-gradient(96deg, rgba(244,237,225,.16) 0%, rgba(244,237,225,.05) 10%,` +
            ` #17120D 32%, #100C08 58%, rgba(232,188,94,.10) 84%, rgba(244,237,225,.20) 96%, rgba(244,237,225,.03) 100%)`,
          boxShadow: `inset 0 ${-40 * s}px ${60 * s}px rgba(6,4,3,.8), 0 ${26 * s}px ${44 * s}px rgba(0,0,0,.62)`,
        }}
      >
        {/* gold nameplate */}
        <div
          style={{
            position: 'absolute', left: '50%', top: '34%', transform: 'translateX(-50%)',
            width: 128 * s, height: 108 * s, borderRadius: 3 * s,
            background: `linear-gradient(150deg,${T.goldBright},${T.goldDeep})`,
            boxShadow: `0 ${3 * s}px ${8 * s}px rgba(0,0,0,.5)`,
          }}
        />
      </div>
      {/* specular strip + gold rim, gated by `glow` */}
      <div
        style={{
          position: 'absolute', left: '50%', top: 160 * s, marginLeft: -110 * s,
          width: 15 * s, height: 292 * s, borderRadius: 8 * s, opacity: glow,
          background: 'linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.24) 42%,rgba(255,255,255,.04))',
          filter: `blur(${0.8 * s}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute', left: '50%', top: 158 * s, marginLeft: 96 * s,
          width: 8 * s, height: 296 * s, borderRadius: 5 * s, opacity: glow,
          background: `linear-gradient(180deg,rgba(232,188,94,.9),rgba(232,188,94,.12))`,
          filter: `blur(${1.4 * s}px)`,
        }}
      />
    </div>
  );
};

// Contact shadow — sold separately so shots can fade it as the bottle lifts.
export const Contact: React.FC<{ w: number; opacity?: number }> = ({ w, opacity = 1 }) => (
  <div
    style={{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      bottom: -14, width: w * 1.24, height: w * 0.17, borderRadius: '50%', opacity,
      background: 'radial-gradient(50% 50%, rgba(0,0,0,.88), transparent 72%)',
      filter: 'blur(10px)',
    }}
  />
);
