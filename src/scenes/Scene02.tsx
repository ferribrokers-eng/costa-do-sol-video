import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, CountUp, Pill, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {NightRoom} from '../lib/Rooms';
import {Marina} from '../lib/Marina';
import {Phone} from '../lib/Phone';
import {Feed, FEED_TOTAL, OrbitIcons} from '../lib/Social';
import {IcBell, IcCheck, IcHeart} from '../lib/Icons';

const S = scene('Scene02');

const MarinaSofa: React.FC<{x: number; y: number; w?: number; smile?: number; look?: number}> = ({x, y, w = 420, smile = 0.4, look = 0.6}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'rotate(-14deg)', transformOrigin: '30% 60%'}}>
    <Marina width={w} legs="sofa" left={{a1: -30, a2: -115}} right={{a1: 6, a2: -20}} phone="left" phoneGlow={1} smile={smile} look={look} lookY={0.6} />
  </div>
);

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const tMora = at(S, 'Ela mora');
  const tRola = at(S, 'Ela rola');
  const tCurte = at(S, 'Ela curte');
  const tRepare = at(S, 'Repare');
  const tTempo = at(S, 'Ela estava passando');
  const tRede = at(S, 'Isso é a rede social');
  const tSonho = at(S, 'Ela é ótima');
  const tInsta = at(S, 'O Instagram');
  const tSoQue = at(S, 'Só que');
  const end = S.frames;
  // rolagem do feed: acelera, a praia passa em ~meio segundo no instante da curtida
  const V = 46;
  const S0 = 1270 + 3 * FEED_TOTAL;
  const ramp = Math.min(1, Math.max(0, (f - tRola) / 60));
  const scroll = f < tCurte ? S0 - V * (tCurte - f) * (0.55 + 0.45 * ramp) : S0 + V * 0.6 * (f - tCurte);
  return (
    <Shell id="Scene02">
      {/* 1. Marina no sofá, à noite */}
      <Seg a={0} b={tRola + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.0, x: 0},
            {f: tMora, z: 1.12, x: 120, y: 40},
            {f: tRola, z: 1.25, x: 200, y: 80},
          ]}
        >
          <NightRoom />
          <MarinaSofa x={600} y={380} />
          <NameTag start={at(S, 'Esta é a Marina') + 4} />
          <div style={{position: 'absolute', left: 1060, top: 540, opacity: interpolate(f, [tMora + 20, tMora + 35], [0, 1], clamp)}}>
            <Pill bg={C.sol} color={C.marinho}>
              Salvador • depois do trabalho
            </Pill>
          </div>
        </Cam>
      </Seg>
      {/* 2. rolando o feed, ícones girando cada vez mais rápido */}
      <Seg a={tRola} b={tRede + 10}>
        <Cam
          keys={[
            {f: tRola, z: 1.08, x: 60},
            {f: tCurte, z: 1.0, x: 0},
            {f: tRepare, z: 1.12, x: -110, y: 20},
            {f: tRede, z: 1.18, x: -150, y: 20},
          ]}
        >
          <NightRoom sofa={false} />
          <AbsoluteFill style={{background: 'rgba(5,10,25,0.35)'}} />
          <div style={{position: 'absolute', left: 330, top: 300}}>
            <Marina width={380} legs="none" left={{a1: -30, a2: -115}} right={{a1: 6, a2: -20}} phone="left" phoneGlow={1} smile={f > tCurte && f < tCurte + 40 ? 0.9 : 0.3} look={0.6} lookY={0.7} />
          </div>
          <OrbitIcons cx={520} cy={480} start={tRola} accel={1.4} r={260} opacity={interpolate(f, [tRepare - 10, tRepare + 10], [1, 0.25], clamp)} />
          <div style={{position: 'absolute', left: 1060, top: 70}}>
            <Phone width={440} dark>
              <Feed scroll={scroll} likeAt={tCurte} />
              <BigHeart at={tCurte} />
            </Phone>
          </div>
          <Seg a={tRepare} b={tRede}>
            <div style={{position: 'absolute', left: 560, top: 260}}>
              <Check start={tRepare + 10} ok text="Viu a pousada" />
              <Check start={at(S, 'mas não estava') + 6} ok={false} text="Procurando viagem" />
              <Check start={tTempo + 6} ok text="Passando o tempo" neutral />
            </div>
          </Seg>
        </Cam>
      </Seg>
      {/* 3. a rede social: sonho + lembrança de marca */}
      <Seg a={tRede} b={tInsta + 10}>
        <Cam
          keys={[
            {f: tRede, z: 1.1, y: -20},
            {f: tSonho, z: 1.02},
            {f: tInsta, z: 1.08, x: 30, y: 10},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #2C4A86, ${C.noite} 75%)`}} />
          <OrbitIcons cx={960} cy={560} start={tRede - 200} accel={0.3} r={380} count={12} opacity={0.5} />
          <div style={{position: 'absolute', top: 260, width: 1920, textAlign: 'center'}}>
            <Title start={tRede + 4} style={{fontSize: 96}}>
              Isso é a <span style={{color: C.sol}}>rede social</span>
            </Title>
          </div>
          <div style={{position: 'absolute', top: 520, width: 1920, display: 'flex', justifyContent: 'center', gap: 60}}>
            <Benefit start={tSonho + 10} icon={<IcHeart size={90} bg="#FF4D6D" />} text="Faz sonhar" />
            <Benefit start={tSonho + 40} icon={<IcBell size={90} bg={C.sol} />} text="Faz lembrar da marca" />
          </div>
        </Cam>
      </Seg>
      {/* 4. o perfil da pousada: 5.130 seguidores */}
      <Seg a={tInsta} b={tSoQue + 10}>
        <Cam
          keys={[
            {f: tInsta, z: 1.12, x: -40},
            {f: tInsta + 90, z: 1.03},
            {f: tSoQue, z: 1.06, x: 30, y: -10},
          ]}
        >
          <AbsoluteFill style={{background: `linear-gradient(135deg, ${C.marinho}, #1F4C8A)`}} />
          <Profile start={tInsta} />
        </Cam>
      </Seg>
      {/* 5. curiosos x mala pronta */}
      <Seg a={tSoQue} b={end + 2}>
        <Cam
          keys={[
            {f: tSoQue, z: 1.0, x: 0},
            {f: tSoQue + 80, z: 1.06, x: -60},
            {f: end, z: 1.14, x: -220, y: 10},
          ]}
        >
          <Curious start={tSoQue} malaAt={at(S, 'não com a mala')} />
        </Cam>
      </Seg>
      <Sfx at={tRola} src="paper-slide.mp3" vol={0.25} />
      <Sfx at={tCurte} src="ui-message-pop.mp3" vol={0.4} />
      <Sfx at={tRede - 8} src="swoosh-slow.mp3" vol={0.3} />
      <Sfx at={tInsta - 6} src="swoosh-slow.mp3" vol={0.3} />
      <Sfx at={tSoQue - 6} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

const NameTag: React.FC<{start: number}> = ({start}) => {
  const p = usePop(start, 13, 130);
  return (
    <div style={{position: 'absolute', left: 1060, top: 400, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * 40}px)`}}>
      <div style={{fontFamily: F.arredondada, fontWeight: 800, fontSize: 96, color: '#fff', lineHeight: 1}}>Marina</div>
      <div style={{height: 8, width: 200 * p, background: C.sol, borderRadius: 4, marginTop: 6}} />
    </div>
  );
};

const BigHeart: React.FC<{at: number}> = ({at: t}) => {
  const p = usePop(t, 9, 200);
  const f = useCurrentFrame();
  const o = interpolate(f, [t, t + 4, t + 22, t + 30], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o}}>
      <IcHeart size={220 * p} color="#FF4D6D" style={{filter: 'drop-shadow(0 10px 30px rgba(255,77,109,0.6))'}} />
    </AbsoluteFill>
  );
};

const Check: React.FC<{start: number; ok: boolean; text: string; neutral?: boolean}> = ({start, ok, text, neutral}) => {
  const p = usePop(start, 13, 140);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{width: 70, height: 70, borderRadius: 18, background: neutral ? C.azulClaro : ok ? C.coqueiro : '#D9534F', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.35)'}}>
        {ok ? (
          <IcCheck size={56} />
        ) : (
          <svg width={50} height={50} viewBox="0 0 100 100">
            <path d="M 25 25 L 75 75 M 75 25 L 25 75" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 46, color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.5)'}}>{text}</div>
    </div>
  );
};

const Benefit: React.FC<{start: number; icon: React.ReactNode; text: string}> = ({start, icon, text}) => {
  const p = usePop(start, 13, 130);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: 28, padding: '22px 36px', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px)`}}>
      {icon}
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: '#fff'}}>{text}</div>
    </div>
  );
};

