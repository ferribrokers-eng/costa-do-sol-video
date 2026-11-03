// Fontes embutidas em base64 (sem requisição de rede durante a renderização).
import './fonts.css';
import {continueRender, delayRender} from 'remotion';

const FACES = ['400 20px Poppins', '500 20px Poppins', '600 20px Poppins', '700 20px Poppins', '800 20px Poppins', "800 20px 'Baloo 2'"];
export const waitFonts = () => {
  if (typeof document === 'undefined') return;
  const h = delayRender('fontes');
  Promise.all(FACES.map((x) => document.fonts.load(x, 'Ãçé')))
    .catch(() => undefined)
    .then(() => continueRender(h));
};
