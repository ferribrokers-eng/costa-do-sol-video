import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, kf, Photo, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {Logo, Sun} from '../lib/Scenery';
import {Marina} from '../lib/Marina';
import {IcChat, IcCheck, IcHouse, IcSearch} from '../lib/Icons';

const S = scene('Scene11');

/** grade de pôr do sol sobre as fotos reais */
const Sunset: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,120,40,0.45), rgba(255,170,80,0.2) 50%, rgba(80,30,60,0.35))', mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 25%, rgba(255,200,120,0.55), transparent 55%)', mixBlendMode: 'screen'}} />
  </>
);

export const Scene11: React.FC = () => {
  const f = useCurrentFrame();
  const tJa = at(S, 'A pousada já tem');
  const tFalta = at(S, 'Falta só');
  const tFerri = at(S, 'Ferri Digital');
  const end = S.frames;
  const tFinal = end - Math.round(6.5 * 30); // tela final com contato (≥5 s)
  const walkX = kf(f, [
    [0, -200],
    [tJa, 820],
  ], (x) => x);
  const steps = [
    {ic: <IcSearch size={80} bg="#fff" color={C.mar} />, t: 10, l: 'Busca'},
    {ic: <IcHouse size={80} bg={C.sol} color="#fff" />, t: at(S, 'Agora a Marina') + 45, l: 'Site oficial'},
    {ic: <IcChat size={80} bg={C.coqueiro} color="#fff" />, t: at(S, 'conversa no'), l: 'WhatsApp'},
    {ic: <IcCheck size={80} bg={C.sol} color={C.marinho} />, t: at(S, 'conversa no') + 55, l: 'Reserva direta'},
  ];
  return (
    <Shell id="Scene11">
      {/* 1. Marina chegando no pôr do sol */}
      <Seg a={0} b={tJa + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.1, x: 80},
            {f: tJa * 0.5, z: 1.04, x: 0},
            {f: tJa, z: 1.12, x: -60, y: 20},
          ]}
        >
          <Photo src="aerea.jpg" from={0} dur={tJa + 10} z0={1.15} z1={1.25} x0={2} x1={-2} blur={8} />
          <Sunset />
          <div style={{position: 'absolute', left: 0, top: 820, width: 1920, height: 260, background: 'linear-gradient(180deg, rgba(243,214,160,0), rgba(230,190,130,0.95) 40%)'}} />
          <div style={{position: 'absolute', left: walkX, top: 330}}>
            <Marina width={330} legs={f < tJa - 20 ? 'walk' : 'stand'} suitcase smile={1} right={{a1: 18, a2: -6}} left={{a1: f > tJa - 20 ? 150 : 10, a2: 20}} />
          </div>
          <div style={{position: 'absolute', top: 90, width: 1920, display: 'flex', justifyContent: 'center', gap: 70}}>
            {steps.map((s, i) => (
              <Step key={i} start={s.t} icon={s.ic} label={s.l} />
            ))}
          </div>
        </Cam>
      </Seg>
      {/* 2. o mar, o carinho e as avaliações */}
      <Seg a={tJa} b={tFalta + 10}>
        <Cam
          keys={[
            {f: tJa, z: 1.0, x: -30},
            {f: tJa + 80, z: 1.06, x: 10},
            {f: tFalta, z: 1.12, x: 30, y: -10},
          ]}
        >
          <Photo src="chale.jpg" from={tJa} dur={tFalta - tJa + 10} z0={1.06} z1={1.18} />
          <Sunset />
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(40,20,30,0.55), transparent 65%)'}} />
          <div style={{position: 'absolute', left: 130, top: 240}}>
            {['o mar', 'o carinho', 'as avaliações'].map((w, i) => (
              <Word key={w} start={tJa + 30 + i * 36} text={w} />
            ))}
          </div>
        </Cam>
      </Seg>
      {/* 3. abrir a porta certa → logo da pousada com o sol */}
      <Seg a={tFalta} b={tFinal + 10}>
        <Cam
          keys={[
            {f: tFalta, z: 1.2},
            {f: tFalta + 70, z: 1.02},
            {f: tFinal, z: 1.06, y: -10},
          ]}
        >
          <Photo src="piscina.jpg" from={tFalta} dur={tFinal - tFalta} z0={1.1} z1={1.2} blur={10} />
          <Sunset />
          <AbsoluteFill style={{background: 'rgba(19,41,75,0.35)'}} />
          <DoorLight start={tFalta + 10} />
          <LogoReveal start={tFalta + 60} />
          <div style={{position: 'absolute', top: 820, width: 1920, textAlign: 'center', opacity: interpolate(f, [tFerri, tFerri + 15], [0, 1], clamp)}}>
            <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 30, color: '#fff', letterSpacing: 4}}>UMA PROPOSTA</div>
            <FerriMark size={64} />
          </div>
        </Cam>
      </Seg>
      {/* 4. tela final: Ferri Digital + contato */}
      <Seg a={tFinal} b={end + 2} d={18}>
        <Cam
          keys={[
            {f: tFinal, z: 1.06},
            {f: end, z: 1.0},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #1F4C8A, ${C.marinho} 75%)`}} />
          <div style={{position: 'absolute', top: 230, width: 1920, textAlign: 'center'}}>
            <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.8)', letterSpacing: 6}}>UMA PROPOSTA</div>
            <FerriMark size={120} />
            <Title start={tFinal + 15} style={{fontSize: 48, fontWeight: 600, marginTop: 20, color: C.sol}}>
              transformando busca em reserva
            </Title>
          </div>
          <Contacts start={tFinal + 30} />
        </Cam>
      </Seg>
      <Sfx at={0} src="mar.wav" vol={0.55} />
      <Sfx at={tFalta + 10} src="light-aura.mp3" vol={0.35} />
      <Sfx at={tFalta + 60} src="shimmer-sparkle-sweep.mp3" vol={0.35} />
      <Sfx at={tFinal} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

const Step: React.FC<{start: number; icon: React.ReactNode; label: string}> = ({start, icon, label}) => {
  const p = usePop(start, 12, 150);
  return (
    <div style={{textAlign: 'center', opacity: Math.min(1, p * 1.4), transform: `scale(${0.7 + p * 0.3})`}}>
      <div style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.35))'}}>{icon}</div>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 28, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.5)', marginTop: 6}}>{label}</div>
    </div>
  );
};

