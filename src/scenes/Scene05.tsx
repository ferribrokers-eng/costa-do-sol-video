import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, kf, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DeepBg} from '../lib/Scenery';
import {Pipe} from '../lib/Pipe';
import {SearchBar} from '../lib/Rooms';
import {IcCheck, IcHouse} from '../lib/Icons';

const S = scene('Scene05');

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const tFuro = at(S, 'O primeiro furo');
  const tProcura = at(S, 'Quando a Marina');
  const tPlat = at(S, 'é uma plataforma');
  const tComo = at(S, 'É como se');
  const tSem = at(S, 'Sem site');
  const end = S.frames;
  const open1 = tFuro + 30;
  return (
    <Shell id="Scene05">
      {/* 1. o cano + furo 1 */}
      <Seg a={0} b={tProcura + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.12, x: 200},
            {f: tFuro, z: 1.0, x: 0},
            {f: open1 + 10, z: 1.45, x: 560, y: 20},
            {f: tProcura, z: 1.4, x: 540, y: 10},
          ]}
        >
          <DeepBg />
          <Pipe openAt={[open1, 1e9, 1e9, 1e9]} labels={['Furo 1 — Sem site oficial']} flowStart={-30} highlight={0} />
          <div style={{position: 'absolute', top: 110, width: 1920, textAlign: 'center'}}>
            <Title start={20} end={tFuro} style={{fontSize: 64}}>
              A internet é um <span style={{color: C.azulClaro}}>cano</span> que leva clientes
            </Title>
          </div>
        </Cam>
      </Seg>
      {/* 2. buscando pelo nome: primeiro resultado é uma plataforma */}
      <Seg a={tProcura} b={tComo + 10}>
        <Cam
          keys={[
            {f: tProcura, z: 1.1, y: 30},
            {f: tProcura + 70, z: 1.0},
            {f: tPlat, z: 1.08, x: 120, y: 40},
            {f: tComo, z: 1.16, x: 180, y: 60},
          ]}
        >
          <AbsoluteFill style={{background: 'linear-gradient(180deg,#FFFFFF,#EEF4FA)'}} />
          <div style={{position: 'absolute', left: 160, top: 90}}>
            <SearchBar text="pousada costa do sol canavieiras" start={tProcura + 10} cps={0.8} width={1100} />
          </div>
          <Result start={tProcura + 60} top={250} title="Plataforma de reservas" sub="Pousada Costa do Sol — reserve aqui • ofertas" platform hl={f > tPlat} />
          <Result start={tProcura + 75} top={450} title="Outra plataforma de viagens" sub="Pousada Costa do Sol, Canavieiras — preços" platform />
          <Result start={tProcura + 90} top={650} title="Site oficial da pousada" sub="… não existe" missing />
          <div style={{position: 'absolute', left: 1360, top: 300, width: 460, opacity: interpolate(f, [tPlat, tPlat + 15], [0, 1], clamp)}}>
            <div style={{fontFamily: F.titulo, fontWeight: 800, fontSize: 52, color: C.marinho, lineHeight: 1.1}}>
              O 1º resultado <span style={{color: C.coral}}>não é a pousada</span>
            </div>
          </div>
        </Cam>
      </Seg>
      {/* 3. vitrine de shopping com pedágio na frente da pousada */}
      <Seg a={tComo} b={tSem + 10}>
        <Cam
          keys={[
            {f: tComo, z: 1.0, x: -80},
            {f: tComo + 100, z: 1.06, x: 0},
            {f: tSem, z: 1.15, x: 120, y: 20},
          ]}
        >
          <Mall start={tComo} />
        </Cam>
      </Seg>
      {/* 4. sem casa própria na internet */}
      <Seg a={tSem} b={end + 2}>
        <Cam
          keys={[
            {f: tSem, z: 1.12},
            {f: tSem + 80, z: 1.02, y: -10},
            {f: end, z: 1.06, x: -30},
          ]}
        >
          <DeepBg />
          <NoHome start={tSem} itemsAt={at(S, 'com as fotos')} />
        </Cam>
      </Seg>
      <Sfx at={open1} src="glass-hit-cine.mp3" vol={0.25} />
      <Sfx at={open1 + 10} src="water-drop-cave.mp3" vol={0.45} />
      <Sfx at={tProcura - 6} src="swoosh-slow.mp3" vol={0.3} />
      <Sfx at={tComo - 6} src="swoosh-slow.mp3" vol={0.3} />
      <Sfx at={tSem - 6} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

