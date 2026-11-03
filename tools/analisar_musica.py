"""Grade de batidas da trilha: busca T e fase que maximizam a energia de grave (kick) nos pontos da grade."""
import librosa, numpy as np, json, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'tools/bgm-src.mp3'
y, sr = librosa.load(src, sr=22050); hop = 128
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=1024)
low = np.maximum(0, np.diff(np.log1p(S[f < 140].sum(0)), prepend=0))   # fluxo de grave
fr = sr / hop; dur = len(y) / sr
best = None
for T in np.arange(0.480, 0.500, 0.00005):
    n = int((dur - 1) / T)
    for p in np.arange(0, T, 0.004):
        idx = ((p + T*np.arange(n)) * fr).astype(int)
        s = low[idx].mean()
        if best is None or s > best[0]: best = (s, T, p)
s, T, p = best
n = int((dur - p) / T); idx = ((p + T*np.arange(n)) * fr).astype(int)
# fase do tempo forte (1 de 4)
e = [low[idx[ph::4]].mean() for ph in range(4)]
# verificação: picos de grave perto da grade
pk = librosa.util.peak_pick(low, pre_max=20, post_max=20, pre_avg=40, post_avg=40, delta=low.std(), wait=40) / fr
err = [np.min(np.abs(p + T*np.arange(n) - t)) for t in pk if t > 1]
print(json.dumps({'T': T, 'bpm': 60/T, 'phase': p, 'downbeatPhase': int(np.argmax(e)), 'kickPeaks': len(pk),
  'within40ms': float(np.mean(np.array(err) < 0.04)), 'medianErrMs': float(np.median(err)*1000)}))
