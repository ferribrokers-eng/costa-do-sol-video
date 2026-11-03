import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './theme';
import type {Caption} from './timeline';

export const eio = Easing.bezier(0.45, 0, 0.2, 1); // ease-in-out cinematográfico
export const eout = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** interpolação com easing entre keyframes [frame, valor] */
export const kf = (f: number, keys: [number, number][], ease = eio) =>
  interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1]), {...clamp, easing: ease});

export const fadeIn = (f: number, start: number, dur = 15) => interpolate(f, [start, start + dur], [0, 1], clamp);
export const fadeOut = (f: number, start: number, dur = 15) => interpolate(f, [start, start + dur], [1, 0], clamp);
export const win = (f: number, a: number, b: number, d = 12) => Math.min(fadeIn(f, a, d), fadeOut(f, b - d, d));

export const usePop = (start: number, damping = 13, stiffness = 140) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}});
};

/** pseudo-aleatório determinístico */
export const rnd = (seed: number) => {
  let t = (seed * 2654435761) >>> 0;
  t += 0x6d2b79f5;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

export type CamKey = {f: number; z?: number; x?: number; y?: number; r?: number};
/**
 * Câmera virtual: keyframes de zoom/pan/rotação com ease-in-out + deriva contínua lenta,
 * garantindo que nenhum plano fique parado.
 */
export const Cam: React.FC<{keys: CamKey[]; children: React.ReactNode; drift?: number}> = ({keys, children, drift = 1}) => {
  const f = useCurrentFrame();
  const fill = (k: keyof CamKey, d: number) => {
    let last = d;
    return keys.map((key) => {
      const v = key[k];
      if (v !== undefined) last = v;
      return [key.f, last] as [number, number];
    });
  };
  const z = kf(f, fill("z", 1)) * (1 + drift * 0.012 * Math.sin(f / 160));
  // limita o pan para nunca revelar as bordas do quadro
  const mx = Math.max(0, 960 * (z - 1) - 2);
  const my = Math.max(0, 540 * (z - 1) - 2);
  const x = Math.max(-mx, Math.min(mx, kf(f, fill('x', 0)) + drift * Math.sin(f / 97) * 6));
  const y = Math.max(-my, Math.min(my, kf(f, fill('y', 0)) + drift * Math.cos(f / 131) * 4));
  const r = kf(f, fill('r', 0));
  return (
    <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${z}) rotate(${r}deg)`, transformOrigin: '50% 50%'}}>
      {children}
    </AbsoluteFill>
  );
};

/** camada com paralaxe: desloca proporcionalmente à profundidade */
export const Layer: React.FC<{depth: number; children: React.ReactNode; blur?: number; style?: React.CSSProperties}> = ({depth, children, blur = 0, style}) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 90) * 14 * depth;
  const dy = Math.cos(f / 120) * 6 * depth;
  return (
    <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px)`, filter: blur ? `blur(${blur}px)` : undefined, ...style}}>
      {children}
    </AbsoluteFill>
  );
};

/** foto real com efeito Ken Burns (zoom + pan lentos) */
export const Photo: React.FC<{
  src: string;
  from?: number;
  dur: number;
  z0?: number;
  z1?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  style?: React.CSSProperties;
  blur?: number;
  pos?: string;
}> = ({src, from = 0, dur, z0 = 1.05, z1 = 1.18, x0 = 0, x1 = -2, y0 = 0, y1 = -1, style, blur = 0, pos = 'center'}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [from, from + dur], [0, 1], {...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1)});
  const z = z0 + (z1 - z0) * p;
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Img
        src={staticFile('fotos/' + (blur ? src.replace('.jpg', '-blur.jpg') : src))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: pos,
          transform: `scale(${z}) translate(${x0 + (x1 - x0) * p}%, ${y0 + (y1 - y0) * p}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** acabamento de cinema: grade quente golden hour, vinheta, granulação */
export const Film: React.FC<{warm?: number; vignette?: number; grain?: number}> = ({warm = 1, vignette = 1, grain = 1}) => {
  const f = useCurrentFrame();
  const g = Math.floor(f / 2) % 8;
  const ox = Math.floor(rnd(f) * 256);
  const oy = Math.floor(rnd(f + 999) * 256);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,70,0.07), rgba(255,150,60,0.04) 60%, rgba(120,60,20,0.08))', opacity: warm}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 20%, rgba(255,215,130,0.12), transparent 55%)', opacity: warm}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(10,8,4,0.55) 120%)', opacity: vignette}} />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(`grain/g${g}.png`)})`,
          backgroundPosition: `${ox}px ${oy}px`,
          opacity: 0.05 * grain,
        }}
      />
    </AbsoluteFill>
  );
};

