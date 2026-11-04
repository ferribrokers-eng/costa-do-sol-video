"""Narração com voz natural (Chatterbox Multilingual, português) — 1 arquivo por cena + timings das legendas.

Uso:
  python tools/gerar_narracao_chatterbox.py --ref tools/voz/referencia.wav            # todas as cenas
  python tools/gerar_narracao_chatterbox.py --ref tools/voz/referencia.wav Scene03    # só algumas

--ref  gravação de referência (~10 s, voz feminina brasileira, sem música/ruído) que define o timbre.
       Sem --ref, o modelo usa a voz padrão dele.
Requer: pip install chatterbox-tts  (e acesso a huggingface.co para baixar o modelo na 1ª vez).
"""
import argparse, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public/audio/narracao')
GAP = 0.45  # pausa entre frases (s)

ap = argparse.ArgumentParser()
ap.add_argument('--ref', default=None)
ap.add_argument('--exaggeration', type=float, default=0.45, help='expressividade (0.3 calma … 0.7 animada)')
ap.add_argument('--cfg', type=float, default=0.5, help='aderência ao ritmo da referência (menor = mais lento/calmo)')
ap.add_argument('--temperature', type=float, default=0.7)
ap.add_argument('--seed', type=int, default=7)
ap.add_argument('scenes', nargs='*')
a = ap.parse_args()

import torch, torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

torch.manual_seed(a.seed)
torch.set_num_threads(os.cpu_count() or 4)
model = ChatterboxMultilingualTTS.from_pretrained(device='cpu')


def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))


def chunks(text, maxc=64):
    if len(text) <= maxc:
        return [text]
    parts = re.split(r'(?<=[,:;])\s+', text)
    out, cur = [], ''
    for p in parts:
        if cur and len(cur) + 1 + len(p) > maxc:
            out.append(cur); cur = p
        else:
            cur = (cur + ' ' + p).strip()
    if cur:
        out.append(cur)
    return out


script = json.load(open(os.path.join(ROOT, 'src/script.json')))
# grafias fonéticas usadas para a voz antiga; o modelo neural pronuncia melhor a grafia normal
NATURAL = {'Búking': 'Booking', 'uótsap': 'WhatsApp', 'istóris': 'stories', 'shópin': 'shopping'}


def natural(t):
    for k, v in NATURAL.items():
        t = t.replace(k, v)
    return t

tpath = os.path.join(ROOT, 'src/narration-timings.json')
timings = json.load(open(tpath)) if os.path.exists(tpath) else {}

for sc in script['scenes']:
    sid = sc['id']
    if a.scenes and sid not in a.scenes:
        continue
    tmp = tempfile.mkdtemp()
    files, ds = [], []
    for i, s in enumerate(sc['sentences']):
        torch.manual_seed(a.seed + i)
        kw = dict(language_id='pt', exaggeration=a.exaggeration, cfg_weight=a.cfg, temperature=a.temperature)
        if a.ref:
            kw['audio_prompt_path'] = a.ref
        wav = model.generate(natural(s['tts']), **kw)
        raw = os.path.join(tmp, f'{i}.wav')
        torchaudio.save(raw, wav, model.sr)
        proc = os.path.join(tmp, f'{i}p.wav')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af',
                        'silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse,'
                        'aresample=48000:resampler=soxr,highpass=f=70,acompressor=threshold=-20dB:ratio=2:attack=10:release=150:makeup=1.5',
                        '-ac', '1', '-ar', '48000', proc], check=True)
        files.append(proc); ds.append(dur(proc))
        print(f'  {sid} frase {i + 1}/{len(sc["sentences"])}: {ds[-1]:.1f}s', flush=True)
    sil = os.path.join(tmp, 'sil.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', str(GAP), sil], check=True)
    lst = os.path.join(tmp, 'l.txt')
    with open(lst, 'w') as f:
        for i, p in enumerate(files):
            f.write(f"file '{p}'\n")
            if i < len(files) - 1:
                f.write(f"file '{sil}'\n")
    cat = os.path.join(tmp, 'cat.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', cat], check=True)
    final = os.path.join(OUT, sid + '.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', cat, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=7', '-ar', '48000', '-ac', '1', final], check=True)
    total = dur(final)
    scale = total / (sum(ds) + GAP * (len(ds) - 1))
    caps, t = [], 0.0
    for s, d in zip(sc['sentences'], ds):
        d *= scale
        cs = chunks(s['text']); tot = sum(len(c) for c in cs); ct = t
        for c in cs:
            cd = d * len(c) / tot
            caps.append({'text': c, 'start': round(ct, 3), 'end': round(ct + cd, 3)}); ct += cd
        t += d + GAP * scale
    timings[sid] = {'duration': round(total, 3), 'captions': caps}
    json.dump(timings, open(tpath, 'w'), ensure_ascii=False, indent=1)
    print(sid, round(total, 1), 's', flush=True)

print('total', round(sum(v['duration'] for v in timings.values()), 1), 's')
