import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from './theme';
import {clamp, rnd} from './fx';

/** sala à noite: janela com lua, abajur quente, sofá */
export const NightRoom: React.FC<{sofa?: boolean}> = ({sofa = true}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.noite2} 0%, ${C.noite} 75%)`}}>
      {/* janela */}
      <div style={{position: 'absolute', left: 1320, top: 120, width: 420, height: 380, borderRadius: 18, background: 'linear-gradient(180deg,#0A1430,#1C2F5E)', boxShadow: 'inset 0 0 0 14px #2A3A63'}}>
        {Array.from({length: 22}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 20 + rnd(i) * 370, top: 20 + rnd(i + 40) * 300, width: 4, height: 4, borderRadius: 2, background: '#fff', opacity: 0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i))}} />
        ))}
        <div style={{position: 'absolute', left: 260, top: 60, width: 90, height: 90, borderRadius: '50%', background: '#F3EBC8', boxShadow: '0 0 60px rgba(243,235,200,0.5)'}} />
        <div style={{position: 'absolute', left: 203, top: 14, width: 14, height: 352, background: '#2A3A63'}} />
        <div style={{position: 'absolute', left: 14, top: 183, width: 392, height: 14, background: '#2A3A63'}} />
      </div>
      {/* abajur */}
      <div style={{position: 'absolute', left: 120, top: 250, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,190,100,0.35), rgba(255,190,100,0) 65%)'}} />
      <div style={{position: 'absolute', left: 300, top: 330, width: 160, height: 110, background: '#F2C47A', clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)'}} />
      <div style={{position: 'absolute', left: 374, top: 440, width: 12, height: 420, background: '#3A2E2A'}} />
      <div style={{position: 'absolute', left: 320, top: 850, width: 120, height: 16, borderRadius: 8, background: '#3A2E2A'}} />
      {/* chão */}
      <div style={{position: 'absolute', left: 0, top: 860, width: 1920, height: 220, background: 'linear-gradient(180deg,#22304F,#141E35)'}} />
      {sofa ? (
        <>
          <div style={{position: 'absolute', left: 560, top: 560, width: 900, height: 200, borderRadius: 60, background: '#2E7F86'}} />
          <div style={{position: 'absolute', left: 520, top: 700, width: 980, height: 170, borderRadius: 50, background: '#256A70'}} />
          <div style={{position: 'absolute', left: 480, top: 640, width: 120, height: 230, borderRadius: 50, background: '#1F5A5F'}} />
          <div style={{position: 'absolute', left: 1420, top: 640, width: 120, height: 230, borderRadius: 50, background: '#1F5A5F'}} />
          <div style={{position: 'absolute', left: 620, top: 600, width: 170, height: 130, borderRadius: 40, background: C.coral, transform: 'rotate(-12deg)'}} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** cômodo de dia: janela com sol e coqueiro, calendário, mesa */
export const DayRoom: React.FC<{calendarAt?: number}> = ({calendarAt = 0}) => {
  const f = useCurrentFrame();
  const circ = interpolate(f, [calendarAt, calendarAt + 25], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #FFF4DD 0%, ${C.areia} 70%)`}}>
      <div style={{position: 'absolute', left: 1180, top: 90, width: 560, height: 440, borderRadius: 20, background: 'linear-gradient(180deg,#8FD3FF,#D8F1FF)', boxShadow: 'inset 0 0 0 16px #fff, 0 20px 50px rgba(0,0,0,0.12)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 340, top: 60, width: 110, height: 110, borderRadius: '50%', background: C.solClaro, boxShadow: '0 0 80px rgba(245,211,51,0.8)'}} />
        <div style={{position: 'absolute', left: 0, top: 330, width: 560, height: 120, background: C.mar}} />
        <div style={{position: 'absolute', left: 0, top: 380, width: 560, height: 80, background: C.areiaEsc}} />
        <svg width={560} height={440} style={{position: 'absolute'}}>
          <path d="M 120 400 Q 130 300 150 200" stroke="#7A5A3A" strokeWidth={12} fill="none" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M 150 200 q ${Math.cos(i) * 70} ${-30 + Math.sin(i * 2) * 20} ${Math.cos(i) * 130} ${30 + (i % 3) * 15}`} stroke={C.coqueiro} strokeWidth={16} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(f / 40 + i) * 3} 150 200)`} />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 272, top: 16, width: 16, height: 408, background: '#fff'}} />
      </div>
      {/* calendário */}
      <div style={{position: 'absolute', left: 200, top: 200, width: 330, height: 330, borderRadius: 22, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden'}}>
        <div style={{height: 80, background: C.coral, color: '#fff', fontFamily: F.titulo, fontWeight: 800, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 3}}>JANEIRO</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, padding: 16}}>
          {Array.from({length: 28}).map((_, i) => (
            <div key={i} style={{height: 30, borderRadius: 6, background: i >= 10 && i <= 15 ? `rgba(245,184,0,${circ})` : '#EEF2F6', fontFamily: F.texto, fontSize: 14, color: C.texto, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 820, width: 1920, height: 260, background: 'linear-gradient(180deg,#B9895A,#9A6E45)'}} />
      <div style={{position: 'absolute', left: 0, top: 800, width: 1920, height: 30, background: '#C99A68'}} />
    </AbsoluteFill>
  );
};

/** notebook visto de frente */
export const Laptop: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', ...style}}>
    <div style={{width: 640, height: 400, borderRadius: 20, background: '#2B333D', padding: 16, boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.3)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 10, background: '#fff', overflow: 'hidden', position: 'relative'}}>{children}</div>
    </div>
    <div style={{width: 760, height: 26, marginLeft: -60, borderRadius: '0 0 20px 20px', background: '#BCC4CC'}} />
  </div>
);

/** xícara de café com vapor */
export const Coffee: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  return (
    <svg width={160} height={200} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${50 + i * 25} 70 q ${10 * Math.sin(f / 12 + i)} -20 0 -40 q ${-10 * Math.sin(f / 12 + i)} -20 0 -40`} stroke="rgba(255,255,255,0.9)" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.4 + 0.3 * Math.sin(f / 15 + i)} />
      ))}
      <path d="M 20 80 L 130 80 L 118 180 Q 75 194 32 180 Z" fill={C.coral} />
      <path d="M 128 100 q 40 0 32 34 q -6 22 -36 18" stroke={C.coral} strokeWidth={12} fill="none" />
      <ellipse cx={75} cy={82} rx={55} ry={9} fill="#5A3A22" />
    </svg>
  );
};

/** barra de busca genérica com digitação */
export const SearchBar: React.FC<{text: string; start: number; cps?: number; width?: number; style?: React.CSSProperties}> = ({text, start, cps = 0.45, width = 900, style}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - start) * cps)));
  const caret = Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{width, height: 92, borderRadius: 46, background: '#fff', boxShadow: '0 14px 40px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', padding: '0 34px', gap: 20, boxSizing: 'border-box', border: '2px solid #E4E8EE', ...style}}>
      <svg width={42} height={42} viewBox="0 0 100 100">
        <circle cx={44} cy={44} r={24} fill="none" stroke={C.mar} strokeWidth={10} />
        <path d="M 62 62 L 82 82" stroke={C.mar} strokeWidth={12} strokeLinecap="round" />
      </svg>
      <div style={{fontFamily: F.texto, fontSize: 38, color: C.texto, fontWeight: 500}}>
        {text.slice(0, n)}
        <span style={{opacity: caret ? 1 : 0, color: C.mar}}>|</span>
      </div>
    </div>
  );
};