const Word: React.FC<{start: number; text: string}> = ({start, text}) => {
  const p = usePop(start, 14, 120);
  return (
    <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 104, lineHeight: 1.08, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.45)', opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * -60}px)`}}>
      <span style={{color: C.sol}}>✓ </span>
      {text}
    </div>
  );
};

const DoorLight: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [start, start + 40], [0, 1], clamp);
  const fade = interpolate(f, [start + 50, start + 80], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 960 - 170, top: 200, width: 340, height: 560, perspective: 900, opacity: fade}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '170px 170px 14px 14px', background: 'radial-gradient(ellipse at 50% 60%, #FFF6D0, #FFC24A 70%)', boxShadow: `0 0 ${160 * o}px rgba(255,200,90,${0.9 * o})`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '170px 170px 14px 14px', background: C.mar, transformOrigin: '0 50%', transform: `rotateY(${-o * 80}deg)`, border: '10px solid #fff'}} />
    </div>
  );
};

const LogoReveal: React.FC<{start: number}> = ({start}) => {
  const p = usePop(start, 12, 90);
  return (
    <div style={{position: 'absolute', left: 960 - 300, top: 120, width: 600, height: 600, opacity: Math.min(1, p * 1.3)}}>
      <div style={{position: 'absolute', left: -60, top: -60, transform: `scale(${0.6 + p * 0.4})`}}>
        <Sun size={720} />
      </div>
      <div style={{position: 'absolute', left: 110, top: 110, transform: `scale(${0.6 + p * 0.4})`}}>
        <Logo size={380} />
      </div>
    </div>
  );
};

/** marca textual da Ferri Digital (substitua por /public/ferri.png quando houver o logo) */
export const FerriMark: React.FC<{size?: number}> = ({size = 80}) => (
  <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: size, color: '#fff', letterSpacing: -1, lineHeight: 1.05}}>
    Ferri<span style={{color: C.sol}}> Digital</span>
  </div>
);

const Contacts: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const items = ['(11) 97257-5089', 'contato@ferridigital.com.br', 'www.ferridigital.com.br'];
  return (
    <div style={{position: 'absolute', top: 640, width: 1920, display: 'flex', justifyContent: 'center', gap: 26}}>
      {items.map((t, i) => {
        const p = interpolate(f, [start + i * 10, start + i * 10 + 15], [0, 1], clamp);
        return (
          <div key={t} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 18, padding: '16px 28px', fontFamily: F.texto, fontWeight: 600, fontSize: 34, color: '#fff'}}>
            {t}
          </div>
        );
      })}
    </div>
  );
};
