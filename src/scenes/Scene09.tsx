import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, eio, rnd, Title} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DeepBg} from '../lib/Scenery';
import {Pipe} from '../lib/Pipe';

const S = scene('Scene09');

export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const tSim = at(S, 'Fizemos');
  const tCaut = at(S, 'No mais cauteloso');
  const tMeio = at(S, 'No cenário do meio');
  const tOt = at(S, 'No mais otimista');
  const tEst = at(S, 'São estimativas');
  const tLicao = at(S, 'Mas a lição');
  const end = S.frames;
  return (
    <Shell id="Scene09">
      <Seg a={0} b={tLicao + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.12, y: -30},
            {f: tSim, z: 1.04},
            {f: tCaut, z: 1.12, x: 420, y: 20},
            {f: tMeio, z: 1.16, x: 0, y: 20},
            {f: tOt, z: 1.12, x: -420, y: 20},
            {f: tEst, z: 1.0, x: 0},
            {f: tLicao, z: 1.04, y: -10},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #24589A, ${C.marinho} 80%)`}} />
          <div style={{position: 'absolute', top: 60, width: 1920, textAlign: 'center'}}>
            <Title start={6} style={{fontSize: 72}}>
              Quanto isso pode <span style={{color: C.sol}}>valer?</span>
            </Title>
          </div>
          <Jar x={300} start={tCaut} fill={0.22} label="Cauteloso" value="R$ 16 mil/ano" dim={f > tMeio && f < tEst ? 0.5 : 1} />
          <Jar x={810} start={tMeio} fill={0.55} label="Médio" value="R$ 70 mil/ano" sub="≈ R$ 190/dia" highlight={f > tMeio} big />
          <Jar x={1320} start={tOt} fill={0.92} label="Otimista" value="R$ 194 mil/ano" dim={f > tEst ? 0.6 : 1} />
          <div style={{position: 'absolute', bottom: 150, width: 1920, textAlign: 'center', fontFamily: F.texto, fontWeight: 500, fontSize: 26, color: 'rgba(255,255,255,0.8)', opacity: interpolate(f, [tSim, tSim + 15], [0, 1], clamp)}}>
            Simulação — valores dependem das diárias e da ocupação reais
          </div>
        </Cam>
      </Seg>
      {/* a lição: o dinheiro escorre pelos furos */}
      <Seg a={tLicao} b={end + 2}>
        <Cam
          keys={[
            {f: tLicao, z: 1.15, y: 30},
            {f: tLicao + 90, z: 1.02},
            {f: end, z: 1.08, x: -30, y: -10},
          ]}
        >
          <DeepBg />
          <Pipe openAt={[-300, -300, -300, -300]} flowStart={-500} />
          <MoneyRain start={at(S, 'e parte dele')} />
          <div style={{position: 'absolute', top: 100, width: 1920, textAlign: 'center'}}>
            <Title start={tLicao + 10} style={{fontSize: 64}}>
              O dinheiro <span style={{color: C.sol}}>já está procurando</span> a pousada
            </Title>
          </div>
        </Cam>
      </Seg>
      <Sfx at={tCaut} src="sparkle-touch.mp3" vol={0.3} />
      <Sfx at={tMeio} src="sparkle-touch.mp3" vol={0.35} />
      <Sfx at={tOt} src="sparkle-touch.mp3" vol={0.3} />
      <Sfx at={tLicao - 6} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

const Jar: React.FC<{x: number; start: number; fill: number; label: string; value: string; sub?: string; highlight?: boolean; dim?: number; big?: boolean}> = ({x, start, fill, label, value, sub, highlight, dim = 1, big}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 70], [0, 1], {...clamp, easing: eio});
  const appear = interpolate(f, [start - 10, start + 10], [0, 1], clamp);
  const W = 300;
  const H = 400;
  const level = H * fill * p;
  const coins = Math.round(fill * 34 * p);
  return (
    <div style={{position: 'absolute', left: x, top: 240, width: W, opacity: appear * dim, transform: `scale(${highlight ? 1.08 : 1})`, transformOrigin: '50% 100%'}}>
      <div style={{position: 'relative', width: W, height: H, borderRadius: '40px 40px 60px 60px', background: 'rgba(255,255,255,0.12)', border: `5px solid ${highlight ? C.sol : 'rgba(255,255,255,0.7)'}`, overflow: 'hidden', boxShadow: highlight ? `0 0 60px rgba(245,184,0,0.5)` : undefined}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: level, background: 'linear-gradient(180deg, #FFD95A, #E2A93B)'}} />
        {Array.from({length: coins}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 20 + rnd(i * 7 + x) * (W - 80), bottom: Math.max(0, level - 40 - rnd(i * 3 + x) * Math.max(0, level - 40)), width: 44, height: 16, borderRadius: '50%', background: '#FFE58A', border: '3px solid #C98F00'}} />
        ))}
        <div style={{position: 'absolute', left: 24, top: 20, width: 20, height: H - 60, borderRadius: 10, background: 'rgba(255,255,255,0.25)'}} />
      </div>
      <div style={{width: W + 30, marginLeft: -15, height: 40, borderRadius: 12, background: '#C4A57A', position: 'absolute', top: -26}} />
      <div style={{textAlign: 'center', marginTop: 20, fontFamily: F.texto}}>
        <div style={{fontWeight: 600, fontSize: 32, color: 'rgba(255,255,255,0.85)'}}>{label}</div>
        <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: big ? 46 : 40, color: highlight ? C.sol : '#fff', lineHeight: 1.1, whiteSpace: 'nowrap', marginLeft: -60, marginRight: -60}}>{value}</div>
        {sub ? <div style={{fontWeight: 700, fontSize: 32, color: C.sol}}>{sub}</div> : null}
      </div>
    </div>
  );
};

const MoneyRain: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const holes = [
    [600, 545],
    [800, 660],
    [1080, 545],
    [1300, 430],
  ];
  return (
    <AbsoluteFill>
      {holes.map(([hx, hy], h) =>
        Array.from({length: 8}).map((_, i) => {
          const t = f - start - i * 9 - h * 4;
          if (t < 0) return null;
          const d = t % 72;
          return (
            <div key={h + '-' + i} style={{position: 'absolute', left: hx - 20 + Math.sin(i) * 20, top: hy + 40 + d * d * 0.09 + d * 2, width: 40, height: 40, borderRadius: '50%', background: C.sol, border: '4px solid #C98F00', opacity: 1 - d / 72, fontFamily: F.titulo, fontWeight: 800, fontSize: 20, color: '#8A6100', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              $
            </div>
          );
        }),
      )}
    </AbsoluteFill>
  );
};
