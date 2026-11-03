import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions, Film, win} from './fx';
import {FPS} from './theme';
import {scene, SCENES} from './timeline';

/** cena completa: conteúdo + acabamento de cinema + narração + legendas */
export const Shell: React.FC<{id: string; children: React.ReactNode; warm?: number; music?: boolean}> = ({id, children, warm = 1, music = false}) => {
  const s = scene(id);
  const {id: comp} = useVideoConfig();
  const withMusic = music || comp !== 'Main'; // composições isoladas tocam a trilha no ponto certo
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {children}
      <Film warm={warm} />
      <Captions captions={s.captions} offset={s.leadIn} />
      <Sequence from={Math.round(s.leadIn * FPS)} layout="none">
        <Audio src={staticFile(`audio/narracao/${id}.wav`)} />
      </Sequence>
      {withMusic ? <MusicBed startAt={s.from} /> : null}
    </AbsoluteFill>
  );
};

const dB = (x: number) => Math.pow(10, x / 20);
/** volume da trilha no frame global g: −22 dB sob a voz, −12 dB nas pausas, abertura e final */
export const musicVolume = (g: number, total: number) => {
  const t = g / FPS;
  let duck = 0; // 0 = aberto, 1 = sob a voz
  for (const s of SCENES) {
    const a = s.from / FPS + s.leadIn;
    const b = a + s.narr;
    // rampa de 0,5 s antes da voz entrar e 0,8 s depois que ela sai
    const d = t < a - 0.5 ? 0 : t < a ? (t - (a - 0.5)) / 0.5 : t <= b ? 1 : t < b + 0.8 ? 1 - (t - b) / 0.8 : 0;
    duck = Math.max(duck, d);
  }
  const level = dB(-12) * (1 - duck) + dB(-22) * duck;
  const fadeIn = Math.min(1, t / 2);
  const fadeOut = Math.min(1, Math.max(0, (total / FPS - t) / 3));
  return level * fadeIn * fadeOut;
};

export const MusicBed: React.FC<{startAt?: number}> = ({startAt = 0}) => {
  const total = SCENES.reduce((a, s) => a + s.frames, 0);
  return <Audio src={staticFile('audio/trilha.mp3')} startFrom={startAt} volume={(f) => musicVolume(f + startAt, total)} />;
};

/** mostra o conteúdo entre os frames a e b com fade cruzado */
export const Seg: React.FC<{a: number; b: number; d?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({a, b, d = 14, children, style}) => {
  const f = useCurrentFrame();
  if (f < a - 1 || f > b + 1) return null;
  return <AbsoluteFill style={{opacity: win(f, a, b, d), ...style}}>{children}</AbsoluteFill>;
};

/** efeito sonoro posicionado em um frame da cena */
export const Sfx: React.FC<{at: number; src: string; vol?: number}> = ({at, src, vol = 0.5}) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(`audio/sfx/${src}`)} volume={vol} />
  </Sequence>
);
