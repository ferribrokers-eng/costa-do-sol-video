import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, CountUp, eio, kf, Photo, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {SearchBar} from '../lib/Rooms';
import {Drop, Stars} from '../lib/Icons';

const S = scene('Scene04');

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const tPrimeiro = at(S, 'a Costa do Sol aparece');
  const tRep = at(S, 'A reputação');
  const tGosta = at(S, 'A Marina gosta');
  const tClica = at(S, 'Ela quer saber');
  const tVaz = at(S, 'É aqui que');
  const end = S.frames;
  const clickF = tClica + 40;
  // cursor
  const cx = kf(f, [
    [tGosta, 1500],
    [clickF - 6, 860],
  ]);
  const cy = kf(f, [
    [tGosta, 950],
    [clickF - 6, 560],
  ]);
  const press = interpolate(f, [clickF - 4, clickF, clickF + 6], [1, 0.85, 1], clamp);
  const ripple = interpolate(f, [clickF, clickF + 22], [0, 1], clamp);
  return (
    <Shell id="Scene04">
      <Seg a={0} b={tVaz + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.05, y: 60},
            {f: tPrimeiro, z: 1.0, y: 0},
            {f: tPrimeiro + 50, z: 1.18, x: 170, y: 40},
            {f: tRep, z: 1.1, x: 60, y: 10},
            {f: tGosta, z: 1.05, x: 80},
            {f: clickF, z: 1.22, x: 180, y: 50},
            {f: tVaz, z: 1.3, x: 200, y: 60},
          ]}
        >
          <AbsoluteFill style={{background: 'linear-gradient(180deg,#FFFFFF,#EEF4FA)'}} />
          <div style={{position: 'absolute', left: 120, top: 60}}>
            <SearchBar text="pousada em Canavieiras" start={-999} width={1000} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 190, fontFamily: F.texto, fontWeight: 700, fontSize: 34, color: C.texto}}>Hotéis</div>
          <div style={{position: 'absolute', left: 120, top: 250, display: 'flex', flexDirection: 'column', gap: 22}}>
            <Listing rank={1} name="Pousada Costa do Sol" img="piscina.jpg" rating={4.8} reviews={188} start={20} glowAt={tPrimeiro} highlight />
            <Listing rank={2} name="Pousada A" rating={4.3} reviews={64} start={30} dim={f > tPrimeiro ? 0.45 : 1} />
            <Listing rank={3} name="Hotel B" rating={4.1} reviews={92} start={40} dim={f > tPrimeiro ? 0.45 : 1} />
          </div>
          <Badge start={tPrimeiro + 10} />
          <Seg a={tRep} b={tVaz}>
            <div style={{position: 'absolute', left: 1160, top: 560, width: 560}}>
              <Title start={tRep + 4} style={{fontSize: 50, color: C.marinho, textShadow: 'none', lineHeight: 1.15}}>
                A reputação já fez o <span style={{color: C.mar}}>trabalho mais difícil</span>
              </Title>
            </div>
          </Seg>
          {/* cursor */}
          {f >= tGosta ? (
            <div style={{position: 'absolute', left: cx, top: cy, transform: `scale(${press})`}}>
              <div style={{position: 'absolute', left: -40, top: -40, width: 80, height: 80, borderRadius: '50%', border: `5px solid ${C.sol}`, transform: `scale(${ripple * 2})`, opacity: 1 - ripple}} />
              <svg width={50} height={64} viewBox="0 0 50 64">
                <path d="M 4 4 L 4 52 L 16 41 L 25 60 L 33 56 L 24 38 L 41 38 Z" fill="#fff" stroke="#111" strokeWidth={3.5} strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
        </Cam>
      </Seg>
      {/* é aqui que começam os vazamentos */}
      <Seg a={tVaz} b={end + 2}>
        <Cam
          keys={[
            {f: tVaz, z: 1.12},
            {f: tVaz + 60, z: 1.04, y: -10},
            {f: end, z: 1.0, y: 10},
          ]}
        >
          <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #1E5C9E, ${C.marinho} 80%)`}} />
          <Leak start={tVaz} />
          <div style={{position: 'absolute', top: 330, width: 1920, textAlign: 'center'}}>
            <Title start={tVaz + 8} style={{fontSize: 96}}>
              É aqui que começam
              <br />
              os <span style={{color: C.azulClaro}}>vazamentos</span>
            </Title>
          </div>
        </Cam>
      </Seg>
      <Sfx at={tPrimeiro + 10} src="sparkle-touch.mp3" vol={0.35} />
      <Sfx at={clickF} src="pop.mp3" vol={0.4} />
      <Sfx at={tVaz + 4} src="water-drop-cave.mp3" vol={0.45} />
    </Shell>
  );
};

