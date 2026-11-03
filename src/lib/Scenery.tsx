// Cenários ilustrados reutilizáveis (flat 2D com profundidade).
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {clamp, rnd} from './fx';

/** sol com raios girando lentamente */
export const Sun: React.FC<{size?: number; color?: string; rays?: boolean; style?: React.CSSProperties}> = ({size = 400, color = C.solClaro, rays = true, style}) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="-100 -100 200 200" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs>
        <radialGradient id="sunG">
          <stop offset="0%" stopColor="#FFF6C8" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor={C.sol} />
        </radialGradient>
        <radialGradient id="sunHalo">
          <stop offset="0%" stopColor="rgba(255,220,120,0.55)" />
          <stop offset="100%" stopColor="rgba(255,200,80,0)" />
        </radialGradient>
      </defs>
      <circle r={100} fill="url(#sunHalo)" />
      {rays ? (
        <g transform={`rotate(${f * 0.15})`} opacity={0.55}>
          {Array.from({length: 16}).map((_, i) => (
            <path key={i} d="M -5 -52 L 0 -92 L 5 -52 Z" fill={color} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
      ) : null}
      <circle r={46} fill="url(#sunG)" />
    </svg>
  );
};

/** mar ilustrado com faixas de onda animadas */
export const Sea: React.FC<{top: number; colors?: string[]}> = ({top, colors = [C.azulClaro, '#3C93D3', C.mar, C.marProfundo]}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {colors.map((c, i) => {
        const y = top + i * 70;
        const ph = f * (0.025 + i * 0.01) + i;
        let d = `M -20 1100 L -20 ${y}`;
        for (let x = -20; x <= 1960; x += 30) d += ` L ${x} ${y + Math.sin(x / (120 + i * 30) + ph) * (6 + i * 3)}`;
        d += ' L 1960 1100 Z';
        return <path key={i} d={d} fill={c} />;
      })}
      {/* brilhos do sol na água */}
      {Array.from({length: 26}).map((_, i) => {
        const x = 700 + rnd(i) * 520;
        const y = top + 20 + rnd(i + 50) * 260;
        const tw = 0.5 + 0.5 * Math.sin(f / 9 + i * 2.1);
        return <rect key={'s' + i} x={x} y={y} width={30 + rnd(i + 9) * 60} height={4} rx={2} fill="#FFF3C0" opacity={0.15 + tw * 0.45} />;
      })}
    </svg>
  );
};

/** fundo oceano profundo com bokeh desfocado (profundidade de campo) */
export const DeepBg: React.FC<{tint?: string}> = ({tint = C.marProfundo}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #1E5C9E 0%, ${tint} 55%, #081F3D 100%)`}}>
      <AbsoluteFill>
        {Array.from({length: 14}).map((_, i) => {
          const x = rnd(i * 3) * 1920 + Math.sin(f / 140 + i) * 40;
          const y = rnd(i * 3 + 1) * 1080 + Math.cos(f / 170 + i) * 30;
          const r = 60 + rnd(i * 3 + 2) * 140;
          return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 3 === 0 ? 'radial-gradient(circle, rgba(245,184,0,0.2), rgba(245,184,0,0) 70%)' : 'radial-gradient(circle, rgba(91,180,229,0.26), rgba(91,180,229,0) 70%)'}} />;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** folha de coqueiro em silhueta no primeiro plano (desfocada = profundidade) */
export const PalmLeaf: React.FC<{x: number; y: number; rot: number; scale?: number; blur?: number; color?: string; opacity?: number}> = ({x, y, rot, scale = 1, blur = 6, color = '#0E4A24', opacity = 0.9}) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 45 + x) * 2.5;
  return (
    <svg width={900} height={500} viewBox="0 0 900 500" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot + sway}deg) scale(${scale})`, transformOrigin: '0 50%', filter: `blur(${blur}px)`, opacity}}>
      <path d="M 0 250 Q 450 170 880 260" stroke={color} strokeWidth={14} fill="none" />
      {Array.from({length: 22}).map((_, i) => {
        const t = (i + 1) / 23;
        const px = t * 860;
        const py = 250 - Math.sin(t * Math.PI) * 70 + t * 10;
        const len = 230 * Math.sin(t * Math.PI * 0.95 + 0.15);
        return (
          <g key={i}>
            <path d={`M ${px} ${py} q ${len * 0.3} ${-len * 0.6} ${len * 0.75} ${-len * 0.8}`} stroke={color} strokeWidth={22 - t * 10} fill="none" strokeLinecap="round" />
            <path d={`M ${px} ${py} q ${len * 0.3} ${len * 0.5} ${len * 0.8} ${len * 0.65}`} stroke={color} strokeWidth={22 - t * 10} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

/** logo da pousada */
export const Logo: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 300, style}) => (
  <Img src={staticFile('logo.png')} style={{width: size, height: size, borderRadius: '50%', boxShadow: '0 20px 50px rgba(0,0,0,0.35)', ...style}} />
);

/** card de vidro fosco (estilo das artes da pousada) */
export const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.86)',
      borderRadius: 34,
      border: '2px solid rgba(255,255,255,0.8)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** céu do amanhecer que esquenta ao longo de p (0..1) */
export const DawnSky: React.FC<{p: number}> = ({p}) => {
  const top = interpolate(p, [0, 1], [0, 1], clamp);
  const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * top)).join(',')})`;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${mix([40, 52, 110], [70, 150, 220])} 0%, ${mix([200, 110, 120], [140, 200, 240])} 45%, ${mix([255, 170, 90], [255, 220, 150])} 70%, ${mix([255, 200, 120], [255, 236, 190])} 100%)`,
      }}
    />
  );
};
