import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, eio, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DeepBg} from '../lib/Scenery';
import {Pipe} from '../lib/Pipe';
import {NightRoom} from '../lib/Rooms';
import {Phone} from '../lib/Phone';
import {Marina} from '../lib/Marina';
import {IcCheck, IcChat} from '../lib/Icons';

const S = scene('Scene08');

export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const tAtend = at(S, 'O atendimento');
  const tNoite = at(S, 'Mas muita gente');
  const tNinguem = at(S, 'Se ninguém');
  const tProx = at(S, 'Ela procura');
  const end = S.frames;
  const open4 = 20;
  const sendF = tNoite + 50;
  return (
    <Shell id="Scene08">
      {/* 1. furo 4 */}
      <Seg a={0} b={tAtend + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.0},
            {f: open4 + 20, z: 1.45, x: -500, y: 60},
            {f: tAtend, z: 1.4, x: -480, y: 50},
          ]}
        >
          <DeepBg />
          <Pipe openAt={[-200, -200, -200, open4]} labels={['Furo 1', 'Furo 2', 'Furo 3', 'Furo 4 — Sem resposta à noite']} flowStart={-400} highlight={3} />
        </Cam>
      </Seg>
      {/* 2. horário de atendimento */}
      <Seg a={tAtend} b={tNoite + 10}>
        <Cam
          keys={[
            {f: tAtend, z: 1.1},
            {f: tAtend + 60, z: 1.0, x: -20},
            {f: tNoite, z: 1.06, x: 30},
          ]}
        >
          <AbsoluteFill style={{background: `linear-gradient(90deg, #FFE9A8 0%, #FFE9A8 50%, ${C.noite2} 50%, ${C.noite} 100%)`}} />
          <div style={{position: 'absolute', left: 0, width: 960, top: 300, textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, color: C.marinho}}>
            <div style={{fontSize: 44}}>Atendimento</div>
            <div style={{fontSize: 150, lineHeight: 1.05}}>7h – 21h</div>
          </div>
          <div style={{position: 'absolute', left: 960, width: 960, top: 300, textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, color: '#fff', opacity: interpolate(f, [tAtend + 40, tAtend + 55], [0, 1], clamp)}}>
            <div style={{fontSize: 44, opacity: 0.8}}>Depois das 21h</div>
            <div style={{fontSize: 150, lineHeight: 1.05, color: C.azulClaro}}>Fechado</div>
          </div>
        </Cam>
      </Seg>
      {/* 3. 22h40: Marina manda mensagem e ninguém responde */}
      <Seg a={tNoite} b={end + 2}>
        <Cam
          keys={[
            {f: tNoite, z: 1.0},
            {f: sendF, z: 1.12, x: -180, y: 30},
            {f: tNinguem, z: 1.08, x: -120},
            {f: tProx, z: 1.2, x: -260, y: 40},
            {f: end, z: 1.25, x: -280, y: 50},
          ]}
        >
          <NightRoom />
          <div style={{position: 'absolute', left: 600, top: 380, transform: 'rotate(-14deg)', transformOrigin: '30% 60%'}}>
            <Marina width={420} legs="sofa" left={{a1: -30, a2: -115}} right={{a1: 6, a2: -20}} phone="left" phoneGlow={1} smile={f > tNinguem ? -0.4 : 0.3} look={0.6} lookY={0.6} />
          </div>
          <Clock x={200} y={110} start={tNoite} fastAt={sendF + 20} />
          <div style={{position: 'absolute', left: 1180, top: 80}}>
            <Phone width={400}>
              <Chat send={sendF} closeAt={tProx + 20} />
            </Phone>
          </div>
          <div style={{position: 'absolute', left: 120, top: 560, opacity: interpolate(f, [at(S, 'quando as crianças'), at(S, 'quando as crianças') + 15], [0, 1], clamp)}}>
            <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 34, color: '#fff', background: 'rgba(255,255,255,0.12)', padding: '12px 24px', borderRadius: 16}}>Quando as crianças dormem</div>
          </div>
        </Cam>
      </Seg>
      <Sfx at={open4} src="water-drop-cave.mp3" vol={0.45} />
      <Sfx at={sendF} src="ui-message-pop.mp3" vol={0.45} />
      <Sfx at={sendF + 20} src="clock-tick-single.mp3" vol={0.35} />
      <Sfx at={sendF + 45} src="clock-tick-single.mp3" vol={0.35} />
      <Sfx at={sendF + 70} src="clock-tick-single.mp3" vol={0.35} />
      <Sfx at={tProx + 20} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

