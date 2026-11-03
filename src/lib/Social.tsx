// Rede social genérica (sem logos reais): feed rolando + ícones orbitando.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from './theme';
import {IcBell, IcHeart, IcPlay} from './Icons';
import {clamp} from './fx';

const Dog = () => (
  <svg viewBox="0 0 200 160" width="100%" height="100%" style={{background: '#F6D9A8'}}>
    <ellipse cx={100} cy={95} rx={52} ry={46} fill="#B07A45" />
    <ellipse cx={58} cy={70} rx={18} ry={34} fill="#7A4E26" transform="rotate(-20 58 70)" />
    <ellipse cx={142} cy={70} rx={18} ry={34} fill="#7A4E26" transform="rotate(20 142 70)" />
    <ellipse cx={100} cy={112} rx={26} ry={20} fill="#E8C9A0" />
    <circle cx={82} cy={88} r={6} fill="#222" />
    <circle cx={118} cy={88} r={6} fill="#222" />
    <ellipse cx={100} cy={104} rx={9} ry={6} fill="#222" />
    <path d="M 100 112 q 0 14 -10 16 M 100 112 q 0 14 10 16" stroke="#222" strokeWidth={3} fill="none" />
    <ellipse cx={100} cy={128} rx={7} ry={9} fill="#E86A7A" />
  </svg>
);
const Recipe = () => (
  <svg viewBox="0 0 200 160" width="100%" height="100%" style={{background: '#FCEBD5'}}>
    <ellipse cx={100} cy={96} rx={70} ry={40} fill="#3B3B3B" />
    <ellipse cx={100} cy={90} rx={60} ry={30} fill="#E8A33A" />
    <circle cx={80} cy={86} r={10} fill="#C94A2E" />
    <circle cx={112} cy={92} r={9} fill="#5A9B3A" />
    <circle cx={124} cy={80} r={7} fill="#C94A2E" />
    <rect x={166} y={88} width={34} height={10} rx={5} fill="#3B3B3B" />
    <path d="M 80 50 q 6 -12 0 -24 M 100 46 q 6 -12 0 -24 M 120 50 q 6 -12 0 -24" stroke="#bbb" strokeWidth={4} fill="none" />
  </svg>
);
const Dance: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 4) * 30;
  return (
    <svg viewBox="0 0 200 160" width="100%" height="100%" style={{background: 'linear-gradient(135deg,#B57BFF,#FF7BB5)'}}>
      <circle cx={100} cy={40} r={14} fill="#fff" />
      <rect x={92} y={56} width={16} height={50} rx={8} fill="#fff" />
      <rect x={96} y={60} width={10} height={44} rx={5} fill="#fff" transform={`rotate(${120 + a} 101 62)`} />
      <rect x={96} y={60} width={10} height={44} rx={5} fill="#fff" transform={`rotate(${-120 - a} 101 62)`} />
      <rect x={92} y={100} width={10} height={46} rx={5} fill="#fff" transform={`rotate(${20 + a / 2} 97 102)`} />
      <rect x={100} y={100} width={10} height={46} rx={5} fill="#fff" transform={`rotate(${-20 + a / 2} 105 102)`} />
    </svg>
  );
};

type Post = {kind: 'dog' | 'recipe' | 'dance' | 'beach' | 'promo'; user: string};
const POSTS: Post[] = [
  {kind: 'dog', user: '@amigo.pet'},
  {kind: 'recipe', user: '@receita.facil'},
  {kind: 'dance', user: '@dancinha'},
  {kind: 'beach', user: '@pousadacostadosol'},
  {kind: 'promo', user: '@loja.verao'},
  {kind: 'dog', user: '@cao.feliz'},
  {kind: 'dance', user: '@trend.do.dia'},
  {kind: 'recipe', user: '@doce.caseiro'},
];
const POST_H = 470;

const PostCard: React.FC<{p: Post; liked?: number}> = ({p, liked = 0}) => (
  <div style={{height: POST_H, padding: '14px 0', boxSizing: 'border-box'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 10px'}}>
      <div style={{width: 34, height: 34, borderRadius: '50%', background: p.kind === 'beach' ? C.sol : '#8899AA'}} />
      <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 18, color: '#E8EEF5'}}>{p.user}</div>
    </div>
    <div style={{height: 330, overflow: 'hidden'}}>
      {p.kind === 'dog' ? <Dog /> : p.kind === 'recipe' ? <Recipe /> : p.kind === 'dance' ? <Dance /> : p.kind === 'beach' ? <Img src={staticFile('fotos/piscina.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width: '100%', height: '100%', background: 'linear-gradient(135deg,#43C6AC,#191654)'}} />}
    </div>
    <div style={{display: 'flex', gap: 14, padding: '10px 16px'}}>
      <IcHeart size={38} color={liked > 0.5 ? '#FF4D6D' : '#E8EEF5'} style={{transform: `scale(${1 + Math.sin(Math.min(1, liked) * Math.PI) * 0.6})`}} />
      <IcPlay size={38} color="#E8EEF5" />
      <IcBell size={38} color="#E8EEF5" />
    </div>
  </div>
);

/**
 * Feed infinito. `scroll` = deslocamento em px (contínuo). likeAt = frame em que a foto da praia recebe curtida.
 */
export const Feed: React.FC<{scroll: number; likeAt?: number}> = ({scroll, likeAt = 1e9}) => {
  const f = useCurrentFrame();
  const total = POSTS.length * POST_H;
  const s = ((scroll % total) + total) % total;
  const liked = interpolate(f, [likeAt, likeAt + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0d1117'}}>
      <div style={{transform: `translateY(${-s + 60}px)`}}>
        {[...POSTS, ...POSTS, ...POSTS].map((p, i) => (
          <PostCard key={i} p={p} liked={p.kind === 'beach' ? liked : 0} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: '#0d1117', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 22, color: '#E8EEF5'}}>Rede social</div>
    </AbsoluteFill>
  );
};
export const FEED_BEACH_OFFSET = 3 * POST_H; // posição da foto de praia no feed
export const FEED_TOTAL = POSTS.length * POST_H;

/** ícones genéricos de vídeo, coração e sino girando ao redor, cada vez mais rápido */
export const OrbitIcons: React.FC<{cx: number; cy: number; start: number; accel?: number; r?: number; count?: number; opacity?: number}> = ({cx, cy, start, accel = 1, r = 330, count = 9, opacity = 1}) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - start);
  // ângulo cresce de forma quadrática = aceleração
  const ang = t * 0.01 + t * t * 0.000035 * accel;
  const appear = interpolate(t, [0, 30], [0, 1], clamp);
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const a = ang + (i / count) * Math.PI * 2;
        const rr = r * (0.85 + (i % 3) * 0.12);
        const x = cx + Math.cos(a) * rr * 1.35;
        const y = cy + Math.sin(a) * rr * 0.55;
        const depth = (Math.sin(a) + 1) / 2; // frente/atrás
        const Ic = [IcPlay, IcHeart, IcBell][i % 3];
        const bg = [C.coral, '#FF4D6D', C.sol][i % 3];
        const sz = 70 + depth * 50;
        return (
          <div key={i} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, opacity: appear * opacity * (0.55 + depth * 0.45), transform: `rotate(${Math.sin(f / 10 + i) * 14}deg)`, zIndex: Math.round(depth * 10)}}>
            <Ic size={sz} bg={bg} color="#fff" style={{filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))'}} />
          </div>
        );
      })}
    </>
  );
};
