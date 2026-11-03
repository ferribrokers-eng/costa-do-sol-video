import React from 'react';
import {Composition} from 'remotion';
import {waitFonts} from './lib/fonts';
import {FPS, H, W} from './lib/theme';
import {SCENES, TOTAL_FRAMES} from './lib/timeline';
import {Main} from './Main';
import {SCENE_COMPONENTS} from './scenes';

// fontes embutidas em base64 no CSS: disponíveis imediatamente
void waitFonts;

export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    {SCENES.map((s) => (
      <Composition key={s.id} id={s.id} component={SCENE_COMPONENTS[s.id]} durationInFrames={s.frames} fps={FPS} width={W} height={H} />
    ))}
  </>
);
