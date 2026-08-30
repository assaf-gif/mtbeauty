import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { SHOTS, T, TOTAL } from './theme';
import { Plate } from './shots/Plate';
import { S1Hero } from './shots/S1Hero';
import { S2Sweep } from './shots/S2Sweep';
import { S4Price } from './shots/S4Price';
import { S5Logo } from './shots/S5Logo';

// Assets live in public/brand/. Each shot has a sensible default, so passing
// nothing renders the real film; override here to swap products.
export type Assets = {
  hero?: string;  // cut-out pack shot for the hero shot
  plate?: string; // plate swept in the range shot
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
const A = SHOTS.sprayHer.from;
const B = SHOTS.hero.from;
const C = SHOTS.sprayHim.from;
const D = SHOTS.range.from;
const E = SHOTS.offer.from;
const F = SHOTS.price.from;
const G = SHOTS.logo.from;

// `dur` matters more than it looks. Several library cues are far longer than
// the beat they mark — impact-cine-big is 8 seconds, riser-cine and swoosh-slow
// are 5 — so left untrimmed they bleed across cuts and two of them overlap.
// Every cue is therefore held only as long as its action, with a short fade so
// the truncation never clicks. Durations below are in frames.
type Cue = { from: number; src: string; volume: number; dur?: number; note: string };
const FADE = 7; // frames of fade-out at the tail of a trimmed cue

const SFX: Cue[] = [
  // A — her hand, the spray, the mist blooming in gold light
  { from: A + 0,   src: 'riser-cine',            volume: 0.20, dur: 56,  note: 'bed under the open' },
  { from: A + 20,  src: 'air-woosh-quick',       volume: 0.34, dur: 20,  note: 'the spray itself — leads the bloom by 6f, as sound does in life' },
  { from: A + 22,  src: 'stardust-swish',        volume: 0.20, dur: 40,  note: 'the mist hanging in the light' },
  { from: A + 96,  src: 'swoosh-slow',           volume: 0.22, dur: 22,  note: 'lead into the cut' },

  // B — the bottle: lifts, light scans the glass, settles
  { from: B + 2,   src: 'riser-cine',            volume: 0.24, dur: 118, note: 'spotlight searching' },
  { from: B + 46,  src: 'air-woosh-deep',        volume: 0.36, dur: 60,  note: 'bottle lifts off its mark' },
  { from: B + 59,  src: 'shimmer-sparkle-sweep', volume: 0.28, dur: 58,  note: 'light sweep, lap 1 (fast, bright)' },
  { from: B + 79,  src: 'sparkle-touch',         volume: 0.16, dur: 46,  note: 'light sweep, lap 2 (slower, weaker)' },
  { from: B + 128, src: 'transition-soft',       volume: 0.24, dur: 24,  note: 'bottle reseats' },

  // C — his hand, the second spray
  { from: C + 0,   src: 'transition-snap',       volume: 0.28, dur: 18,  note: 'cut' },
  { from: C + 14,  src: 'air-woosh-quick',       volume: 0.36, dur: 20,  note: 'his spray' },
  { from: C + 16,  src: 'stardust-swish',        volume: 0.18, dur: 36,  note: 'mist' },
  { from: C + 82,  src: 'swoosh-quick',          volume: 0.22, dur: 20,  note: 'lead into the range' },

  // D — one continuous pass of light across the range
  { from: D + 0,   src: 'swoosh-slow',           volume: 0.28, dur: 34,  note: 'cut into the sweep' },
  { from: D + 4,   src: 'light-transition-magic',volume: 0.22, dur: 130, note: 'the travelling head' },

  // E — the offer: four bottles land in light
  { from: E + 0,   src: 'transition-tech',       volume: 0.28, dur: 34,  note: 'cut into the offer' },
  { from: E + 18,  src: 'sparkle-poof-hit',      volume: 0.26, dur: 40,  note: 'the four arrive' },
  { from: E + 22,  src: 'light-aura',            volume: 0.16, dur: 90,  note: 'the offer settles' },

  // F — the number is computed, not flown in; the clock sounds say so
  { from: F + 0,   src: 'transition-snap',       volume: 0.30, dur: 18,  note: 'cut into the price' },
  { from: F + 1,   src: 'clock-knob-spin',       volume: 0.26, note: 'digits spinning' },
  { from: F + 20,  src: 'clock-knob-spin',       volume: 0.22, note: 'still spinning (the sample is only 24f)' },
  { from: F + 42,  src: 'clock-tick-single',     volume: 0.28, note: 'first digit locks' },
  { from: F + 49,  src: 'clock-tick-single',     volume: 0.34, note: 'second digit locks' },
  { from: F + 50,  src: 'impact-cine-big',       volume: 0.42, dur: 90,  note: 'lock pulse — the number lands' },

  // G — ring collapses to the mark, wordmark completes, tagline settles
  { from: G + 0,   src: 'whoosh-big',            volume: 0.32, dur: 40,  note: 'ring collapses' },
  { from: G + 30,  src: 'sparkle-poof-hit',      volume: 0.28, dur: 40,  note: 'MT mark lands' },
  { from: G + 52,  src: 'sweep-fast',            volume: 0.22, dur: 34,  note: 'BEAUTY wipes in' },
  { from: G + 92,  src: 'light-aura',            volume: 0.18, note: 'tagline settles into the hold' },
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
    <Sequence from={SHOTS.sprayHer.from} durationInFrames={SHOTS.sprayHer.dur}>
      <Plate
        src="brand/spray-her.png"
        focus={{ x: 52, y: 20 }} hit={26} cover={0.82} anchor={44}
        push={[1.0, 1.10]} drift={[10, -10]}
        kicker="בשמי דובאי"
        lines={[{ text: 'הריח נשאר.' }]}
        captionStart={40}
      />
    </Sequence>

    <Sequence from={SHOTS.hero.from} durationInFrames={SHOTS.hero.dur}>
      <S1Hero src={assets.hero} />
    </Sequence>

    <Sequence from={SHOTS.sprayHim.from} durationInFrames={SHOTS.sprayHim.dur}>
      <Plate
        src="brand/spray-him.png"
        focus={{ x: 46, y: 22 }} hit={20} cover={0.74} anchor={44}
        push={[1.05, 1.0]} drift={[-10, 10]}
        lines={[{ text: 'המחיר לא.', gold: true }]}
        captionStart={14}
      />
    </Sequence>

    <Sequence from={SHOTS.range.from} durationInFrames={SHOTS.range.dur}>
      <S2Sweep plate={assets.plate ?? 'brand/plate-range.png'} />
    </Sequence>

    <Sequence from={SHOTS.offer.from} durationInFrames={SHOTS.offer.dur}>
      <Plate
        src="brand/plate-four.png"
        focus={{ x: 50, y: 46 }} hit={22} cover={1.32} anchor={40}
        push={[1.0, 1.1]}
        kicker="הבאנדל"
        lines={[{ text: '4 בשמים' }, { text: 'ב־100 ₪', gold: true }]}
        captionStart={22}
        size={98}
      />
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
