import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, CountUp, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {Coffee, DayRoom, Laptop, SearchBar} from '../lib/Rooms';
import {Marina} from '../lib/Marina';
import {IcCheck, IcSearch} from '../lib/Icons';

const S = scene('Scene03');

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const tMuda = at(S, 'Agora tudo muda');
  const tData = at(S, 'Ela tem data');
  const tFaz = at(S, 'E o que ela faz');
  const tAbre = at(S, 'Ela abre o Google');
  const tPessoa = at(S, 'Essa é a pessoa');
  const tComprando = at(S, 'porque ela não está');
  const tRegiao = at(S, 'Só nessa região');
  const end = S.frames;
  // corte seco do escuro para o dia: flash de luz no primeiro frame
  const flash = interpolate(f, [0, 8], [0.85, 0], clamp);
  return (
    <Shell id="Scene03">
      {/* 1. de dia: Marina à mesa com notebook, celular, calendário e café */}
      <Seg a={0} b={tAbre + 10} d={1}>
        <Cam
          keys={[
            {f: 0, z: 1.15, x: 150, y: 40},
            {f: tMuda, z: 1.05, x: 60},
            {f: tData, z: 1.0},
            {f: tFaz, z: 1.08, x: -120, y: 20},
            {f: tAbre, z: 1.25, x: -300, y: 60},
          ]}
        >
          <DayRoom calendarAt={tData + 10} />
          <div style={{position: 'absolute', left: 700, top: 250}}>
            <Marina width={420} legs="none" left={{a1: 6, a2: -10}} right={{a1: 55, a2: 25}} smile={0.9} look={0.7} lookY={0.4} />
          </div>
          <Laptop style={{left: 1060, top: 440}}>
            <div style={{padding: 30, display: 'flex', flexDirection: 'column', gap: 18}}>
              <div style={{height: 26, width: '60%', borderRadius: 13, background: '#EEF2F6'}} />
              <div style={{height: 26, width: '80%', borderRadius: 13, background: '#EEF2F6'}} />
              <div style={{height: 120, borderRadius: 16, background: 'linear-gradient(135deg,#BEE3F8,#FDF3D8)'}} />
            </div>
          </Laptop>
          <Coffee x={560} y={640} />
          <div style={{position: 'absolute', left: 380, top: 740, width: 120, height: 66, borderRadius: 14, background: '#1B2430', transform: 'rotate(-8deg)', boxShadow: '0 10px 20px rgba(0,0,0,0.25)'}} />
          <Seg a={tData} b={tFaz + 5}>
            <div style={{position: 'absolute', left: 120, top: 480}}>
              {[
                ['Data', tData + 6],
                ['Destino', at(S, 'Ela tem data') + 40],
                ['Dinheiro separado', at(S, 'Ela tem data') + 80],
              ].map(([t, s]) => (
                <Item key={t as string} start={s as number} text={t as string} />
              ))}
            </div>
          </Seg>
          <div style={{position: 'absolute', top: 40, width: 1920, textAlign: 'center'}}>
            <Title start={tMuda} end={tData + 10} style={{fontSize: 92, color: C.marinho, textShadow: 'none'}}>
              Agora <span style={{color: C.mar}}>tudo muda.</span>
            </Title>
          </div>
        </Cam>
      </Seg>
      {/* 2. a busca: pousada em Canavieiras */}
      <Seg a={tAbre} b={tRegiao + 10}>
        <Cam
          keys={[
            {f: tAbre, z: 1.15, y: 40},
            {f: tAbre + 90, z: 1.0},
            {f: tPessoa, z: 1.04, x: -30},
            {f: tRegiao, z: 1.12, x: 20, y: -20},
          ]}
        >
          <AbsoluteFill style={{background: 'linear-gradient(180deg,#FFFFFF,#EEF4FA)'}} />
          <div style={{position: 'absolute', left: 960 - 520, top: 300}}>
            <SearchBar text="pousada em Canavieiras" start={tAbre + 30} width={1040} />
          </div>
          <div style={{position: 'absolute', top: 470, width: 1920, display: 'flex', justifyContent: 'center', gap: 30}}>
            <Tag start={tPessoa + 10} text="Está comprando" color={C.coqueiro} />
            <Tag start={tComprando + 10} text="Não está passeando" color="#8899AA" strike />
          </div>
          <div style={{position: 'absolute', top: 120, width: 1920, textAlign: 'center'}}>
            <Title start={tPessoa} style={{fontSize: 64, color: C.marinho, textShadow: 'none'}}>
              Essa é a pessoa que a pousada <span style={{color: C.mar}}>precisa receber</span>
            </Title>
          </div>
        </Cam>
      </Seg>
      {/* 3. 1.000 a 2.500 buscas por mês */}
      <Seg a={tRegiao} b={end + 2}>
        <Cam
          keys={[
            {f: tRegiao, z: 1.1, x: 40},
            {f: tRegiao + 80, z: 1.0},
            {f: end, z: 1.07, x: -30, y: 10},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #2A6FB8, ${C.marinho} 80%)`}} />
          <SearchRain start={tRegiao} />
          <div style={{position: 'absolute', top: 300, width: 1920, textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, color: '#fff', fontSize: 170, lineHeight: 1, textShadow: '0 10px 40px rgba(0,0,0,0.4)'}}>
            <CountUp to={1000} start={tRegiao + 20} dur={45} /> <span style={{fontSize: 100, opacity: 0.8}}>a</span> <CountUp to={2500} start={tRegiao + 45} dur={55} style={{color: C.sol}} />
          </div>
          <div style={{position: 'absolute', top: 500, width: 1920, textAlign: 'center', fontFamily: F.texto, fontWeight: 700, color: '#fff', fontSize: 64, opacity: interpolate(f, [tRegiao + 60, tRegiao + 80], [0, 1], clamp)}}>
            buscas por mês
          </div>
        </Cam>
      </Seg>
      <AbsoluteFill style={{background: '#FFF8E0', opacity: flash, pointerEvents: 'none'}} />
      <Sfx at={0} src="air-woosh-deep.mp3" vol={0.35} />
      <Sfx at={tAbre + 30} src="paper-slide.mp3" vol={0.2} />
      <Sfx at={tRegiao + 20} src="shimmer-sparkle-sweep.mp3" vol={0.3} />
    </Shell>
  );
};

const Item: React.FC<{start: number; text: string}> = ({start, text}) => {
  const p = usePop(start, 12, 150);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, opacity: Math.min(1, p * 1.4), transform: `scale(${0.8 + p * 0.2})`, transformOrigin: 'left center'}}>
      <div style={{width: 64, height: 64, borderRadius: 18, background: C.coqueiro, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.2)'}}>
        <IcCheck size={50} />
      </div>
      <div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 44, color: C.marinho, background: 'rgba(255,255,255,0.85)', padding: '6px 18px', borderRadius: 14}}>{text}</div>
    </div>
  );
};

const Tag: React.FC<{start: number; text: string; color: string; strike?: boolean}> = ({start, text, color, strike}) => {
  const p = usePop(start, 13, 140);
  return (
    <div style={{opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 30}px)`, background: color, color: '#fff', fontFamily: F.texto, fontWeight: 800, fontSize: 40, padding: '16px 34px', borderRadius: 999, textDecoration: strike ? 'line-through' : undefined, boxShadow: '0 12px 30px rgba(0,0,0,0.2)'}}>
      {text}
    </div>
  );
};

const SearchRain: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 40}).map((_, i) => {
        const t = f - start - i * 4;
        if (t < 0) return null;
        const x = ((i * 137) % 1800) + 60;
        const y = 1100 - ((t * (3 + (i % 4))) % 1300);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: 0.35}}>
            <IcSearch size={40 + (i % 3) * 16} bg="rgba(255,255,255,0.25)" color="#fff" />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
