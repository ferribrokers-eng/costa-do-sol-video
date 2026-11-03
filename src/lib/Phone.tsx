import React from 'react';
import {C} from './theme';

/** celular genérico (moldura + tela) */
export const Phone: React.FC<{width?: number; children: React.ReactNode; style?: React.CSSProperties; dark?: boolean}> = ({width = 440, children, style, dark}) => {
  const h = width * 2.05;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.13,
        background: '#121820',
        padding: width * 0.035,
        boxShadow: '0 40px 90px rgba(0,0,0,0.45), inset 0 0 0 3px #2a3442',
        position: 'relative',
        ...style,
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: width * 0.1, overflow: 'hidden', position: 'relative', background: dark ? '#0d1117' : C.areia}}>{children}</div>
      <div style={{position: 'absolute', top: width * 0.06, left: '50%', width: width * 0.28, height: width * 0.065, marginLeft: -width * 0.14, borderRadius: 99, background: '#121820'}} />
    </div>
  );
};
