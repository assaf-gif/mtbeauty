import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SHOTS, T } from './theme';
import { S1Hero } from './shots/S1Hero';
import { S2Sweep } from './shots/S2Sweep';
import { S3Deal } from './shots/S3Deal';
import { S4Price } from './shots/S4Price';
import { S5Logo } from './shots/S5Logo';

// Assets live in public/brand/. Each shot has a sensible default, so passing
// nothing renders the real film; override here to swap products.
export type Assets = {
  hero?: string;    // cut-out pack shot for S1
  plate?: string;   // bundle plate swept in S2
  cards?: string[]; // offer creatives dealt in S3
};

export const Main: React.FC<{ assets?: Assets }> = ({ assets = {} }) => (
  <AbsoluteFill style={{ backgroundColor: T.ground }}>
    <Sequence from={SHOTS.hero.from} durationInFrames={SHOTS.hero.dur}>
      <S1Hero src={assets.hero} />
    </Sequence>
    <Sequence from={SHOTS.sweep.from} durationInFrames={SHOTS.sweep.dur}>
      <S2Sweep plate={assets.plate} />
    </Sequence>
    <Sequence from={SHOTS.deal.from} durationInFrames={SHOTS.deal.dur}>
      <S3Deal cards={assets.cards} />
    </Sequence>
    <Sequence from={SHOTS.price.from} durationInFrames={SHOTS.price.dur}>
      <S4Price />
    </Sequence>
    <Sequence from={SHOTS.logo.from} durationInFrames={SHOTS.logo.dur}>
      <S5Logo />
    </Sequence>
  </AbsoluteFill>
);