const Profile: React.FC<{start: number}> = ({start}) => {
  const p = usePop(start + 4, 15, 110);
  const imgs = ['aerea.jpg', 'piscina.jpg', 'cafe.jpg', 'chale.jpg', 'rio.jpg', 'comida.jpg'];
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 960 - 560, top: 120, width: 1120, opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * 60}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <Img src={staticFile('logo.png')} style={{width: 200, height: 200, borderRadius: '50%', boxShadow: `0 0 0 8px ${C.sol}`}} />
        <div>
          <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: '#fff'}}>@pousadacostadosol</div>
          <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 110, color: C.sol, lineHeight: 1.05}}>
            <CountUp to={5130} start={start + 10} dur={55} />
          </div>
          <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 36, color: '#fff', opacity: 0.85}}>seguidores</div>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 40}}>
        {imgs.map((im, i) => {
          const q = interpolate(f, [start + 40 + i * 5, start + 55 + i * 5], [0, 1], clamp);
          return (
            <div key={i} style={{height: 170, borderRadius: 14, overflow: 'hidden', opacity: q, transform: `scale(${0.8 + q * 0.2})`}}>
              <Img src={staticFile('fotos/' + im)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 34, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [start + 100, start + 115], [0, 1], clamp)}}>
        <Pill bg={C.sol} color={C.marinho}>
          ✓ Muito bem feito
        </Pill>
      </div>
    </div>
  );
};

