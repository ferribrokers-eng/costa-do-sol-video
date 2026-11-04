import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {at, scene} from '../lib/timeline';
import {Cam, clamp, eio, kf, Photo, rnd, Title, usePop} from '../lib/fx';
import {Seg, Sfx, Shell} from '../lib/Shell';
import {DeepBg, Logo} from '../lib/Scenery';
import {Pipe} from '../lib/Pipe';
import {Phone} from '../lib/Phone';
import {Drop, IcChat, IcCheck, IcGlobe, IcSearch, Stars} from '../lib/Icons';
import {Marina} from '../lib/Marina';

const S = scene('Scene10');
const SEALS = ['1. Site oficial (vitrine)', '2. Google Meu Negócio estruturado', '3. 1ª página orgânica', '4. WhatsApp com clientes filtrados'];

export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  const tPasso = at(S, 'O primeiro passo');
  const tSite = at(S, 'bonito no celular');
  const tSeg = at(S, 'Segundo');
  const tTer = at(S, 'Terceiro');
  const tMelhor = at(S, 'E o melhor');
  const tAcabam = at(S, 'Acabam');
  const end = S.frames;
  const seal = [tPasso + 40, tSeg + 20, tTer + 20, tMelhor + 10];
  return (
    <Shell id="Scene10">
      {/* 1. o cano com os 4 furos vazando; o primeiro é selado */}
      <Seg a={0} b={tSite + 10}>
        <Cam
          keys={[
            {f: 0, z: 1.0},
            {f: tPasso, z: 1.04, x: 40},
            {f: tPasso + 40, z: 1.5, x: 500, y: 0},
            {f: tSite, z: 1.38, x: 470, y: 10},
          ]}
        >
          <DeepBg />
          <Pipe openAt={[0, 0, 0, 0]} sealAt={seal} flowStart={-400} />
          <div style={{position: 'absolute', top: 110, width: 1920, textAlign: 'center'}}>
            <Title start={12} end={tPasso + 30} style={{fontSize: 76}}>
              A solução começa pela <span style={{color: C.sol}}>vitrine</span>
            </Title>
          </div>
          <SealTag start={seal[0]} />
        </Cam>
      </Seg>
      {/* 2. o site oficial no celular */}
      <Seg a={tSite} b={tSeg + 10}>
        <SiteShowcase start={tSite} end={tSeg} />
      </Seg>
      {/* 3. Google Meu Negócio + orgânico: selam os furos 2, 3 e 4 */}
      <Seg a={tSeg} b={tMelhor + 75}>
        <Cam
          keys={[
            {f: tSeg, z: 1.12, x: 60, y: -10},
            {f: tSeg + 50, z: 1.06, x: 30},
            {f: tTer, z: 1.05, x: -20},
            {f: tTer + 50, z: 1.08, x: -50, y: 10},
            {f: tMelhor, z: 1.0},
          ]}
        >
          <DeepBg />
          <div style={{position: 'absolute', inset: 0, transform: 'translateY(-40px)'}}>
            <Pipe openAt={[0, 0, 0, 0]} sealAt={[-60, ...seal.slice(1)]} flowStart={-400} />
          </div>
          <Checklist seal={seal} />
          <SideCard start={tSeg + 30} end={tTer} x={130} title="Google Meu Negócio" lines={['Fotos, horários e avaliações', 'Botão "Site" → site oficial']} />
          <SideCard start={tTer + 30} end={tMelhor} x={1290} title="1ª página no Google" lines={['Aparece de forma natural', 'Sem anúncio pago']} />
        </Cam>
      </Seg>
      {/* 4. o funil: só os clientes prontos seguem para o WhatsApp */}
      <Seg a={tMelhor + 60} b={tAcabam + 10}>
        <Cam
          keys={[
            {f: tMelhor + 60, z: 1.08, y: 30},
            {f: tMelhor + 150, z: 1.0, y: 0},
            {f: tAcabam, z: 1.05, x: -20, y: -10},
          ]}
        >
          <Funnel start={tMelhor + 60} />
        </Cam>
      </Seg>
      {/* 5. fluxo final: busca → site → conversa → reserva confirmada */}
      <Seg a={tAcabam} b={end + 2}>
        <Cam
          keys={[
            {f: tAcabam, z: 1.06, x: 40},
            {f: tAcabam + 100, z: 1.0, x: 0},
            {f: end, z: 1.05, x: -20, y: -10},
          ]}
        >
          <FlowIcons start={tAcabam} />
        </Cam>
      </Seg>
      {seal.map((s, i) => (
        <React.Fragment key={i}>
          <Sfx at={s - 4} src="lock-quick.mp3" vol={0.45} />
          <Sfx at={s} src="sparkle-touch.mp3" vol={0.35} />
        </React.Fragment>
      ))}
      <Sfx at={tSite - 10} src="swoosh-slow.mp3" vol={0.35} />
      <Sfx at={tMelhor + 50} src="air-woosh-deep.mp3" vol={0.3} />
      <Sfx at={tAcabam - 8} src="swoosh-slow.mp3" vol={0.3} />
    </Shell>
  );
};

