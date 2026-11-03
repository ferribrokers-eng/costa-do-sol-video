import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, CountUp, eio, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DeepBg} from '../lib/Scenery';
import {Pipe} from '../lib/Pipe';
import {IcHouse} from '../lib/Icons';

const S = scene('Scene07');

export const Scene07: React.FC = () => {
  const f = useCurrentFrame();
  const tQuando = at(S, 'Quando o botão');
  const tParte = at(S, 'ela até reserva');
  const tCom = at(S, 'As comissões');
  const tEst = at(S, 'Numa estadia');
  const tSig = at(S, 'isso significa');
  const tUtil = at(S, 'A plataforma é útil');
  const end = S.frames;
  const open3 = 20;
  return (
    <Shell id="Scene07">
      {/* 1. furo 3 */}
      <Seg a={0} b={tQuando + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.0},
            {f: open3 + 20, z: 1.4, x: -160, y: -40},
            {f: tQuando, z: 1.35, x: -150, y: -30},
          ]}
        >
          <DeepBg />
          <Pipe openAt={[-200, -200, open3, 1e9]} labels={['Furo 1', 'Furo 2', 'Furo 3 — Comissão']} flowStart={-400} highlight={2} />
        </Cam>
      </Seg>
      {/* 2. a reserva de R$ 1.350 e a fatia que voa */}
      <Seg a={tQuando} b={tUtil + 10}>
        <Cam
          keys={[
            {f: tQuando, z: 1.1, x: 60},
            {f: tParte, z: 1.0},
            {f: tCom, z: 1.06, x: -40},
            {f: tEst, z: 1.0, x: 0},
            {f: tSig, z: 1.08, x: 40, y: 20},
            {f: tUtil, z: 1.04},
          ]}
        >
          <DeepBg tint="#173A6B" />
          <Coin start={tQuando + 10} sliceAt={tParte + 30} />
          <div style={{position: 'absolute', left: 1080, top: 150, width: 760}}>
            <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 36, color: '#fff', opacity: interpolate(f, [tQuando + 20, tQuando + 35], [0, 1], clamp)}}>Reserva pela plataforma</div>
            <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 110, color: C.sol, lineHeight: 1.05, opacity: interpolate(f, [tEst, tEst + 10], [0, 1], clamp)}}>
              R$ <CountUp to={1350} start={tEst} dur={40} />
            </div>
            <div style={{marginTop: 30, opacity: interpolate(f, [tCom, tCom + 12], [0, 1], clamp)}}>
              <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 34, color: '#fff'}}>Comissão</div>
              <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 96, color: C.coral, lineHeight: 1.05}}>
                <CountUp to={15} start={tCom + 4} dur={30} />% a <CountUp to={18} start={tCom + 20} dur={30} />%
              </div>
            </div>
            <div style={{marginTop: 30, opacity: interpolate(f, [tSig, tSig + 12], [0, 1], clamp)}}>
              <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 34, color: '#fff'}}>Saem do caixa da pousada</div>
              <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 96, color: C.coral, lineHeight: 1.05}}>
                R$ <CountUp to={203} start={tSig + 20} dur={35} /> a R$ <CountUp to={243} start={tSig + 50} dur={35} />
              </div>
            </div>
          </div>
        </Cam>
      </Seg>
      {/* 3. não precisa ser a única porta */}
      <Seg a={tUtil} b={end + 2}>
        <Cam
          keys={[
            {f: tUtil, z: 1.1, x: -60},
            {f: tUtil + 90, z: 1.0},
            {f: end, z: 1.06, x: 40, y: -10},
          ]}
        >
          <Doors start={tUtil} />
        </Cam>
      </Seg>
      <Sfx at={tParte + 30} src="whoosh-fast.mp3" vol={0.35} />
      <Sfx at={tEst} src="clock-tick-single.mp3" vol={0.3} />
      <Sfx at={tUtil - 6} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

