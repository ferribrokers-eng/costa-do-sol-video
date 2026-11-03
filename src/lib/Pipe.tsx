// Metáfora central: cano de vidro azul levando gotas (clientes) do Google até a pousada.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from './theme';
import {Drop, IcHouse, IcSearch} from './Icons';
import {clamp, rnd} from './fx';

export const PIPE_PTS: [number, number][] = [
  [250, 430],
  [600, 430],
  [600, 660],
  [1080, 660],
  [1080, 430],
  [1560, 430],
];
// posição dos 4 furos (fração do comprimento total)
export const HOLE_T = [0.25, 0.43, 0.6, 0.82];

const segs = PIPE_PTS.slice(1).map((p, i) => {
  const a = PIPE_PTS[i];
  return {a, b: p, len: Math.hypot(p[0] - a[0], p[1] - a[1])};
});
const TOTAL = segs.reduce((s, x) => s + x.len, 0);
export const pointAt = (t: number): [number, number] => {
  let d = Math.max(0, Math.min(1, t)) * TOTAL;
  for (const s of segs) {
    if (d <= s.len) return [s.a[0] + ((s.b[0] - s.a[0]) * d) / s.len, s.a[1] + ((s.b[1] - s.a[1]) * d) / s.len];
    d -= s.len;
  }
  return PIPE_PTS[PIPE_PTS.length - 1];
};
const D = 'M ' + PIPE_PTS.map((p) => p.join(' ')).join(' L ');

export type PipeProps = {
  openAt?: number[]; // frame em que cada furo abre (1e9 = fechado)
  sealAt?: number[]; // frame em que cada furo é selado
  labels?: string[]; // rótulo de cada furo
  labelAt?: number[];
  sealLabels?: string[];
  flowStart?: number;
  highlight?: number; // índice do furo em destaque
  showEnds?: boolean;
};

