// Personagem fixa "Marina": ~30 anos, cabelo cacheado preso, camiseta amarela.
// Ilustração flat 2D com sombras suaves. Mesmo visual em todas as cenas.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from './theme';

const SKIN = '#9A6142';
const SKIN_SH = '#7E4C33';
const HAIR = '#2A1A12';
const HAIR_HI = '#4A3022';
const SHIRT = C.sol;
const SHIRT_SH = '#D99A00';
const JEANS = '#2F5288';
const JEANS_SH = '#243F6B';

export type ArmPose = {a1: number; a2: number}; // ângulos em graus (0 = para baixo)
export type MarinaProps = {
  legs?: 'stand' | 'walk' | 'sofa' | 'none';
  left?: ArmPose; // braço do lado esquerdo da tela
  right?: ArmPose;
  phone?: 'left' | 'right' | 'none';
  phoneGlow?: number; // 0..1 brilho da tela do celular no rosto
  smile?: number; // -1 (preocupada) .. 1 (sorriso)
  look?: number; // -1..1 olhar horizontal
  lookY?: number;
  headTilt?: number;
  blinkSeed?: number;
  suitcase?: boolean;
  walkSpeed?: number;
};

const Curls: React.FC<{cx: number; cy: number; r: number; n: number; rr: number; seed?: number; fill?: string}> = ({cx, cy, r, n, rr, seed = 1, fill = HAIR}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + seed;
      const k = 0.85 + ((i * 37 + seed * 11) % 10) / 30;
      return <circle key={i} cx={cx + Math.cos(a) * r * k} cy={cy + Math.sin(a) * r * k} r={rr * (0.85 + ((i * 13) % 7) / 20)} fill={fill} />;
    })}
  </g>
);

const Arm: React.FC<{x: number; y: number; pose: ArmPose; side: 1 | -1; phone?: boolean; glow?: number}> = ({x, y, pose, side, phone, glow = 0}) => {
  const L1 = 92;
  const L2 = 86;
  return (
    <g transform={`translate(${x} ${y}) rotate(${pose.a1 * side})`}>
      <rect x={-13} y={0} width={26} height={L1 + 8} rx={13} fill={SKIN} />
      <g transform={`translate(0 ${L1}) rotate(${pose.a2 * side})`}>
        <rect x={-12} y={-6} width={24} height={L2 + 6} rx={12} fill={SKIN} />
        <circle cx={0} cy={L2 + 4} r={15} fill={SKIN} />
        {phone ? (
          <g transform={`translate(${-side * 2} ${L2 - 8}) rotate(${-pose.a2 * side - pose.a1 * side})`}>
            <rect x={-19} y={-34} width={38} height={66} rx={7} fill="#1B2430" />
            <rect x={-16} y={-30} width={32} height={58} rx={5} fill={`rgba(140, 200, 255, ${0.55 + glow * 0.45})`} />
            <rect x={-12} y={-24} width={24} height={14} rx={3} fill="rgba(255,255,255,0.55)" />
            <rect x={-12} y={-6} width={18} height={4} rx={2} fill="rgba(255,255,255,0.5)" />
            <rect x={-12} y={2} width={22} height={4} rx={2} fill="rgba(255,255,255,0.4)" />
          </g>
        ) : null}
      </g>
      {/* manga da camiseta */}
      <path d="M -22 -6 Q 0 -14 22 -6 L 19 46 Q 0 52 -19 46 Z" fill={SHIRT} />
      <path d="M -19 40 Q 0 50 19 40 L 19 46 Q 0 52 -19 46 Z" fill={SHIRT_SH} />
    </g>
  );
};

