// Shared ground for every shot: warm near-black marble + one directed gold cone.
// This is the "אור על זכוכית" direction — it must look identical across cuts so
// the film reads as one lit room rather than five separate scenes.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { T } from '../theme';

export const Stage: React.FC<{
  spotX?: number; spotY?: number; poolR?: number; vignette?: number; children?: React.ReactNode;
}> = ({ spotX = 50, spotY = 26, poolR = 620, vignette = 0.34, children }) => (
  <AbsoluteFill style={{ backgroundColor: T.ground }}>
    {/* marble body: warm gradient + soft veining (never hard streaks — they
        read as lens scratches, which killed the first styleframe pass) */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg,#1D1610 0%,#151009 44%,${T.groundDeep} 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        opacity: 0.055,
        filter: 'blur(3px)',
        background:
          'radial-gradient(38% 12% at 22% 68%, rgba(244,237,225,.9), transparent 70%),' +
          'radial-gradient(30% 8% at 74% 78%, rgba(244,237,225,.7), transparent 72%),' +
          'radial-gradient(26% 7% at 44% 86%, rgba(244,237,225,.6), transparent 74%)',
      }}
    />
    {/* the cone */}
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(${poolR}px ${poolR * 0.82}px at ${spotX}% ${spotY}%, ` +
          `rgba(232,188,94,.30), rgba(232,188,94,.06) 48%, transparent 72%)`,
        pointerEvents: 'none',
      }}
    />
    {children}
    {/* floor falloff + vignette, painted last so it sits over the subject */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(11,9,6,0) 52%, rgba(11,9,6,.62) 78%, rgba(8,6,4,.96) 100%)`,
        pointerEvents: 'none',
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 74% at 50% 40%, transparent 42%, rgba(6,5,3,${vignette}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  </AbsoluteFill>
);