const Clock: React.FC<{x: number; y: number; start: number; fastAt: number}> = ({x, y, start, fastAt}) => {
  const f = useCurrentFrame();
  // 22:40 + tempo acelerado depois do envio
  const extraMin = Math.max(0, f - fastAt) * 0.3;
  const total = 22 * 60 + 40 + extraMin;
  const hh = Math.floor(total / 60) % 24;
  const mm = Math.floor(total % 60);
  const p = usePop(start + 6, 14, 120);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(1, p * 1.4), transform: `scale(${0.8 + p * 0.2})`}}>
      <svg width={300} height={300} viewBox="-100 -100 200 200">
        <circle r={92} fill="#F6F1E6" stroke={C.sol} strokeWidth={8} />
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={-2} y={-84} width={4} height={12} fill={C.marinho} transform={`rotate(${i * 30})`} />
        ))}
        <rect x={-4} y={-50} width={8} height={56} rx={4} fill={C.marinho} transform={`rotate(${((total / 60) % 12) * 30})`} />
        <rect x={-2.5} y={-74} width={5} height={80} rx={2.5} fill={C.coral} transform={`rotate(${(total % 60) * 6})`} />
        <circle r={7} fill={C.marinho} />
      </svg>
      <div style={{textAlign: 'center', fontFamily: F.titulo, fontWeight: 800, fontSize: 60, color: '#fff', marginTop: 4, fontVariantNumeric: 'tabular-nums'}}>
        {String(hh).padStart(2, '0')}h{String(mm).padStart(2, '0')}
      </div>
    </div>
  );
};

const Chat: React.FC<{send: number; closeAt: number}> = ({send, closeAt}) => {
  const f = useCurrentFrame();
  const sp = usePop(send, 13, 140);
  const close = interpolate(f, [closeAt, closeAt + 20], [0, 1], {...clamp, easing: eio});
  return (
    <AbsoluteFill style={{background: '#ECE5DA', fontFamily: F.texto}}>
      <div style={{transform: `translateX(${-close * 110}%)`, position: 'absolute', inset: 0}}>
        <div style={{height: 110, background: C.coqueiroEsc, display: 'flex', alignItems: 'flex-end', padding: '0 18px 16px', gap: 12}}>
          <div style={{width: 46, height: 46, borderRadius: '50%', background: C.sol}} />
          <div style={{color: '#fff'}}>
            <div style={{fontWeight: 700, fontSize: 21}}>Pousada</div>
            <div style={{fontSize: 15, opacity: 0.8}}>visto por último às 21h</div>
          </div>
        </div>
        <div style={{position: 'absolute', right: 16, top: 160, maxWidth: 280, background: '#D7F5C9', borderRadius: '18px 4px 18px 18px', padding: '14px 18px', fontSize: 21, color: C.texto, opacity: Math.min(1, sp * 1.3), transform: `scale(${0.8 + sp * 0.2})`, transformOrigin: 'right top'}}>
          Oi! Tem vaga para janeiro? Quanto fica?
          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, fontSize: 14, color: '#778', marginTop: 4}}>
            22h40 <IcCheck size={20} color="#778" />
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontSize: 18, color: '#889', opacity: interpolate(f, [send + 60, send + 80], [0, 1], clamp)}}>sem resposta…</div>
      </div>
      {/* outra opção */}
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - close) * 110}%)`, background: '#fff', padding: '120px 20px'}}>
        <div style={{fontWeight: 700, fontSize: 24, color: C.texto, marginBottom: 16}}>Outras opções</div>
        {['Pousada X', 'Hotel Y', 'Pousada Z'].map((n) => (
          <div key={n} style={{display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 14, background: '#F1F4F8', marginBottom: 12}}>
            <div style={{width: 70, height: 56, borderRadius: 10, background: '#C9D3DE'}} />
            <div style={{fontWeight: 600, fontSize: 20}}>{n}</div>
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
          <IcChat size={70} bg={C.coqueiro} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