const SideCard: React.FC<{start: number; end: number; x: number; title: string; lines: string[]}> = ({start, end, x, title, lines}) => {
  const f = useCurrentFrame();
  const p = usePop(start, 14, 120);
  const o = interpolate(f, [end - 10, end + 5], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 690,
        width: 500,
        background: '#fff',
        borderRadius: 26,
        padding: '26px 32px',
        boxShadow: `0 0 0 5px ${C.sol}, 0 30px 70px rgba(0,0,0,0.4)`,
        opacity: Math.min(1, p * 1.3) * o,
        transform: `translateY(${(1 - p) * 50}px)`,
        fontFamily: F.texto,
      }}
    >
      <div style={{fontWeight: 800, fontSize: 34, color: C.marinho}}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{fontWeight: 500, fontSize: 27, color: C.texto, marginTop: 8, display: 'flex', alignItems: 'center', gap: 10}}>
          <IcCheck size={30} color={C.coqueiro} />
          {l}
        </div>
      ))}
    </div>
  );
};

/** site oficial bonito no celular, rolando pelas seções com fotos reais */
const SiteShowcase: React.FC<{start: number; end: number}> = ({start, end}) => {
  const f = useCurrentFrame();
  const dur = end - start;
  const scroll = kf(f, [
    [start + 30, 0],
    [start + dur * 0.3, 430],
    [start + dur * 0.55, 800],
    [start + dur * 0.85, 1060],
  ]);
  const phoneP = usePop(start, 16, 90);
  const callouts = [
    {t: 0.05, txt: 'Rápido', x: 300, y: 260},
    {t: 0.14, txt: 'Bonito no celular', x: 230, y: 420},
    {t: 0.24, txt: 'Com as cores da pousada', x: 190, y: 580},
    {t: 0.6, txt: 'Fotos reais', x: 1260, y: 300},
    {t: 0.72, txt: 'Tudo o que a estadia oferece', x: 1240, y: 460},
  ];
  return (
    <AbsoluteFill>
      <Cam
        keys={[
          {f: start, z: 1.08, y: 40},
          {f: start + dur * 0.4, z: 1.0},
          {f: end, z: 1.06, x: -20, y: -20},
        ]}
      >
        <Photo src="aerea.jpg" from={start} dur={dur} z0={1.2} z1={1.3} blur={16} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(15,63,116,0.55), rgba(19,41,75,0.7))'}} />
        <div style={{position: 'absolute', left: 960 - 230, top: 40 + (1 - phoneP) * 300, transform: `rotate(${(1 - phoneP) * 6 + Math.sin(f / 50) * 0.6}deg)`}}>
          <Phone width={460}>
            <div style={{transform: `translateY(${-scroll}px)`}}>
              <SitePage />
            </div>
          </Phone>
        </div>
        {callouts.map((c, i) => {
          const tt = start + Math.round(dur * c.t);
          return <Callout key={i} start={tt} x={c.x} y={c.y} text={c.txt} right={c.x > 960} />;
        })}
      </Cam>
    </AbsoluteFill>
  );
};

