import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, kf, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DeepBg} from '../lib/Scenery';
import {Pipe} from '../lib/Pipe';
import {Phone} from '../lib/Phone';
import {Feed, OrbitIcons} from '../lib/Social';
import {IcBell, IcGlobe, IcPhone, IcPin, Stars} from '../lib/Icons';
import {Marina} from '../lib/Marina';

const S = scene('Scene06');

export const Scene06: React.FC = () => {
  const f = useCurrentFrame();
  const tPerfil = at(S, 'No perfil');
  const tQueria = at(S, 'A Marina queria');
  const tVez = at(S, 'Em vez disso');
  const tNotif = at(S, 'Uma notificação');
  const end = S.frames;
  const open2 = 20;
  const tap = tPerfil + 75;
  return (
    <Shell id="Scene06">
      {/* 1. furo 2 no cano */}
      <Seg a={0} b={tPerfil + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.0},
            {f: open2 + 20, z: 1.4, x: 220, y: -210},
            {f: tPerfil, z: 1.35, x: 200, y: -200},
          ]}
        >
          <DeepBg />
          <Pipe openAt={[-200, open2, 1e9, 1e9]} labels={['Furo 1', 'Furo 2 — O link leva para o Instagram']} flowStart={-400} highlight={1} />
        </Cam>
      </Seg>
      {/* 2. perfil do Google: tocar em "Site" */}
      <Seg a={tPerfil} b={tVez + 10}>
        <Cam
          keys={[
            {f: tPerfil, z: 1.08, y: 20},
            {f: tap, z: 1.18, x: -60, y: -80},
            {f: tQueria, z: 1.05, x: 0},
            {f: tVez, z: 1.12, x: 60, y: 20},
          ]}
        >
          <DeepBg />
          <div style={{position: 'absolute', left: 300, top: 70}}>
            <Phone width={440}>
              <ProfileCard tap={tap} />
            </Phone>
          </div>
          <div style={{position: 'absolute', left: 900, top: 300}}>
            <Marina width={300} legs="none" left={{a1: -30, a2: -115}} phone="left" smile={0.6} look={-0.6} />
          </div>
          <Thought start={tQueria + 6} />
        </Cam>
      </Seg>
      {/* 3. cai no feed infinito, distrações */}
      <Seg a={tVez} b={end + 2}>
        <Cam
          keys={[
            {f: tVez, z: 1.12, x: -40},
            {f: tVez + 90, z: 1.0},
            {f: tNotif, z: 1.06, x: 40, y: 10},
            {f: end, z: 1.2, x: 80, y: 20},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #2C4A86, ${C.noite} 80%)`}} />
          <OrbitIcons cx={960} cy={520} start={tVez - 60} accel={1.6} r={360} count={12} />
          <div style={{position: 'absolute', left: 960 - 210, top: 70}}>
            <Phone width={420} dark>
              <Feed scroll={kf(f, [[tVez, 0], [end, 4200]], (x) => x)} />
              <Notification at={tNotif + 6} />
            </Phone>
          </div>
          <LostAttention start={at(S, 'e a pousada perde')} />
        </Cam>
      </Seg>
      <Sfx at={open2} src="water-drop-cave.mp3" vol={0.45} />
      <Sfx at={tap} src="pop.mp3" vol={0.4} />
      <Sfx at={tVez} src="swoosh-slow.mp3" vol={0.3} />
      <Sfx at={tNotif + 6} src="ui-message-pop.mp3" vol={0.45} />
    </Shell>
  );
};

const ProfileCard: React.FC<{tap: number}> = ({tap}) => {
  const f = useCurrentFrame();
  const press = interpolate(f, [tap - 4, tap, tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(f, [tap, tap + 20], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: F.texto}}>
      <div style={{height: 300, position: 'relative'}}>
        <Img src={staticFile('fotos/aerea.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{padding: '20px 22px'}}>
        <div style={{fontWeight: 700, fontSize: 30, color: C.texto}}>Pousada Costa do Sol</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6}}>
          <span style={{fontWeight: 700, fontSize: 22}}>4,8</span>
          <Stars value={4.8} size={26} gap={2} />
          <span style={{fontSize: 20, color: '#667'}}>(188)</span>
        </div>
        <div style={{fontSize: 20, color: '#667', marginTop: 4}}>Pousada • Canavieiras, BA</div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 26}}>
          {[
            ['Site', <IcGlobe key="g" size={44} color={C.mar} />],
            ['Rotas', <IcPin key="p" size={44} color={C.mar} bg="#fff" />],
            ['Ligar', <IcPhone key="l" size={44} color={C.mar} />],
          ].map(([l, ic], i) => (
            <div key={i} style={{textAlign: 'center', transform: i === 0 ? `scale(${press})` : undefined, position: 'relative'}}>
              <div style={{width: 84, height: 84, borderRadius: '50%', background: i === 0 ? '#E3EEFA' : '#F1F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: i === 0 && f > tap - 30 ? `0 0 0 5px ${C.sol}` : undefined}}>{ic}</div>
              {i === 0 ? <div style={{position: 'absolute', left: 0, top: 0, width: 84, height: 84, borderRadius: '50%', border: `4px solid ${C.sol}`, transform: `scale(${1 + ripple * 1.5})`, opacity: 1 - ripple}} /> : null}
              <div style={{fontSize: 20, fontWeight: 600, color: C.mar, marginTop: 8}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 26, padding: '14px 18px', borderRadius: 14, background: '#FFF4D6', fontSize: 19, color: C.texto, opacity: interpolate(f, [tap + 6, tap + 18], [0, 1], clamp)}}>
          Site → abre o <b>Instagram</b>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Thought: React.FC<{start: number}> = ({start}) => {
  const p = usePop(start, 13, 120);
  return (
    <div style={{position: 'absolute', left: 1180, top: 160, opacity: Math.min(1, p * 1.3), transform: `scale(${0.85 + p * 0.15})`, transformOrigin: 'left bottom'}}>
      <div style={{background: '#fff', borderRadius: 40, padding: '34px 44px', fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: C.marinho, lineHeight: 1.3, boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
        Tem vaga em <span style={{color: C.mar}}>janeiro</span>?
        <br />
        Quanto <span style={{color: C.mar}}>custa</span>?
      </div>
      <div style={{width: 40, height: 40, borderRadius: '50%', background: '#fff', marginLeft: 30, marginTop: 14}} />
      <div style={{width: 22, height: 22, borderRadius: '50%', background: '#fff', marginLeft: 6, marginTop: 8}} />
    </div>
  );
};

const Notification: React.FC<{at: number}> = ({at: t}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t, t + 10], [0, 1], clamp);
  const shake = f > t && f < t + 30 ? Math.sin(f * 1.6) * 8 : 0;
  return (
    <div style={{position: 'absolute', top: 70 - (1 - p) * 120, left: 16, right: 16, background: 'rgba(250,250,252,0.97)', borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 12px 30px rgba(0,0,0,0.4)', fontFamily: F.texto}}>
      <div style={{transform: `rotate(${shake}deg)`}}>
        <IcBell size={48} bg={C.coral} />
      </div>
      <div>
        <div style={{fontWeight: 700, fontSize: 20, color: C.texto}}>Nova notificação</div>
        <div style={{fontSize: 17, color: '#667'}}>Veja o que seus amigos postaram</div>
      </div>
    </div>
  );
};

const LostAttention: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 20], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 1320, top: 420, opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>
      <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 54, color: '#fff', lineHeight: 1.15}}>
        A pousada perde
        <br />a <span style={{color: C.coral}}>atenção</span> dela
      </div>
    </div>
  );
};
