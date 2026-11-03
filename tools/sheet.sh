#!/bin/bash
# uso: tools/sheet.sh <Composição> <saida.jpg> frames...
comp=$1; out=$2; shift 2; d=$(mktemp -d)
for fr in "$@"; do npx remotion still src/index.ts $comp $d/$(printf %06d $fr).jpg --frame=$fr --scale=0.5 --image-format=jpeg --log=error 2>&1 | grep -v -E "^$|Memory|docker|lower amount" ; done
python3 - "$d" "$out" <<'P'
import sys,glob
from PIL import Image
fs=sorted(glob.glob(sys.argv[1]+'/*.jpg'));ims=[Image.open(f) for f in fs];w,h=ims[0].size
s=Image.new('RGB',(w*2,h*((len(ims)+1)//2)))
for i,im in enumerate(ims): s.paste(im,((i%2)*w,(i//2)*h))
s.save(sys.argv[2],quality=85)
P