export const Head: React.FC<{smile?: number; look?: number; lookY?: number; blinkSeed?: number; glow?: number}> = ({smile = 0.6, look = 0, lookY = 0, blinkSeed = 0, glow = 0}) => {
  const f = useCurrentFrame();
  const cyc = (f + blinkSeed * 37) % 117;
  const blink = cyc < 4 ? 0.15 : 1;
  const ex = look * 4;
  const ey = lookY * 3;
  const m = smile;
  return (
    <g>
      {/* cabelo de trás + coque cacheado */}
      <Curls cx={200} cy={118} r={52} n={16} rr={20} seed={0.3} />
      <circle cx={200} cy={120} r={56} fill={HAIR} />
      <Curls cx={200} cy={46} r={22} n={9} rr={15} seed={1.1} />
      <circle cx={200} cy={46} r={24} fill={HAIR} />
      <Curls cx={200} cy={44} r={16} n={6} rr={8} seed={2} fill={HAIR_HI} />
      <rect x={176} y={66} width={48} height={10} rx={5} fill={C.coral} />
      {/* pescoço */}
      <rect x={186} y={160} width={28} height={40} rx={10} fill={SKIN_SH} />
      {/* orelhas e brincos */}
      <ellipse cx={153} cy={132} rx={8} ry={12} fill={SKIN} />
      <ellipse cx={247} cy={132} rx={8} ry={12} fill={SKIN} />
      <circle cx={153} cy={150} r={6} fill="none" stroke={C.dourado} strokeWidth={3} />
      <circle cx={247} cy={150} r={6} fill="none" stroke={C.dourado} strokeWidth={3} />
      {/* rosto */}
      <ellipse cx={200} cy={128} rx={46} ry={52} fill={SKIN} />
      <ellipse cx={212} cy={150} rx={30} ry={22} fill={SKIN_SH} opacity={0.18} />
      {/* brilho do celular no rosto */}
      {glow > 0 ? <ellipse cx={200} cy={150} rx={40} ry={34} fill="#9BD3FF" opacity={0.16 * glow} style={{filter: 'blur(8px)'}} /> : null}
      {/* franja cacheada */}
      <path d="M 156 112 Q 158 70 200 70 Q 242 70 244 112 Q 230 86 200 84 Q 170 86 156 112 Z" fill={HAIR} />
      <circle cx={162} cy={96} r={10} fill={HAIR} />
      <circle cx={238} cy={96} r={10} fill={HAIR} />
      <circle cx={178} cy={80} r={11} fill={HAIR} />
      <circle cx={222} cy={80} r={11} fill={HAIR} />
      <circle cx={200} cy={75} r={11} fill={HAIR} />
      {/* sobrancelhas */}
      <path d={`M ${174 + ex} ${110 - m * 2} q 9 -6 18 0`} stroke={HAIR} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={`M ${208 + ex} ${110 - m * 2} q 9 -6 18 0`} stroke={HAIR} strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* olhos */}
      <ellipse cx={183 + ex} cy={127 + ey} rx={5} ry={6.5 * blink} fill="#1A110C" />
      <ellipse cx={217 + ex} cy={127 + ey} rx={5} ry={6.5 * blink} fill="#1A110C" />
      <circle cx={185 + ex} cy={125 + ey} r={1.6} fill="#fff" opacity={blink > 0.5 ? 1 : 0} />
      <circle cx={219 + ex} cy={125 + ey} r={1.6} fill="#fff" opacity={blink > 0.5 ? 1 : 0} />
      {/* bochechas */}
      <ellipse cx={172} cy={146} rx={9} ry={5} fill="#E07A6A" opacity={0.35} />
      <ellipse cx={228} cy={146} rx={9} ry={5} fill="#E07A6A" opacity={0.35} />
      {/* nariz e boca */}
      <path d="M 200 132 q -4 10 2 12" stroke={SKIN_SH} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={`M 186 ${157} Q 200 ${157 + m * 12} 214 ${157}`} stroke="#5A2A1E" strokeWidth={4} fill={m > 0.4 ? '#7A2E22' : 'none'} strokeLinecap="round" />
    </g>
  );
};

