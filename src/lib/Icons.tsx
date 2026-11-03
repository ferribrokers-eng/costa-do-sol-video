// Ícones genéricos (sem logos reais de plataformas).
import React from 'react';
import {C} from './theme';

type P = {size?: number; color?: string; bg?: string; style?: React.CSSProperties};
const Wrap: React.FC<P & {children: React.ReactNode}> = ({size = 120, bg, style, children}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible', ...style}}>
    {bg ? <circle cx={50} cy={50} r={50} fill={bg} /> : null}
    {children}
  </svg>
);

export const IcPlay: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M 40 30 L 72 50 L 40 70 Z" fill={color} strokeLinejoin="round" stroke={color} strokeWidth={6} />
  </Wrap>
);
export const IcHeart: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M50 78 C 20 58 18 40 26 32 C 34 24 46 26 50 36 C 54 26 66 24 74 32 C 82 40 80 58 50 78 Z" fill={color} />
  </Wrap>
);
export const IcBell: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M50 22 C 36 22 32 34 32 46 L 32 60 L 24 70 L 76 70 L 68 60 L 68 46 C 68 34 64 22 50 22 Z" fill={color} />
    <circle cx={50} cy={77} r={7} fill={color} />
  </Wrap>
);
export const IcSearch: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <circle cx={44} cy={44} r={18} fill="none" stroke={color} strokeWidth={8} />
    <path d="M 58 58 L 74 74" stroke={color} strokeWidth={9} strokeLinecap="round" />
  </Wrap>
);
export const IcHouse: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M 22 50 L 50 26 L 78 50 L 78 78 L 22 78 Z" fill={color} strokeLinejoin="round" stroke={color} strokeWidth={4} />
    <rect x={43} y={56} width={14} height={22} rx={2} fill={p.bg ?? C.mar} />
  </Wrap>
);
export const IcChat: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M 22 30 Q 22 22 30 22 L 70 22 Q 78 22 78 30 L 78 58 Q 78 66 70 66 L 42 66 L 28 78 L 30 66 Q 22 66 22 58 Z" fill={color} />
    <circle cx={38} cy={44} r={4.5} fill={p.bg ?? C.coqueiro} />
    <circle cx={50} cy={44} r={4.5} fill={p.bg ?? C.coqueiro} />
    <circle cx={62} cy={44} r={4.5} fill={p.bg ?? C.coqueiro} />
  </Wrap>
);
export const IcCheck: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M 28 52 L 44 67 L 74 35" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </Wrap>
);
export const IcGlobe: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <circle cx={50} cy={50} r={26} fill="none" stroke={color} strokeWidth={6} />
    <ellipse cx={50} cy={50} rx={11} ry={26} fill="none" stroke={color} strokeWidth={5} />
    <path d="M 24 50 L 76 50" stroke={color} strokeWidth={5} />
  </Wrap>
);
export const IcPin: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M50 82 C 34 62 28 52 28 42 C 28 29 38 20 50 20 C 62 20 72 29 72 42 C 72 52 66 62 50 82 Z" fill={color} />
    <circle cx={50} cy={42} r={9} fill={p.bg ?? C.mar} />
  </Wrap>
);
export const IcPhone: React.FC<P> = ({color = '#fff', ...p}) => (
  <Wrap {...p}>
    <path d="M 34 24 L 44 24 L 50 38 L 43 44 Q 48 56 57 61 L 63 54 L 76 60 L 76 70 Q 74 78 64 77 Q 34 72 25 38 Q 25 26 34 24 Z" fill={color} />
  </Wrap>
);
export const IcStar: React.FC<P & {fill?: number}> = ({color = C.sol, fill = 1, size = 60, style}) => {
  const id = React.useId();
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor={color} />
          <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>
      </defs>
      <path d="M50 6 L62 37 L95 38 L69 59 L78 92 L50 73 L22 92 L31 59 L5 38 L38 37 Z" fill={`url(#${id})`} stroke="rgba(150,100,0,0.35)" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
};

export const Stars: React.FC<{value: number; size?: number; gap?: number}> = ({value, size = 56, gap = 6}) => (
  <div style={{display: 'flex', gap}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <IcStar key={i} size={size} fill={Math.max(0, Math.min(1, value - i))} />
    ))}
  </div>
);

/** gota brilhante (cliente) */
export const Drop: React.FC<{size?: number; gold?: boolean; style?: React.CSSProperties}> = ({size = 40, gold, style}) => (
  <svg viewBox="0 0 40 52" width={size} height={(size * 52) / 40} style={{overflow: 'visible', ...style}}>
    <path d="M20 2 C 28 16 36 26 36 34 C 36 44 28 50 20 50 C 12 50 4 44 4 34 C 4 26 12 16 20 2 Z" fill={gold ? C.sol : C.azulClaro} />
    <path d="M13 30 C 13 25 16 21 18 18" stroke="rgba(255,255,255,0.85)" strokeWidth={4} fill="none" strokeLinecap="round" />
    <circle cx={20} cy={30} r={22} fill={gold ? 'rgba(245,184,0,0.25)' : 'rgba(91,180,229,0.18)'} />
  </svg>
);
