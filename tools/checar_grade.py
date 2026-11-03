import librosa,numpy as np,sys
src=sys.argv[1]
y,sr=librosa.load(src,sr=22050)
S=np.abs(librosa.stft(y,n_fft=1024,hop_length=128));f=librosa.fft_frequencies(sr=sr,n_fft=1024)
low=np.maximum(0,np.diff(np.log1p(S[f<140].sum(0)),prepend=0));fr=sr/128;dur=len(y)/sr
def score(T,p,a,b):
  g=p+T*np.arange(np.ceil((a-p)/T),(b-p)/T); return np.mean([low[max(0,int(x*fr)-2):int(x*fr)+3].max() for x in g])
best=None
for T in np.arange(0.44,0.52,0.0001):
  for p in np.arange(0,T,0.005):
    s=score(T,p,10,dur-5)
    if best is None or s>best[0]: best=(s,T,p)
s,T,p=best;print(src.split('/')[-1],'bpm',60/T,'T',T,'p',p)
for w in range(0,int(dur)-10,20): print(w, round(score(T,p,w,w+20),2), round(score(T,p+T/2,w,w+20),2))