const Callout: React.FC<{start: number; x: number; y: number; text: string; right?: boolean}> = ({start, x, y, text, right}) => {
  const p = usePop(start, 13, 140);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: Math.min(1, p * 1.4),
        transform: `translateX(${(1 - p) * (right ? 60 : -60)}px) scale(${0.9 + p * 0.1})`,
        background: C.sol,
        color: C.marinho,
        fontFamily: F.texto,
        fontWeight: 800,
        fontSize: 34,
        padding: '14px 28px',
        borderRadius: 999,
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <IcCheck size={34} color={C.marinho} />
      {text}
    </div>
  );
};

const Tile: React.FC<{img?: string; label: string; icon?: React.ReactNode}> = ({img, label, icon}) => (
  <div style={{borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.12)'}}>
    <div style={{height: 150, background: img ? undefined : `linear-gradient(135deg, ${C.azulClaro}, ${C.mar})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {img ? <Img src={staticFile('fotos/' + img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : icon}
    </div>
    <div style={{padding: '10px 14px', fontFamily: F.texto, fontWeight: 700, fontSize: 21, color: C.marinho}}>{label}</div>
  </div>
);

const Bed = () => (
  <svg viewBox="0 0 100 100" width={90} height={90}>
    <rect x={14} y={48} width={72} height={22} rx={6} fill="#fff" />
    <rect x={20} y={36} width={22} height={14} rx={5} fill="#fff" opacity={0.85} />
    <rect x={10} y={30} width={8} height={46} rx={3} fill="#fff" />
    <rect x={82} y={44} width={8} height={32} rx={3} fill="#fff" />
  </svg>
);
const Ball = () => (
  <svg viewBox="0 0 100 100" width={90} height={90}>
    <circle cx={50} cy={50} r={30} fill="#fff" />
    <path d="M 22 40 Q 50 52 78 40 M 50 20 Q 40 50 52 80 M 26 64 Q 52 56 74 66" stroke={C.mar} strokeWidth={4} fill="none" />
  </svg>
);

/** página do site oficial (mock) */
const SitePage: React.FC = () => (
  <div style={{width: 430, fontFamily: F.texto}}>
    <div style={{height: 520, position: 'relative'}}>
      <Img src={staticFile('fotos/aerea.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), transparent 35%, rgba(19,41,75,0.85))'}} />
      <div style={{position: 'absolute', top: 50, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Logo size={120} />
      </div>
      <div style={{position: 'absolute', bottom: 34, left: 26, right: 26, color: '#fff'}}>
        <div style={{fontWeight: 800, fontSize: 38, lineHeight: 1.05}}>
          Seu refúgio <span style={{color: C.sol}}>pé na areia</span>
        </div>
        <div style={{fontWeight: 500, fontSize: 20, marginTop: 6, opacity: 0.9}}>Canavieiras • Bahia</div>
        <div style={{marginTop: 16, display: 'inline-block', background: C.sol, color: C.marinho, fontWeight: 800, fontSize: 22, padding: '12px 22px', borderRadius: 999}}>Reservar direto</div>
      </div>
    </div>
    <div style={{padding: '26px 22px 10px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <Stars value={4.8} size={30} gap={2} />
        <span style={{fontWeight: 700, fontSize: 22, color: C.marinho}}>4,8 · 188 avaliações</span>
      </div>
      <div style={{fontWeight: 800, fontSize: 30, color: C.marinho, margin: '22px 0 14px'}}>Acomodações</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
        <Tile label="Suítes" icon={<Bed />} />
        <Tile img="chale.jpg" label="Chalés" />
        <Tile img="piscina.jpg" label="Piscina" />
        <Tile label="Quadra de areia" icon={<Ball />} />
      </div>
      <div style={{fontWeight: 800, fontSize: 30, color: C.marinho, margin: '28px 0 14px'}}>Incluso na diária</div>
      <div style={{borderRadius: 18, overflow: 'hidden', height: 240}}>
        <Img src={staticFile('fotos/cafe.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{fontWeight: 700, fontSize: 22, color: C.texto, margin: '10px 0 20px'}}>Café da manhã da Bahia</div>
      <div style={{borderRadius: 18, overflow: 'hidden', height: 220}}>
        <Img src={staticFile('fotos/praia.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{fontWeight: 700, fontSize: 22, color: C.texto, margin: '10px 0 20px'}}>Frente mar</div>
      <div style={{background: C.coqueiro, color: '#fff', borderRadius: 999, padding: '16px 0', textAlign: 'center', fontWeight: 800, fontSize: 24, marginBottom: 40}}>Falar no WhatsApp</div>
    </div>
  </div>
);

/** funil: muitas gotas entram no site; só as douradas seguem para o WhatsApp */
const Funnel: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const t = f - start;
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 70; i++) {
    const born = i * 6;
    const dt = t - born;
    if (dt < 0 || dt > 130) continue;
    const gold = rnd(i * 17) < 0.35;
    const x0 = 960 + (rnd(i * 5) - 0.5) * 640;
    let x = x0;
    let y = 80 + dt * 5.2;
    let op = 1;
    if (y > 400) {
      // dentro do funil: converge para o centro
      const q = Math.min(1, (y - 400) / 220);
      x = x0 + (960 - x0) * q;
      if (!gold && y > 530) {
        // curiosos: ficam no site (saem pela lateral e somem)
        const k = (y - 530) / 5.2;
        x = 960 + (x0 > 960 ? 1 : -1) * (40 + k * 9);
        y = 530 + Math.sin(k / 6) * 10;
        op = interpolate(k, [0, 40], [1, 0], clamp);
      }
    }
    if (y > 790) continue;
    items.push(
      <div key={i} style={{position: 'absolute', left: x - 16, top: y - 20, opacity: op}}>
        <Drop size={gold ? 44 : 36} gold={gold} />
      </div>,
    );
  }
  const lp = usePop(start + 30, 14, 120);
  return (
    <AbsoluteFill>
      <DeepBg />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <path d="M 600 400 L 1320 400 L 1010 650 L 1010 740 L 910 740 L 910 650 Z" fill="rgba(255,255,255,0.14)" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
        <text x={960} y={485} textAnchor="middle" fontFamily={F.titulo} fontWeight={800} fontSize={44} fill="#fff">
          SITE OFICIAL
        </text>
      </svg>
      {items}
      <div style={{position: 'absolute', left: 960 - 75, top: 735}}>
        <IcChat size={150} bg={C.coqueiro} color="#fff" style={{filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.4))'}} />
      </div>
      <div style={{position: 'absolute', left: 1070, top: 785, opacity: lp, fontFamily: F.texto, color: '#fff', fontWeight: 700, fontSize: 38}}>
        <span style={{color: C.sol}}>● </span>Prontos para reservar → WhatsApp
      </div>
      <div style={{position: 'absolute', left: 170, top: 540, opacity: lp, fontFamily: F.texto, color: '#fff', fontWeight: 600, fontSize: 36, width: 400, textAlign: 'right'}}>
        <span style={{color: C.azulClaro}}>● </span>Curiosos já tiram as dúvidas no site
      </div>
      <div style={{position: 'absolute', top: 90, left: 120}}>
        <Title start={start + 6} style={{fontSize: 80}}>
          O site <span style={{color: C.sol}}>filtra</span>
        </Title>
      </div>
    </AbsoluteFill>
  );
};

/** lupa → site → balão de mensagem → reserva confirmada */
const FlowIcons: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const steps = [
    {ic: <IcSearch size={150} bg="#fff" color={C.mar} />, label: 'Busca'},
    {ic: <IcGlobe size={150} bg="#fff" color={C.mar} />, label: 'Site oficial'},
    {ic: <IcChat size={150} bg={C.coqueiro} color="#fff" />, label: 'WhatsApp'},
    {ic: <IcCheck size={150} bg={C.sol} color={C.marinho} />, label: 'Reserva confirmada'},
  ];
  const gap = 28;
  return (
    <AbsoluteFill>
      <Photo src="piscina.jpg" from={start} dur={200} z0={1.15} z1={1.25} blur={14} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(19,41,75,0.75), rgba(15,63,116,0.6))'}} />
      {steps.map((s, i) => {
        const st = start + 10 + i * gap;
        const p = interpolate(f, [st, st + 18], [0, 1], {...clamp, easing: eio});
        const pulse = 1 + Math.max(0, Math.sin(((f - st) / 30) * Math.PI)) * 0.04 * (f > st + 18 ? 1 : 0);
        const x = 330 + i * 420;
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: x - 420 + 95,
                  top: 430,
                  width: 230 * interpolate(f, [st - 14, st + 4], [0, 1], clamp),
                  height: 8,
                  borderRadius: 4,
                  background: C.sol,
                }}
              />
            ) : null}
            <div style={{position: 'absolute', left: x - 75, top: 360, opacity: p, transform: `scale(${(0.6 + p * 0.4) * pulse})`, filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.35))'}}>{s.ic}</div>
            <div style={{position: 'absolute', left: x - 200, width: 400, top: 540, textAlign: 'center', opacity: p, fontFamily: F.texto, fontWeight: 700, fontSize: 36, color: i === 3 ? C.sol : '#fff'}}>{s.label}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 1560, top: 560, opacity: interpolate(f, [start + 130, start + 150], [0, 1], clamp)}}>
        <Marina width={210} smile={1} right={{a1: 150, a2: 20}} />
      </div>
      <div style={{position: 'absolute', top: 150, width: 1920, textAlign: 'center'}}>
        <Title start={start + 150} style={{fontSize: 66}}>
          Chegam pessoas <span style={{color: C.sol}}>prontas para reservar</span>
        </Title>
      </div>
    </AbsoluteFill>
  );
};

/** lista dos 4 passos no topo, marcados conforme cada furo é selado */
const Checklist: React.FC<{seal: number[]}> = ({seal}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: 60, left: 0, width: 1920, display: 'flex', justifyContent: 'center', gap: 10}}>
      {SEALS.map((l, i) => {
        const on = interpolate(f, [seal[i], seal[i] + 14], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              fontFamily: F.texto,
              fontWeight: 700,
              fontSize: 25,
              padding: '10px 14px',
              borderRadius: 16,
              background: on > 0.5 ? '#fff' : 'rgba(255,255,255,0.12)',
              color: on > 0.5 ? C.marinho : 'rgba(255,255,255,0.55)',
              boxShadow: on > 0.5 ? `0 0 0 4px ${C.sol}, 0 12px 30px rgba(0,0,0,0.3)` : 'none',
              transform: `scale(${1 + Math.sin(Math.min(1, on) * Math.PI) * 0.08})`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{width: 30, height: 30, borderRadius: 8, background: on > 0.5 ? C.sol : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {on > 0.5 ? <IcCheck size={26} color={C.marinho} /> : null}
            </div>
            {l}
          </div>
        );
      })}
    </div>
  );
};

/** rótulo grande do primeiro selo, junto ao furo 1 durante o zoom */
const SealTag: React.FC<{start: number}> = ({start}) => {
  const p = usePop(start + 6, 14, 120);
  return (
    <div style={{position: 'absolute', left: 420, top: 300, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{background: '#fff', color: C.marinho, fontFamily: F.texto, fontWeight: 800, fontSize: 30, padding: '12px 22px', borderRadius: 14, boxShadow: `0 0 0 4px ${C.sol}, 0 14px 30px rgba(0,0,0,0.35)`, textAlign: 'right'}}>
        1. Site oficial
        <div style={{fontSize: 22, fontWeight: 600, color: C.mar}}>a vitrine da pousada</div>
      </div>
    </div>
  );
};
