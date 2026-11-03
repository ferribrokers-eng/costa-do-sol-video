"""Gera a narração (1 arquivo por cena) + timings das legendas.
Uso: python3 tools/gerar_narracao.py
Para trocar por voz profissional: coloque public/audio/narracao/SceneXX.wav (mesmo nome)
e rode com --somente-timings (as legendas são redistribuídas pela duração do seu áudio)."""
import json, subprocess, sys, os, re, tempfile, wave
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, 'tools/voz/pt-br-edresson-low.onnx')
OUT = os.path.join(ROOT, 'public/audio/narracao')
GAP = 0.42            # pausa entre frases (s)
LENGTH = 1.13         # >1 = fala mais calma
only_timings = '--somente-timings' in sys.argv

def dur(p):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p]))

def chunks(text, maxc=64):
    """Quebra uma frase em blocos de legenda (máx. 2 linhas)."""
    if len(text) <= maxc: return [text]
    parts = re.split(r'(?<=[,:;])\s+', text)
    out, cur = [], ''
    for p in parts:
        if cur and len(cur) + 1 + len(p) > maxc:
            out.append(cur); cur = p
        else:
            cur = (cur + ' ' + p).strip()
    if cur: out.append(cur)
    return out

script = json.load(open(os.path.join(ROOT, 'src/script.json')))
timings = {}
for sc in script['scenes']:
    sid = sc['id']; final = os.path.join(OUT, sid + '.wav')
    tmp = tempfile.mkdtemp()
    sents = []
    if not only_timings:
        files = []
        for i, s in enumerate(sc['sentences']):
            raw = os.path.join(tmp, f'{i}.wav')
            subprocess.run([sys.executable, '-m', 'piper', '-m', MODEL, '--length-scale', str(LENGTH),
                            '--noise-scale', '0.6', '--noise-w-scale', '0.75', '-f', raw],
                           input=s['tts'].encode(), check=True, capture_output=True)
            proc = os.path.join(tmp, f'{i}p.wav')
            # tratamento: 48 kHz, corta silêncio das pontas, EQ de presença/calor, compressão leve
            subprocess.run(['ffmpeg','-y','-v','error','-i',raw,'-af',
              'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
              'aresample=48000:resampler=soxr,highpass=f=70,equalizer=f=160:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=2,'
              'equalizer=f=7000:t=q:w=1:g=-1.5,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,'
              'apad=pad_dur=0.02','-ac','1','-ar','48000',proc], check=True)
            files.append(proc)
        # concatena com pausas
        lst = os.path.join(tmp, 'l.txt')
        sil = os.path.join(tmp, 'sil.wav')
        subprocess.run(['ffmpeg','-y','-v','error','-f','lavfi','-i',f'anullsrc=r=48000:cl=mono','-t',str(GAP),sil],check=True)
        with open(lst,'w') as f:
            for i,p in enumerate(files):
                f.write(f"file '{p}'\n")
                if i < len(files)-1: f.write(f"file '{sil}'\n")
        cat = os.path.join(tmp,'cat.wav')
        subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',lst,'-c','copy',cat],check=True)
        subprocess.run(['ffmpeg','-y','-v','error','-i',cat,'-af','loudnorm=I=-16:TP=-1.5:LRA=7','-ar','48000','-ac','1',final],check=True)
        ds = [dur(p) for p in files]
    else:
        # redistribui proporcionalmente ao número de caracteres
        total = dur(final); n = len(sc['sentences'])
        L = [len(s['text']) for s in sc['sentences']]
        speech = total - GAP*(n-1)
        ds = [speech*l/sum(L) for l in L]
    t = 0.0; scale = dur(final) / (sum(ds) + GAP*(len(ds)-1))
    for s, d in zip(sc['sentences'], ds):
        d *= scale
        cs = chunks(s['text']); tot = sum(len(c) for c in cs); ct = t
        for c in cs:
            cd = d*len(c)/tot
            sents.append({'text': c, 'start': round(ct,3), 'end': round(ct+cd,3)}); ct += cd
        t += d + GAP*scale
    timings[sid] = {'duration': round(dur(final),3), 'captions': sents}
    print(sid, timings[sid]['duration'])
json.dump(timings, open(os.path.join(ROOT,'src/narration-timings.json'),'w'), ensure_ascii=False, indent=1)
print('total', round(sum(v['duration'] for v in timings.values()),1))