/** legendas sincronizadas: rodapé, fundo semitransparente, máx. 2 linhas */
export const Captions: React.FC<{captions: Caption[]; offset: number}> = ({captions, offset}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps - offset;
  // divide blocos longos (>90 caracteres) em dois, proporcional ao texto
  const list: Caption[] = [];
  for (const c of captions) {
    if (c.text.length <= 90) {
      list.push(c);
      continue;
    }
    const words = c.text.split(' ');
    let best = 1;
    let bestD = 1e9;
    for (let i = 1; i < words.length; i++) {
      const d = Math.abs(words.slice(0, i).join(' ').length - c.text.length / 2);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const a = words.slice(0, best).join(' ');
    const b = words.slice(best).join(' ');
    const mid = c.start + ((c.end - c.start) * a.length) / c.text.length;
    list.push({text: a, start: c.start, end: mid}, {text: b, start: mid, end: c.end});
  }
  const cur = list.find((c, i) => t >= c.start - 0.05 && t < (list[i + 1] ? Math.min(list[i + 1].start - 0.05, c.end + 0.6) : c.end + 0.6));
  if (!cur) return null;
  const a = interpolate(t, [cur.start - 0.05, cur.start + 0.12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 54, pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 1380,
          padding: '14px 34px 16px',
          borderRadius: 18,
          background: 'rgba(12, 22, 38, 0.72)',
          color: '#fff',
          fontFamily: F.texto,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.32,
          textAlign: 'center',
          opacity: a,
          transform: `translateY(${(1 - a) * 8}px)`,
          textShadow: '0 2px 6px rgba(0,0,0,0.35)',
          letterSpacing: 0.2,
        }}
      >
        {cur.text}
      </div>
    </AbsoluteFill>
  );
};

/** transição em forma de onda azul (sobe cobrindo a tela e sai pelo topo) */
export const WaveWipe: React.FC<{at: number; dur?: number}> = ({at, dur = 30}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at - dur / 2, at + dur / 2], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  const e = Easing.inOut(Easing.cubic)(p);
  const layers = [
    {c: C.azulClaro, d: 0},
    {c: C.mar, d: 0.08},
    {c: C.marProfundo, d: 0.16},
  ];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {layers.map((l, i) => {
          const q = Math.min(1, Math.max(0, e * 1.2 - l.d));
          const top = 1140 - q * 2900; // borda superior sobe de baixo até acima da tela
          const bot = top + 1500; // faixa alta o bastante para cobrir a tela inteira no meio
          const ph = f * 0.2 + i * 1.3;
          let d = '';
          for (let x = -40; x <= 1960; x += 40) d += `${x === -40 ? 'M' : 'L'} ${x} ${top + Math.sin(x / 170 + ph) * 44 + Math.sin(x / 63 + ph * 1.6) * 9} `;
          for (let x = 1960; x >= -40; x -= 40) d += `L ${x} ${bot + Math.sin(x / 150 - ph) * 44} `;
          return <path key={i} d={d + 'Z'} fill={l.c} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** número contando para cima com easing */
export const CountUp: React.FC<{from?: number; to: number; start: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; style?: React.CSSProperties; thousands?: boolean}> = ({
  from = 0,
  to,
  start,
  dur = 40,
  decimals = 0,
  prefix = '',
  suffix = '',
  style,
  thousands = true,
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [start, start + dur], [from, to], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  let s = v.toFixed(decimals).replace('.', ',');
  if (thousands && decimals === 0) s = Math.round(v).toLocaleString('pt-BR');
  return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{prefix + s + suffix}</span>;
};

/** título com entrada em mola */
export const Title: React.FC<{start: number; children: React.ReactNode; style?: React.CSSProperties; end?: number}> = ({start, children, style, end}) => {
  const f = useCurrentFrame();
  const p = usePop(start, 15, 120);
  const out = end !== undefined ? fadeOut(f, end - 12, 12) : 1;
  return (
    <div
      style={{
        fontFamily: F.titulo,
        fontWeight: 800,
        color: '#fff',
        textShadow: '0 6px 24px rgba(0,0,0,0.35)',
        opacity: Math.min(1, p * 1.4) * out,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + p * 0.06})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** pílula de texto (estilo das artes) */
export const Pill: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({children, bg = C.areia, color = C.texto, style}) => (
  <div
    style={{
      display: 'inline-block',
      background: bg,
      color,
      borderRadius: 999,
      padding: '12px 30px',
      fontFamily: F.texto,
      fontWeight: 700,
      fontSize: 34,
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      ...style,
    }}
  >
    {children}
  </div>
);
