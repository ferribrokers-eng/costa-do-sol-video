import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES, TOTAL_FRAMES} from './lib/timeline';
import {WaveWipe} from './lib/fx';
import {MusicBed, Sfx} from './lib/Shell';
import {SCENE_COMPONENTS} from './scenes';

/** filme completo: cenas encadeadas, cortes no tempo forte cobertos por onda azul */
export const Main: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map((s) => {
      const C = SCENE_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
          <C />
        </Sequence>
      );
    })}
    {SCENES.slice(1).map((s) => (
      <React.Fragment key={'w' + s.id}>
        <WaveWipe at={s.from} dur={30} />
        <Sfx at={s.from - 14} src="whoosh-fast.mp3" vol={0.32} />
        <Sfx at={s.from - 6} src="water-bubble.mp3" vol={0.18} />
      </React.Fragment>
    ))}
    <MusicBed />
    <span style={{display: 'none'}}>{TOTAL_FRAMES}</span>
  </AbsoluteFill>
);