/** moeda (pizza) com uma fatia de 15–18% que se solta e voa para fora do quadro */
const Coin: React.FC<{start: number; sliceAt: number}> = ({start, sliceAt}) => {
  const f = useCurrentFrame();
  const p = usePop(start, 14, 110);
  const t = interpolate(f, [sliceAt, sliceAt + 70], [0, 1], {...clamp, easing: eio});
  const cx = 560;
  const cy = 520;
  const R = 300;
  const a0 = -90;
  const a1 = -90 + 0.165 * 360;
  const rad = (a: number) => (a * Math.PI) / 180;
  const slice = `M 0 0 L ${R * Math.cos(rad(a0))} ${R * Math.sin(rad(a0))} A ${R} ${R} 0 0 1 ${R * Math.cos(rad(a1))} ${R * Math.sin(rad(a1))} Z`;
  const rest = `M 0 0 L ${R * Math.cos(rad(a1))} ${R * Math.sin(rad(a1))} A ${R} ${R} 0 1 1 ${R * Math.cos(rad(a0))} ${R * Math.sin(rad(a0))} Z`;
  const sx = t * 1500;
  const sy = -t * 700 + Math.sin(t * Math.PI) * -100;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', opacity: Math.min(1, p * 1.4)}}>
      <g transform={`translate(${cx} ${cy}) scale(${0.7 + p * 0.3})`}>
        <circle r={R + 18} fill="#C98F00" transform="translate(0 16)" />
        <path d={rest} fill={C.sol} />
        <circle r={R * 0.78} fill="none" stroke="#E7A900" strokeWidth={10} />
        <text x={0} y={40} textAnchor="middle" fontFamily={F.titulo} fontWeight={800} fontSize={130} fill="#B07D00" opacity={0.7}>
          R$
        </text>
        <g transform={`translate(${sx} ${sy}) rotate(${t * 220})`}>
          <path d={slice} fill={C.coral} stroke="#fff" strokeWidth={6} />
        </g>
      </g>
    </svg>
  );
};

const Doors: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const p1 = interpolate(f, [start + 10, start + 30], [0, 1], clamp);
  const p2 = interpolate(f, [start + 40, start + 60], [0, 1], clamp);
  const open = interpolate(f, [start + 70, start + 110], [0, 1], {...clamp, easing: eio});
  const Door: React.FC<{x: number; label: string; color: string; p: number; openP?: number; toll?: boolean}> = ({x, label, color, p, openP = 0, toll}) => (
    <div style={{position: 'absolute', left: x, top: 260, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{width: 360, height: 560, borderRadius: '180px 180px 16px 16px', background: '#FFF4D6', boxShadow: '0 30px 60px rgba(0,0,0,0.35)', perspective: 800, overflow: 'hidden', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.azulClaro}, ${C.areia})`}}>
          <div style={{position: 'absolute', left: 100, top: 220}}>
            <IcHouse size={160} bg={C.sol} color="#fff" />
          </div>
        </div>
        <div style={{position: 'absolute', inset: 16, borderRadius: '170px 170px 10px 10px', background: color, transformOrigin: '0 50%', transform: `rotateY(${-openP * 75}deg)`}}>
          <div style={{position: 'absolute', right: 40, top: 300, width: 26, height: 26, borderRadius: '50%', background: C.sol}} />
        </div>
      </div>
      {toll ? <div style={{position: 'absolute', top: 420, left: -30, width: 420, height: 36, borderRadius: 18, background: 'repeating-linear-gradient(90deg, #E8704A 0 50px, #fff 50px 100px)'}} /> : null}
      <div style={{textAlign: 'center', marginTop: 24, fontFamily: F.texto, fontWeight: 800, fontSize: 38, color: '#fff'}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <DeepBg />
      <Door x={420} label="Plataforma (útil)" color="#7C8CA0" p={p1} toll />
      <Door x={1140} label="Reserva direta" color={C.mar} p={p2} openP={open} />
      <div style={{position: 'absolute', top: 90, width: 1920, textAlign: 'center'}}>
        <Title start={start + 6} style={{fontSize: 70}}>
          Não precisa ser a <span style={{color: C.sol}}>única porta</span>
        </Title>
      </div>
    </AbsoluteFill>
  );
};