export const Pipe: React.FC<PipeProps> = ({openAt = [], sealAt = [], labels = [], labelAt = [], sealLabels = [], flowStart = 0, highlight = -1, showEnds = true}) => {
  const f = useCurrentFrame();
  const isOpen = (h: number, fr: number) => fr >= (openAt[h] ?? 1e9) && fr < (sealAt[h] ?? 1e9);
  const SPEED = 1 / 210; // fração por frame
  const SPAWN = 5; // nova gota a cada N frames
  const drops: React.ReactNode[] = [];
  const first = Math.floor((f - flowStart - 1 / SPEED) / SPAWN);
  const last = Math.floor((f - flowStart) / SPAWN);
  let arrived = 0;
  for (let i = Math.max(0, first); i <= last; i++) {
    const born = flowStart + i * SPAWN;
    const t = (f - born) * SPEED;
    if (t < 0 || t > 1) continue;
    // a gota vaza no primeiro furo aberto que ela atravessa
    let leaked = -1;
    for (let h = 0; h < HOLE_T.length; h++) {
      const passF = born + HOLE_T[h] / SPEED;
      if (t >= HOLE_T[h] && isOpen(h, passF) && rnd(i * 7 + h * 131) < 0.42) {
        leaked = h;
        break;
      }
    }
    if (leaked >= 0) {
      const passF = born + HOLE_T[leaked] / SPEED;
      const dt = f - passF;
      const [hx, hy] = pointAt(HOLE_T[leaked]);
      const vx = (rnd(i * 3 + 1) - 0.5) * 3;
      const y = hy + 10 + 0.32 * dt * dt * 0.5 + dt * 1.5;
      if (y > 1150) continue;
      drops.push(
        <div key={i} style={{position: 'absolute', left: hx + vx * dt - 14, top: y, opacity: interpolate(dt, [0, 50], [1, 0.2], clamp)}}>
          <Drop size={26} />
        </div>,
      );
      continue;
    }
    const [x, y] = pointAt(t);
    if (t > 0.97) arrived++;
    drops.push(
      <div key={i} style={{position: 'absolute', left: x - 13, top: y - 18 + Math.sin(i * 1.7) * 6}}>
        <Drop size={26} />
      </div>,
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="pipeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <path d={D} stroke="rgba(0,0,0,0.25)" strokeWidth={96} fill="none" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 18)" filter="url(#pipeGlow)" />
        <path d={D} stroke={C.mar} strokeWidth={92} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={D} stroke="#2F86CF" strokeWidth={74} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={D} stroke="rgba(10,40,80,0.55)" strokeWidth={62} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={D} stroke="rgba(255,255,255,0.28)" strokeWidth={8} fill="none" strokeLinejoin="round" transform="translate(0 -24)" />
      </svg>
      {drops}
      {/* furos */}
      {HOLE_T.map((ht, h) => {
        const [x, y] = pointAt(ht);
        const o = interpolate(f, [openAt[h] ?? 1e9, (openAt[h] ?? 1e9) + 12], [0, 1], clamp);
        const s = interpolate(f, [sealAt[h] ?? 1e9, (sealAt[h] ?? 1e9) + 14], [0, 1], clamp);
        const la = interpolate(f, [labelAt[h] ?? openAt[h] ?? 1e9, (labelAt[h] ?? openAt[h] ?? 1e9) + 14], [0, 1], clamp);
        const hl = highlight === h ? 1 : highlight >= 0 ? 0.45 : 1;
        if (o <= 0) return null;
        const vertical = Math.abs(pointAt(ht - 0.01)[0] - pointAt(ht + 0.01)[0]) < 1;
        return (
          <React.Fragment key={h}>
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <g transform={`translate(${x} ${y}) rotate(${vertical ? 90 : 0})`} opacity={o * (1 - s)}>
                <g transform={`translate(0 34) scale(${0.5 + o * 0.5})`}>
                  <ellipse rx={30} ry={13} fill="rgba(255,255,255,0.35)" />
                  <ellipse rx={25} ry={10} fill="#06142a" />
                  <path d="M -25 0 L -36 -6 M 25 0 L 37 5 M -10 8 L -14 18 M 12 -8 L 16 -17" stroke="rgba(255,255,255,0.6)" strokeWidth={3} strokeLinecap="round" />
                </g>
              </g>
              {s > 0 ? (
                <g transform={`translate(${x} ${y + (vertical ? 0 : 30)})`}>
                  <circle r={70 * s} fill="rgba(245,184,0,0.35)" opacity={1 - s * 0.5} />
                  <rect x={vertical ? -52 : -46} y={vertical ? -46 : -40} width={vertical ? 104 : 92} height={vertical ? 92 : 80} rx={18} fill={C.sol} transform={`scale(${s})`} stroke="#fff" strokeWidth={5} />
                  <text x={0} y={16} textAnchor="middle" fontFamily={F.titulo} fontWeight={800} fontSize={44} fill={C.marinho} transform={`scale(${s})`}>
                    {h + 1}
                  </text>
                </g>
              ) : null}
            </svg>
            {labels[h] && la > 0 && s < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: x - 220,
                  width: 440,
                  top: vertical ? y - 210 : y + 80,
                  textAlign: 'center',
                  opacity: la * hl * (1 - s),
                  transform: `translateY(${(1 - la) * 20}px)`,
                }}
              >
                <span style={{background: C.marinho, color: '#fff', fontFamily: F.texto, fontWeight: 700, fontSize: 30, padding: '10px 22px', borderRadius: 14, border: `3px solid ${C.sol}`, display: 'inline-block'}}>
                  {labels[h]}
                </span>
              </div>
            ) : null}
            {sealLabels[h] && s > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: x - 230,
                  width: 460,
                  top: vertical ? (h === 0 ? y - 330 : y - 330) : y + 110,
                  textAlign: 'center',
                  opacity: s,
                  transform: `translateY(${(1 - s) * 20}px)`,
                }}
              >
                <span style={{background: '#fff', color: C.marinho, fontFamily: F.texto, fontWeight: 700, fontSize: 28, padding: '10px 22px', borderRadius: 14, boxShadow: `0 0 0 4px ${C.sol}, 0 12px 30px rgba(0,0,0,0.3)`, display: 'inline-block'}}>
                  {sealLabels[h]}
                </span>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {showEnds ? (
        <>
          <div style={{position: 'absolute', left: 70, top: 330, width: 200, textAlign: 'center'}}>
            <IcSearch size={150} bg={C.branco} color={C.mar} style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'}} />
            <div style={{fontFamily: F.texto, fontWeight: 700, color: '#fff', fontSize: 30, marginTop: 6}}>Busca no Google</div>
          </div>
          <div style={{position: 'absolute', left: 1580, top: 300, width: 260, textAlign: 'center'}}>
            <div style={{transform: `scale(${1 + Math.min(arrived, 3) * 0.03})`}}>
              <IcHouse size={230} bg={C.sol} color="#fff" style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'}} />
            </div>
            <div style={{fontFamily: F.texto, fontWeight: 700, color: '#fff', fontSize: 30, marginTop: 4}}>Pousada</div>
          </div>
        </>
      ) : null}
    </div>
  );
};
