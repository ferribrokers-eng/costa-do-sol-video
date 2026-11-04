import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, CountUp, eio, kf, Photo, Pill, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DawnSky, Glass, Logo, PalmLeaf, Sea, Sun} from '../lib/Scenery';
import {Drop, IcPin, Stars} from '../lib/Icons';

const S = scene('Scene01');

const RatingCard: React.FC<{start: number; label: string; score: string; scoreNum: number; max: number; reviews: number; dx: number}> = ({start, label, score, scoreNum, max, reviews, dx}) => {
  const p = usePop(start, 14, 110);
  return (
    <Glass style={{position: 'absolute', left: 960 + dx - 330, top: 300, width: 660, padding: '40px 40px 36px', textAlign: 'center', opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * 60}px)`}}>
      <div style={{fontFamily: F.texto, fontWeight: 800, letterSpacing: 2, color: C.marinho, fontSize: 34}}>{label}</div>
      <div style={{fontFamily: F.titulo, fontWeight: 800, color: C.mar, fontSize: 150, lineHeight: 1.05}}>
        <CountUp to={scoreNum} start={start + 6} dur={45} decimals={1} />
        <span style={{fontSize: 56, color: C.texto, opacity: 0.55}}>{` / ${max}`}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', margin: '4px 0 14px'}}>
        <StarsAnim start={start + 6} value={(scoreNum / max) * 5} />
      </div>
      <div style={{fontFamily: F.texto, fontWeight: 600, color: C.texto, fontSize: 34}}>
        <CountUp to={reviews} start={start + 6} dur={50} /> avaliações
      </div>
      <span style={{display: 'none'}}>{score}</span>
    </Glass>
  );
};

const StarsAnim: React.FC<{start: number; value: number}> = ({start, value}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [start, start + 45], [0, value], {...clamp, easing: eio});
  return <Stars value={v} size={62} />;
};

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const tCity = at(S, 'Em Canavieiras') + 75;
  const tRate = at(S, 'São 188');
  const tVolta = at(S, 'Quem conhece');
  const tPerg = at(S, 'Mas existe');
  const tHist = at(S, 'Esta é a história');
  const end = S.frames;
  // amanhecer: sol sobe do horizonte
  const sunY = kf(f, [
    [0, 760],
    [150, 470],
  ]);
  const dawn = interpolate(f, [0, 170], [0, 1], clamp);
  const logoP = usePop(120, 12, 90);
  return (
    <Shell id="Scene01">
      {/* 1. amanhecer ilustrado + logo com o sol nascendo atrás */}
      <Seg a={0} b={tCity + 10} d={18}>
        <Cam
          keys={[
            {f: 0, z: 1.18, y: 160},
            {f: 120, z: 1.08, y: 40},
            {f: tCity, z: 1.0, y: -80},
          ]}
        >
          <DawnSky p={dawn} />
          <div style={{position: 'absolute', left: 960 - 260, top: sunY - 260}}>
            <Sun size={520} />
          </div>
          <Sea top={640} />
          <PalmLeaf x={-120} y={-200} rot={38} scale={0.75} blur={5} opacity={0.95} />
          <PalmLeaf x={2040} y={-120} rot={150} scale={0.7} blur={5} opacity={0.95} />
          <div style={{position: 'absolute', left: 960 - 190, top: 260 + (1 - logoP) * 40, opacity: Math.min(1, logoP * 1.4), transform: `scale(${0.7 + logoP * 0.3})`}}>
            <Logo size={380} />
          </div>
        </Cam>
      </Seg>
      {/* 2. câmera desce até a areia em frente à pousada (foto real) */}
      <Seg a={tCity - 10} b={tRate + 12} d={20}>
        <Cam
          keys={[
            {f: tCity - 10, z: 1.12, y: -120},
            {f: tCity + 60, z: 1.04, y: 0},
            {f: tRate, z: 1.1, x: -30, y: 20},
          ]}
        >
          <Photo src="aerea.jpg" from={tCity - 10} dur={tRate - tCity + 30} z0={1.25} z1={1.08} y0={-6} y1={2} />
        </Cam>
        <AbsoluteFill style={{background: 'linear-gradient(20deg, rgba(8,20,40,0.75) 0%, rgba(8,20,40,0.35) 35%, transparent 60%)'}} />
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 0 190px 110px'}}>
          <Title start={tCity + 25} style={{fontSize: 92, lineHeight: 1}}>
            Canavieiras
            <div style={{fontSize: 44, fontWeight: 600, color: C.sol, marginTop: 10, letterSpacing: 6}}>SUL DA BAHIA • PÉ NA AREIA</div>
          </Title>
        </AbsoluteFill>
      </Seg>
      {/* 3. avaliações */}
      <Seg a={tRate} b={tVolta + 10}>
        <Cam
          keys={[
            {f: tRate, z: 1.08, x: 20},
            {f: tRate + 80, z: 1.02, x: 0},
            {f: tVolta, z: 1.06, x: 0, y: -10},
          ]}
        >
          <Photo src="piscina.jpg" from={tRate} dur={tVolta - tRate} z0={1.12} z1={1.22} blur={7} />
          <AbsoluteFill style={{background: 'rgba(10,30,60,0.25)'}} />
          <RatingCard start={tRate + 4} label="GOOGLE" score="4,8" scoreNum={4.8} max={5} reviews={188} dx={-370} />
          <RatingCard start={tRate + 170} label="BOOKING" score="9,4" scoreNum={9.4} max={10} reviews={119} dx={370} />
        </Cam>
      </Seg>
      {/* 4. quem conhece, volta */}
      <Seg a={tVolta} b={tPerg + 10}>
        <Cam
          keys={[
            {f: tVolta, z: 1.0, x: -20},
            {f: Math.min(tVolta + 60, Math.round((tVolta + tPerg) / 2)), z: 1.05, x: 10},
            {f: tPerg, z: 1.12, x: 30, y: -10},
          ]}
        >
          <Photo src="chale.jpg" from={tVolta} dur={tPerg - tVolta + 10} z0={1.08} z1={1.2} x0={2} x1={-3} />
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,25,50,0.6), transparent 60%)'}} />
          <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 120}}>
            <Title start={tVolta + 4} style={{fontSize: 110, lineHeight: 1.05}}>
              Quem conhece,
              <br />
              <span style={{color: C.sol}}>volta.</span>
            </Title>
          </AbsoluteFill>
        </Cam>
      </Seg>
      {/* 5. e quem ainda não conhece? */}
      <Seg a={tPerg} b={tHist + 10}>
        <Cam
          keys={[
            {f: tPerg, z: 1.15},
            {f: tPerg + 70, z: 1.04, y: -10},
            {f: tHist, z: 1.0, x: -20, y: 10},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #24589A, ${C.marinho} 70%)`}} />
          <QuestionCrowd start={tPerg} />
          <AbsoluteFill style={{alignItems: 'center', paddingTop: 120}}>
            <Title start={at(S, 'e quem ainda')} style={{fontSize: 84, textAlign: 'center'}}>
              E quem <span style={{color: C.sol}}>ainda não conhece?</span>
            </Title>
          </AbsoluteFill>
        </Cam>
      </Seg>
      {/* 6. uma viagem... e alguns vazamentos */}
      <Seg a={tHist} b={end + 2} d={16}>
        <Cam
          keys={[
            {f: tHist, z: 1.1, x: 40, y: 30},
            {f: tHist + 90, z: 1.02, x: 0},
            {f: end, z: 1.07, x: -20, y: -10},
          ]}
        >
          <TripMap start={tHist} />
        </Cam>
      </Seg>
      <Sfx at={0} src="mar.wav" vol={0.5} />
      <Sfx at={110} src="shimmer-sparkle-sweep.mp3" vol={0.35} />
      <Sfx at={tCity - 14} src="swoosh-slow.mp3" vol={0.35} />
      <Sfx at={tRate + 4} src="pop.mp3" vol={0.35} />
      <Sfx at={tRate + 170} src="pop.mp3" vol={0.35} />
      <Sfx at={tPerg} src="air-woosh-deep.mp3" vol={0.3} />
      <Sfx at={tHist + 50} src="water-drop-cave.mp3" vol={0.4} />
    </Shell>
  );
};