const Result: React.FC<{start: number; top: number; title: string; sub: string; platform?: boolean; missing?: boolean; hl?: boolean}> = ({start, top, title, sub, platform, missing, hl}) => {
  const p = usePop(start, 15, 120);
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        top,
        width: 1100,
        padding: '26px 34px',
        borderRadius: 20,
        background: missing ? 'transparent' : '#fff',
        border: missing ? '4px dashed #B9C3CF' : 'none',
        boxShadow: missing ? 'none' : hl ? `0 0 0 6px ${C.coral}, 0 16px 40px rgba(0,0,0,0.15)` : '0 10px 30px rgba(0,0,0,0.08)',
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - p) * 30}px)`,
        fontFamily: F.texto,
      }}
    >
      <div style={{fontWeight: 700, fontSize: 40, color: missing ? '#99A4B0' : '#1A4DB0'}}>{title}</div>
      <div style={{fontSize: 28, color: missing ? '#99A4B0' : '#556', marginTop: 6}}>{sub}</div>
      {platform ? <div style={{position: 'absolute', right: 30, top: 30, background: C.coral, color: '#fff', borderRadius: 12, padding: '6px 16px', fontWeight: 700, fontSize: 24}}>cobra comissão</div> : null}
    </div>
  );
};

const Mall: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const gate = kf(f, [
    [start + 50, -80],
    [start + 75, 0],
  ]);
  const coins = Array.from({length: 6}).map((_, i) => {
    const t = f - start - 100 - i * 18;
    if (t < 0) return null;
    return <div key={i} style={{position: 'absolute', left: 1180 + t * 4, top: 560 - t * 3 + t * t * 0.06, width: 44, height: 44, borderRadius: '50%', background: C.sol, border: '4px solid #C98F00', opacity: interpolate(t, [0, 50], [1, 0], clamp)}} />;
  });
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#DCEBF7,#F6F1E6)'}}>
      {/* shopping */}
      <div style={{position: 'absolute', left: 120, top: 160, width: 1000, height: 640, background: '#E9EDF2', borderRadius: 20, boxShadow: '0 30px 60px rgba(0,0,0,0.15)'}}>
        <div style={{height: 110, background: '#8899AA', borderRadius: '20px 20px 0 0', color: '#fff', fontFamily: F.titulo, fontWeight: 800, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4}}>SHOPPING</div>
        <div style={{display: 'flex', gap: 30, padding: 40}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{flex: 1, height: 400, background: 'linear-gradient(180deg,#BFD7EA,#F2F6FA)', borderRadius: 14, border: '6px solid #fff', boxShadow: 'inset 0 0 40px rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {i === 1 ? <IcHouse size={170} bg={C.sol} color="#fff" /> : <div style={{width: 120, height: 160, borderRadius: 12, background: '#D2DAE3'}} />}
            </div>
          ))}
        </div>
      </div>
      {/* cancela de pedágio */}
      <div style={{position: 'absolute', left: 1160, top: 520}}>
        <div style={{width: 60, height: 300, background: '#556677', borderRadius: 10}} />
        <div style={{position: 'absolute', left: 30, top: 20, width: 560, height: 40, borderRadius: 20, background: 'repeating-linear-gradient(90deg, #E8704A 0 60px, #fff 60px 120px)', transformOrigin: '0 50%', transform: `rotate(${gate}deg)`, boxShadow: '0 8px 20px rgba(0,0,0,0.2)'}} />
        <div style={{position: 'absolute', left: -40, top: -120, background: C.coral, color: '#fff', fontFamily: F.titulo, fontWeight: 800, fontSize: 40, padding: '10px 24px', borderRadius: 14}}>PEDÁGIO</div>
      </div>
      {coins}
      <div style={{position: 'absolute', left: 1260, top: 110, width: 600}}>
        <Title start={start + 20} style={{fontSize: 54, color: C.marinho, textShadow: 'none', lineHeight: 1.15}}>
          Procurou a sua loja, achou a <span style={{color: C.coral}}>vitrine do shopping</span>
        </Title>
      </div>
    </AbsoluteFill>
  );
};

const NoHome: React.FC<{start: number; itemsAt: number}> = ({start, itemsAt}) => {
  const f = useCurrentFrame();
  const dash = interpolate(f, [start + 5, start + 60], [0, 1], clamp);
  const items = ['Fotos', 'Preços', 'Jeito de atender'];
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <path d="M 660 520 L 960 280 L 1260 520 L 1260 860 L 660 860 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.8)" strokeWidth={10} strokeDasharray="30 22" strokeLinejoin="round" pathLength={1} style={{strokeDasharray: `${dash * 0.04} 0.025`}} />
      </svg>
      <div style={{position: 'absolute', top: 560, width: 1920, textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, fontSize: 120, color: 'rgba(255,255,255,0.85)'}}>?</div>
      <div style={{position: 'absolute', top: 100, width: 1920, textAlign: 'center'}}>
        <Title start={start + 10} style={{fontSize: 72}}>
          Sem site, <span style={{color: C.sol}}>sem casa própria</span> na internet
        </Title>
      </div>
      {items.map((t, i) => {
        const p = interpolate(f, [itemsAt + i * 18, itemsAt + i * 18 + 15], [0, 1], clamp);
        const x = i === 0 ? 260 : i === 1 ? 1380 : 1320;
        const y = i === 0 ? 520 : i === 1 ? 440 : 640;
        return (
          <div key={t} style={{position: 'absolute', left: x, top: y, opacity: p * 0.75, transform: `translateY(${(1 - p) * 20}px)`, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.texto, fontWeight: 700, fontSize: 40, color: '#fff', border: '3px dashed rgba(255,255,255,0.6)', borderRadius: 18, padding: '14px 26px'}}>
            <IcCheck size={40} color="rgba(255,255,255,0.4)" />
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