const Listing: React.FC<{rank: number; name: string; img?: string; rating: number; reviews: number; start: number; highlight?: boolean; glowAt?: number; dim?: number}> = ({name, img, rating, reviews, start, highlight, glowAt = 0, dim = 1}) => {
  const f = useCurrentFrame();
  const p = usePop(start, 15, 120);
  const g = highlight ? interpolate(f, [glowAt, glowAt + 20], [0, 1], clamp) : 0;
  const pulse = g * (0.6 + 0.4 * Math.sin(f / 8));
  const stars = interpolate(f, [glowAt, glowAt + 40], [0, rating], {...clamp, easing: eio});
  return (
    <div
      style={{
        width: 1000,
        height: 210,
        borderRadius: 22,
        background: '#fff',
        display: 'flex',
        gap: 26,
        padding: 18,
        boxSizing: 'border-box',
        opacity: Math.min(1, p * 1.3) * dim,
        transform: `translateY(${(1 - p) * 30}px) scale(${1 + g * 0.03})`,
        transformOrigin: 'left center',
        boxShadow: highlight ? `0 0 0 ${6 * g}px ${C.sol}, 0 0 ${60 * pulse}px rgba(245,184,0,${0.7 * pulse}), 0 16px 40px rgba(0,0,0,0.15)` : '0 10px 30px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{width: 260, height: 174, borderRadius: 14, overflow: 'hidden', background: '#DDE4EC', flexShrink: 0}}>{img ? <Img src={staticFile('fotos/' + img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}</div>
      <div style={{fontFamily: F.texto, paddingTop: 10}}>
        <div style={{fontWeight: 700, fontSize: 40, color: C.texto}}>{name}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 14}}>
          <span style={{fontWeight: 800, fontSize: 36, color: C.texto}}>{highlight ? <CountUp to={rating} start={glowAt} dur={40} decimals={1} /> : rating.toFixed(1).replace('.', ',')}</span>
          <Stars value={highlight ? stars : rating} size={40} gap={3} />
          <span style={{fontSize: 30, color: '#667'}}>({reviews})</span>
        </div>
        <div style={{fontSize: 28, color: '#667', marginTop: 12}}>{highlight ? 'Pé na areia • Piscina • Café incluso' : 'Canavieiras, BA'}</div>
      </div>
    </div>
  );
};

const Badge: React.FC<{start: number}> = ({start}) => {
  const p = usePop(start, 10, 160);
  return (
    <div style={{position: 'absolute', left: 1050, top: 222, width: 150, height: 150, borderRadius: '50%', background: C.sol, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`, boxShadow: '0 16px 40px rgba(0,0,0,0.25)', fontFamily: F.titulo, color: C.marinho}}>
      <div style={{fontWeight: 800, fontSize: 64, lineHeight: 1}}>1º</div>
      <div style={{fontWeight: 700, fontSize: 24}}>lugar</div>
    </div>
  );
};

const Leak: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 30}).map((_, i) => {
        const t = f - start - i * 5;
        if (t < 0) return null;
        const x = 200 + ((i * 271) % 1520);
        const y = -60 + ((t * t * 0.03 + t * 2) % 1200);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: 0.8}}>
            <Drop size={30 + (i % 3) * 8} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