const QuestionCrowd: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 9}).map((_, i) => {
        const p = interpolate(f - start - i * 4, [0, 20], [0, 1], {...clamp, easing: eio});
        const x = 260 + i * 175;
        const h = 250 + ((i * 37) % 5) * 18;
        const blur = Math.abs(i - 4) * 1.4;
        const bob = Math.sin(f / 18 + i) * 6;
        return (
          <div key={i} style={{position: 'absolute', left: x - 60, top: 1080 - h - 120 + bob + (1 - p) * 80, opacity: p, filter: `blur(${blur}px)`}}>
            <svg width={120} height={h} viewBox={`0 0 120 ${h}`}>
              <circle cx={60} cy={40} r={34} fill="rgba(255,255,255,0.85)" />
              <path d={`M 10 ${h} Q 10 90 60 90 Q 110 90 110 ${h} Z`} fill="rgba(255,255,255,0.85)" />
            </svg>
            <div style={{position: 'absolute', top: -70, width: 120, textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, fontSize: 64, color: C.sol, transform: `rotate(${Math.sin(f / 12 + i) * 8}deg)`}}>?</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** mapa estilizado: rota de Salvador até Canavieiras com gotas vazando no caminho */
const TripMap: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start + 10, start + 120], [0, 1], {...clamp, easing: eio});
  const path = 'M 360 300 C 640 260 760 520 1000 560 S 1400 700 1560 780';
  const len = 1500;
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${C.areia}, #EAD9B3)`}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {/* mar do lado direito */}
        <path d="M 1300 -10 C 1500 300 1580 600 1760 1090 L 1930 1090 L 1930 -10 Z" fill={C.azulClaro} opacity={0.65} />
        <path d="M 1380 -10 C 1580 300 1660 600 1840 1090 L 1930 1090 L 1930 -10 Z" fill={C.mar} opacity={0.5} />
        <path d={path} stroke="rgba(0,0,0,0.12)" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={path} stroke={C.mar} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={`${len * p} ${len}`} />
      </svg>
      <div style={{position: 'absolute', left: 300, top: 180}}>
        <IcPin size={120} color={C.coral} bg="#fff" />
        <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 32, color: C.texto, marginLeft: -20}}>Salvador</div>
      </div>
      <div style={{position: 'absolute', left: 1500, top: 650, opacity: interpolate(p, [0.85, 1], [0, 1], clamp)}}>
        <IcPin size={130} color={C.sol} bg={C.mar} />
        <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 32, color: C.texto, marginLeft: -40}}>Canavieiras</div>
      </div>
      {/* gotas vazando ao longo da rota */}
      {[0.35, 0.55, 0.75].map((q, i) => {
        const s0 = start + 10 + q * 110;
        const dt = f - s0;
        if (dt < 0) return null;
        const xs = [880, 1130, 1350][i];
        const ys = [470, 600, 690][i];
        return (
          <React.Fragment key={i}>
            {[0, 1, 2].map((k) => {
              const d = (dt - k * 22) % 66;
              if (dt - k * 22 < 0) return null;
              return (
                <div key={k} style={{position: 'absolute', left: xs - 14, top: ys + d * d * 0.05 + d, opacity: 1 - d / 66}}>
                  <Drop size={30} />
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
      <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 230px 220px'}}>
        <Title start={start + 40} style={{fontSize: 74, color: C.marinho, textShadow: '0 4px 18px rgba(243,230,204,0.9)'}}>
          Uma viagem…
          <br />
          <span style={{color: C.mar}}>e alguns vazamentos</span>
        </Title>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 90, top: 70}}>
        <Pill bg={C.marinho} color="#fff">
          Salvador → Canavieiras
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
