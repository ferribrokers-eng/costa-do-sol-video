// Linha do tempo: duração de cada cena = respiro inicial + narração + respiro final (≥1,5 s),
// arredondada para cima até o próximo COMPASSO da trilha (4 batidas a 124 BPM),
// para que todas as transições caiam no tempo forte da música.
import timings from '../narration-timings.json';
import beat from '../beat.json';
import {FPS} from './theme';

export type Caption = {text: string; start: number; end: number};
export type SceneTiming = {
  id: string;
  from: number; // frame inicial na composição Main
  frames: number; // duração em frames
  leadIn: number; // s antes da narração começar
  narr: number; // duração da narração (s)
  captions: Caption[]; // tempos relativos ao início da narração
};

const BAR = 4 * beat.T;

// respiro antes da fala (s) e hold extra no fim (s) — planos de respiro
const LEAD: Record<string, number> = {Scene01: 6.2, Scene02: 2.4, Scene03: 1.8, Scene04: 1.6, Scene05: 2.0, Scene06: 1.6, Scene07: 1.6, Scene08: 1.8, Scene09: 1.8, Scene10: 2.0, Scene11: 1.6};
const TAIL: Record<string, number> = {Scene01: 2.0, Scene02: 1.8, Scene03: 1.8, Scene04: 1.6, Scene05: 1.8, Scene06: 1.6, Scene07: 1.8, Scene08: 2.2, Scene09: 2.4, Scene10: 2.4, Scene11: 9.5};

const t = timings as Record<string, {duration: number; captions: Caption[]}>;
let acc = 0;
export const SCENES: SceneTiming[] = Object.keys(t).map((id) => {
  const lead = LEAD[id] ?? 1.5;
  const tail = Math.max(1.5, TAIL[id] ?? 1.5);
  const raw = lead + t[id].duration + tail;
  const startSec = acc;
  const endSec = Math.ceil((startSec + raw) / BAR - 1e-6) * BAR;
  acc = endSec;
  const from = Math.round(startSec * FPS);
  return {
    id,
    from,
    frames: Math.round(endSec * FPS) - from,
    leadIn: lead,
    narr: t[id].duration,
    captions: t[id].captions,
  };
});

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0);
export const scene = (id: string) => SCENES.find((s) => s.id === id)!;
export const beatT = beat.T;
/** frame (relativo à cena) do início da legenda i */
export const capF = (s: SceneTiming, i: number) => Math.round((s.leadIn + s.captions[Math.min(i, s.captions.length - 1)].start) * FPS);
export const capEndF = (s: SceneTiming, i: number) => Math.round((s.leadIn + s.captions[Math.min(i, s.captions.length - 1)].end) * FPS);
/** índice da primeira legenda que começa com o texto dado (robusto a mudanças de quebra) */
export const capIdx = (s: SceneTiming, startsWith: string) => {
  const i = s.captions.findIndex((c) => c.text.startsWith(startsWith));
  if (i < 0) throw new Error(`${s.id}: legenda não encontrada: ${startsWith}`);
  return i;
};
export const at = (s: SceneTiming, startsWith: string) => capF(s, capIdx(s, startsWith));
