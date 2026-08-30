import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SHOTS, T } from './theme';
import { S1Hero } from './shots/S1Hero';
import { S2Sweep } from './shots/S2Sweep';
import { S3Deal } from './shots/S3Deal';
import { S4Price } from './shots/S4Price';
import { S5Logo } from './shots/S5Logo';

// Real cut-outs drop into public/brand/ and get named here. Until then every
// shot falls back to its CSS stand-in — nothing else in the film changes.
export type Assets = {
  hero?: string;
  sweep?: (string | undefined)[];
  cartons?: (string | undefined)[];
};

export const Main: React.FC<{ assets?: Assets }> = ({ assets = {} }) => (
  <AbsoluteFill style={{ backgroundColor: T.ground }}>
    <Sequence from={SHOTS.hero.from} durationInFrames={SHOTS.hero.dur}>
      <S1Hero src={assets.hero} />
    </Sequence>
    <Sequence from={SHOTS.sweep.from} durationInFrames={SHOTS.sweep.dur}>
      <S2Sweep srcs={assets.sweep} />
    </Sequence>
    <Sequence from={SHOTS.deal.from} durationInFrames={SHOTS.deal.dur}>
      <S3Deal srcs={assets.cartons} />
    </Sequence>
    <Sequence from={SHOTS.price.from} durationInFrames={SHOTS.price.dur}>
      <S4Price />
    </Sequence>
    <Sequence from={SHOTS.logo.from} durationInFrames={SHOTS.logo.dur}>
      <S5Logo />
    </Sequence>
  </AbsoluteFill>
);