/** Marina completa. viewBox 400x720 (pés em y≈700). */
export const Marina: React.FC<MarinaProps & {style?: React.CSSProperties; width?: number}> = ({
  legs = 'stand',
  left = {a1: 8, a2: 0},
  right = {a1: 8, a2: 0},
  phone = 'none',
  phoneGlow = 0,
  smile = 0.6,
  look = 0,
  lookY = 0,
  headTilt = 0,
  blinkSeed = 0,
  suitcase = false,
  walkSpeed = 1,
  style,
  width = 400,
}) => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 22) * 1.6;
  const walkPh = (f / 7) * walkSpeed;
  const bob = legs === 'walk' ? Math.abs(Math.sin(walkPh)) * -8 : 0;
  const swing = legs === 'walk' ? Math.sin(walkPh) * 13 : 0;
  return (
    <svg
      viewBox="0 0 400 720"
      width={width}
      height={(width * 720) / 400}
      style={{overflow: 'visible', ...(legs === 'none' ? {WebkitMaskImage: 'linear-gradient(180deg, #000 48%, transparent 58%)', maskImage: 'linear-gradient(180deg, #000 48%, transparent 58%)'} : {}), ...style}}
    >
      <defs>
        <radialGradient id="mShadow">
          <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      {legs === 'stand' || legs === 'walk' ? <ellipse cx={200} cy={705} rx={120} ry={16} fill="url(#mShadow)" /> : null}
      <g transform={`translate(0 ${bob})`}>
        {/* pernas */}
        {legs === 'stand' || legs === 'walk' ? (
          <g>
            <g transform={`rotate(${swing} 178 380)`}>
              <rect x={156} y={370} width={44} height={300} rx={20} fill={JEANS} />
              <ellipse cx={172} cy={680} rx={30} ry={14} fill="#F4F1EA" />
            </g>
            <g transform={`rotate(${-swing} 222 380)`}>
              <rect x={200} y={370} width={44} height={300} rx={20} fill={JEANS_SH} />
              <ellipse cx={230} cy={680} rx={30} ry={14} fill="#E9E4DA" />
            </g>
          </g>
        ) : null}
        {legs === 'sofa' ? (
          <g>
            <rect x={190} y={330} width={330} height={48} rx={22} fill={JEANS} />
            <rect x={200} y={370} width={310} height={44} rx={20} fill={JEANS_SH} />
            <ellipse cx={530} cy={352} rx={16} ry={26} fill={SKIN} />
            <ellipse cx={520} cy={394} rx={16} ry={24} fill={SKIN_SH} />
          </g>
        ) : null}
        {/* tronco */}
        <g transform={`translate(0 ${breathe})`}>
          <path d="M 140 214 Q 200 190 260 214 L 256 380 Q 200 392 144 380 Z" fill={SHIRT} />
          <path d="M 144 350 Q 200 362 256 350 L 256 380 Q 200 392 144 380 Z" fill={SHIRT_SH} />
          <path d="M 178 200 Q 200 222 222 200" stroke={SHIRT_SH} strokeWidth={6} fill="none" />
          {legs !== 'none' ? <rect x={146} y={372} width={108} height={30} rx={10} fill={JEANS} /> : null}
          {/* braços */}
          <Arm x={146} y={222} pose={left} side={1} phone={phone === 'left'} glow={phoneGlow} />
          <Arm x={254} y={222} pose={right} side={-1} phone={phone === 'right'} glow={phoneGlow} />
          <g transform={`rotate(${headTilt} 200 190)`}>
            <Head smile={smile} look={look} lookY={lookY} blinkSeed={blinkSeed} glow={phoneGlow} />
          </g>
        </g>
      </g>
      {suitcase ? (
        <g transform={`translate(300 ${520 + bob * 0.5})`}>
          <rect x={30} y={-90} width={8} height={100} rx={4} fill="#5B6670" />
          <rect x={0} y={0} width={110} height={150} rx={18} fill={C.coral} />
          <rect x={0} y={0} width={110} height={150} rx={18} fill="none" stroke="#C4583A" strokeWidth={6} />
          <rect x={48} y={10} width={14} height={130} rx={7} fill="#F6C9A8" opacity={0.6} />
          <circle cx={20} cy={158} r={10} fill="#333" />
          <circle cx={90} cy={158} r={10} fill="#333" />
        </g>
      ) : null}
    </svg>
  );
};
