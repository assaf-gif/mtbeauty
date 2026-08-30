import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { SHOTS, T, TOTAL } from './theme';
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

// ---------------------------------------------------------------------------
// SOUND
//
// Sound is a TIMELINE asset, not a shot asset: every cue is pinned here, and no
// shot component contains audio code. That is what makes a re-pin survivable
// when the picture moves.
//
// Vocabulary is the product-promo set — whoosh / impact / riser / sparkle /
// transition, plus the mechanical clock sounds the odometer earns. No synth
// pluck/bloop: those read as a mobile game, which is the one note the skill's
// reference records a user killing a whole pass over.
//
// BGM sits at 0.34 to leave headroom for the cues, and is wrapped by the `bgm`
// input prop so the same timeline renders a music-free version with the SFX
// intact (`--props=props-nobgm.json`).
// ---------------------------------------------------------------------------
const S1 = SHOTS.hero.from;
const S2 = SHOTS.sweep.from;
const S3 = SHOTS.deal.from;
const S4 = SHOTS.price.from;
const S5 = SHOTS.logo.from;

// `dur` matters more than it looks. Several library cues are far longer than
// the beat they mark — impact-cine-big is 8 seconds, riser-cine and swoosh-slow
// are 5 — so left untrimmed they bleed across cuts and two of them overlap.
// Every cue is therefore held only as long as its action, with a short fade so
// the truncation never clicks. Durations below are in frames.
type Cue = { from: number; src: string; volume: number; dur?: number; note: string };
const FADE = 7; // frames of fade-out at the tail of a trimmed cue

const SFX: Cue[] = [
  // S1 — spotlight finds the bottle, it lifts, light scans the glass, it settles
  { from: S1 + 2,   src: 'riser-cine',            volume: 0.26, dur: 146, note: 'roving spotlight: bed under the search, resolves on the cut' },
  { from: S1 + 46,  src: 'air-woosh-deep',        volume: 0.38, dur: 60,  note: 'bottle lifts off its mark' },
  { from: S1 + 59,  src: 'shimmer-sparkle-sweep', volume: 0.30, dur: 58,  note: 'light sweep, lap 1 (fast, bright)' },
  { from: S1 + 79,  src: 'sparkle-touch',         volume: 0.17, dur: 46,  note: 'light sweep, lap 2 (slower, weaker)' },
  { from: S1 + 128, src: 'transition-soft',       volume: 0.26, dur: 20,  note: 'bottle reseats' },

  // S2 — one continuous pass of light across the bundle plate
  { from: S2,       src: 'swoosh-slow',           volume: 0.30, dur: 34, note: 'cut into the sweep' },
  { from: S2 + 4,   src: 'light-transition-magic',volume: 0.22, dur: 92, note: 'the travelling head itself' },

  // S3 — anticipation, then three cards dealt on an accelerating gap
  { from: S3,       src: 'transition-snap',       volume: 0.32, note: 'cut into the deal' },
  { from: S3 + 14,  src: 'riser-cine',            volume: 0.22, dur: 46, note: 'anticipation: stack presses, top card pulls back' },
  { from: S3 + 30,  src: 'swoosh-quick',          volume: 0.30, note: 'card 1 leaves the stack' },
  { from: S3 + 37,  src: 'swoosh-quick',          volume: 0.30, note: 'card 2' },
  { from: S3 + 41,  src: 'swoosh-quick',          volume: 0.30, note: 'card 3' },
  { from: S3 + 48,  src: 'hit-fast-exciting',     volume: 0.26, dur: 26, note: 'card 1 lands' },
  { from: S3 + 55,  src: 'hit-fast-exciting',     volume: 0.30, dur: 26, note: 'card 2 lands' },
  { from: S3 + 59,  src: 'impact-cine-big',       volume: 0.40, dur: 44, note: 'card 3 lands — board full, energy peak; tail resolves before the cut' },

  // S4 — the number is computed, not flown in; the clock sounds say so
  { from: S4,       src: 'transition-tech',       volume: 0.30, dur: 38, note: 'cut into the price' },
  { from: S4 + 1,   src: 'clock-knob-spin',       volume: 0.26, note: 'digits spinning' },
  { from: S4 + 20,  src: 'clock-knob-spin',       volume: 0.22, note: 'digits still spinning (the sample is only 24f)' },
  { from: S4 + 42,  src: 'clock-tick-single',     volume: 0.28, note: 'first digit locks' },
  { from: S4 + 49,  src: 'clock-tick-single',     volume: 0.34, note: 'second digit locks' },
  { from: S4 + 50,  src: 'impact-cine-big',       volume: 0.42, dur: 66, note: 'lock pulse — the number lands, tail resolves before the cut' },

  // S5 — ring collapses to the mark, wordmark completes, tagline settles
  { from: S5,       src: 'whoosh-big',            volume: 0.32, dur: 40, note: 'ring collapses' },
  { from: S5 + 30,  src: 'sparkle-poof-hit',      volume: 0.28, dur: 40, note: 'MT mark lands' },
  { from: S5 + 52,  src: 'sweep-fast',            volume: 0.22, dur: 34, note: 'BEAUTY wipes in' },
  { from: S5 + 92,  src: 'light-aura',            volume: 0.18, note: 'tagline settles into the hold — runs out under the end' },
];

const Bgm: React.FC = () => {
  const frame = useCurrentFrame();
  // 1s fade in, ~1.7s fade out, held at 0.34 between
  const volume = interpolate(frame, [0, 30, TOTAL - 50, TOTAL], [0, 0.34, 0.34, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return <Audio src={staticFile('audio/bgm.mp3')} volume={volume} />;
};

// One cue. When trimmed, the last few frames ramp to zero so cutting the sample
// short never produces a click.
const Cued: React.FC<{ src: string; volume: number; dur?: number }> = ({ src, volume, dur }) => {
  const frame = useCurrentFrame();
  const v = dur
    ? volume * interpolate(frame, [dur - FADE, dur], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
    : volume;
  return <Audio src={staticFile(`audio/sfx/${src}.mp3`)} volume={v} />;
};

export const Main: React.FC<{ assets?: Assets; bgm?: boolean }> = ({ assets = {}, bgm = true }) => (
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

    {bgm ? <Bgm /> : null}
    {SFX.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.dur}>
        <Cued src={c.src} volume={c.volume} dur={c.dur} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
