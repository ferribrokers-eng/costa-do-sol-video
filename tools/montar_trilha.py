"""Monta public/audio/trilha.wav: faixa original (124 BPM, começa no tempo forte) com loop
emendado em limites de compasso — a grade de batidas fica t = n*T, T = 60/124.
Uso: python3 tools/montar_trilha.py <duração_s>"""
import numpy as np, soundfile as sf, librosa, json, sys
need = float(sys.argv[1]) + 4
BPM = 124.0; T = 60/BPM; BAR = 4*T
y, sr = librosa.load('tools/bgm-src.mp3', sr=48000, mono=False)
LOOP_IN, LOOP_OUT = 16, 136          # compassos: volta do compasso 136 para o 16
xf = int(0.03*sr)
out = y[:, :int(round(LOOP_OUT*BAR*sr))]
body = y[:, int(round(LOOP_IN*BAR*sr)):int(round(LOOP_OUT*BAR*sr))]
while out.shape[1] < need*sr:
    b = body.copy(); r = np.linspace(0, 1, xf)
    tail = out[:, -xf:] * r[::-1] + b[:, :xf] * r
    out = np.concatenate([out[:, :-xf], tail, b[:, xf:]], axis=1)
out = out[:, :int(need*sr)]
sf.write('tools/trilha.wav', out.T.astype(np.float32), sr)
import subprocess; subprocess.run(['ffmpeg','-y','-v','error','-i','tools/trilha.wav','-c:a','libmp3lame','-b:a','320k','public/audio/trilha.mp3'],check=True)
json.dump({'bpm': BPM, 'T': T}, open('src/beat.json', 'w'))
print('ok', out.shape[1]/sr)