const Curious: React.FC<{start: number; malaAt: number}> = ({start, malaAt}) => {
  const f = useCurrentFrame();
  const mp = interpolate(f, [malaAt, malaAt + 20], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #2C4A86, ${C.noite} 80%)`}}>
      {Array.from({length: 14}).map((_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const x = 160 + col * 175 + row * 80;
        const y = 330 + row * 230;
        const p = interpolate(f - start - i * 3, [0, 18], [0, 1], clamp);
        const b = Math.sin(f / 16 + i) * 5;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y + b + (1 - p) * 40, opacity: p * (1 - mp * 0.5)}}>
            <svg width={120} height={200} viewBox="0 0 120 200">
              <circle cx={60} cy={40} r={32} fill="rgba(255,255,255,0.8)" />
              <path d="M 12 200 Q 12 86 60 86 Q 108 86 108 200 Z" fill="rgba(255,255,255,0.8)" />
            </svg>
            <div style={{position: 'absolute', top: -60, width: 120, textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, fontSize: 56, color: C.azulClaro, transform: `rotate(${Math.sin(f / 12 + i) * 10}deg)`}}>?</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 380, top: 120, fontFamily: F.titulo, fontWeight: 800, fontSize: 64, color: '#fff', opacity: interpolate(f, [start + 10, start + 25], [0, 1], clamp)}}>
        A maioria está <span style={{color: C.azulClaro}}>curiosa</span>
      </div>
      <div style={{position: 'absolute', left: 1500, top: 250, opacity: mp, transform: `translateX(${(1 - mp) * 80}px)`}}>
        <Marina width={250} legs="stand" suitcase smile={1} right={{a1: 18, a2: -6}} />
        <div style={{position: 'absolute', top: -80, left: -40, width: 400}}>
          <Pill bg={C.sol} color={C.marinho}>
            Mala pronta
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};
