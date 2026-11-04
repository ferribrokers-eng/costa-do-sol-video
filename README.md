# Pousada Costa do Sol — vídeo narrado (Ferri Digital)

Vídeo horizontal 16:9 (1920×1080, 30 fps, H.264 + AAC 48 kHz), ~5min43s, feito em [Remotion](https://www.remotion.dev/).
Conta a história da Marina e dos 4 "vazamentos" de reservas, terminando na solução: site oficial +
Google Meu Negócio estruturado + 1ª página orgânica + WhatsApp com clientes filtrados.

## Como rodar

```bash
npm install
npm run dev                      # abre o Remotion Studio para ver/ajustar as cenas
npm run render                   # renderiza o filme completo em out/costa-do-sol.mp4
npx remotion render src/index.ts Scene10 out/cena10.mp4   # uma cena isolada (já com trilha)
```

O navegador usado na renderização é configurado em `remotion.config.ts`
(`setBrowserExecutable`). Em outra máquina, apague essa linha para o Remotion baixar o dele.

## Estrutura

| Caminho | O que é |
|---|---|
| `src/Main.tsx` | Filme completo: encadeia as 11 cenas, transições em onda azul, trilha |
| `src/scenes/Scene01.tsx` … `Scene11.tsx` | Uma composição por cena |
| `src/script.json` | **Roteiro**: texto da legenda (`text`) e como a voz pronuncia (`tts`) |
| `src/narration-timings.json` | Gerado: duração de cada narração e tempo de cada legenda |
| `src/lib/timeline.ts` | Duração das cenas (respiro + narração + respiro, arredondado ao compasso da música) |
| `src/lib/theme.ts` | **Cores e fontes** |
| `src/lib/Marina.tsx` | Personagem Marina (SVG) |
| `src/lib/Pipe.tsx` | O cano com os 4 furos |
| `public/fotos/` | Fotos reais (recortadas das artes do Instagram) |
| `public/logo.png` | Logo da pousada |
| `public/audio/narracao/SceneXX.wav` | Narração, um arquivo por cena |
| `public/audio/trilha.mp3` | Trilha de fundo já em loop e alinhada às batidas |
| `public/audio/sfx/` | Efeitos (mar, whoosh, brilhos, cliques) |
| `tools/` | Scripts de narração, trilha e análise de ritmo |

## Trocar textos

1. Edite `src/script.json`: `text` é a legenda, `tts` é o que a voz fala (escreva números por extenso).
2. Gere a narração de novo com a voz feminina (Chatterbox):
   `python tools/gerar_narracao_chatterbox.py --ref tools/voz/referencia.wav --exaggeration 0.5`
   (só algumas cenas: acrescente `Scene03 Scene07`). Instale com Python 3.11:
   `uv venv -p 3.11 cbx && VIRTUAL_ENV=cbx uv pip install chatterbox-tts "setuptools<81"`.
   Precisa de acesso a huggingface.co. `tools/voz/referencia.wav` (~15 s de voz de referência) fica fora do git.
   No `tts`, escreva o texto normal (Booking, WhatsApp); números por extenso.
3. As cenas se reajustam sozinhas: cada animação está presa ao início de uma frase (`at(S, 'começo da frase')`).
   Se mudar o começo de uma frase, atualize o `at(...)` correspondente na cena.

Títulos que aparecem na tela (fora da legenda) ficam dentro de cada `src/scenes/SceneXX.tsx`.

## Trocar a narração por uma voz profissional

Grave ou gere (ex.: locutor, ElevenLabs) um arquivo por cena, com o mesmo texto de `script.json`, e salve como
`public/audio/narracao/Scene01.wav` … `Scene11.wav`. Depois rode:

```bash
python3 tools/gerar_narracao.py --somente-timings
```

Isso mede os novos áudios e redistribui os tempos das legendas. A duração das cenas acompanha automaticamente.

## Trocar cores e fontes

- Cores: `src/lib/theme.ts` (objeto `C`). Ex.: `sol`, `mar`, `azulClaro`, `coqueiro`, `areia`, `marinho`.
- Fontes: os arquivos `.woff2` estão embutidos em `src/lib/fonts.css` (base64). Para trocar, coloque o
  novo `.woff2` em `public/fonts/`, gere o CSS de novo (veja o trecho Python no histórico do projeto ou
  substitua a `@font-face`) e mude `F` em `theme.ts`.

## Trocar fotos e logos

- Substitua os arquivos em `public/fotos/` mantendo os nomes (`aerea.jpg`, `piscina.jpg`, `chale.jpg`, `cafe.jpg`,
  `praia.jpg`, `rio.jpg`, `comida.jpg`, `coqueiros.jpg`). As versões `-blur.jpg` são usadas nos fundos
  desfocados: gere de novo com o trecho em `tools/` ou apague o `blur` das cenas.
- Logo da pousada: `public/logo.png` (quadrado, fundo transparente).
- Logo da Ferri Digital: hoje é uma marca em texto (`FerriMark` em `src/scenes/Scene11.tsx`).
  Para usar a imagem, coloque `public/ferri.png` e troque o `FerriMark` por `<Img src={staticFile('ferri.png')} />`.
- Suítes e quadra de areia aparecem como ícones no site do celular (cena 10) porque não havia fotos
  delas. Basta adicionar `public/fotos/suite.jpg` / `quadra.jpg` e passar `img="suite.jpg"` no `Tile`.

## Trocar a música

1. Coloque a faixa em `tools/bgm-src.mp3`.
2. Ajuste `BPM`, `LOOP_IN` e `LOOP_OUT` (compassos) em `tools/montar_trilha.py` e rode
   `python3 tools/montar_trilha.py 480` (duração em segundos, com folga).
3. Atualize `src/beat.json` se o BPM mudar (o script já faz isso). As transições caem sempre no
   início de um compasso.

Volume: −22 dB sob a voz e −12 dB nas pausas, abertura e final (`musicVolume` em `src/lib/Shell.tsx`),
fade-in de 2 s e fade-out de 3 s.

## Créditos de áudio

- Trilha e efeitos: biblioteca da skill video-shotcraft (Mixkit, licença gratuita para uso comercial;
  alguns arquivos sem URL de origem devem ser conferidos antes de uso comercial).
- Som de mar: sintetizado (ruído filtrado), sem direitos de terceiros.
- Voz: Chatterbox Multilingual (Resemble AI, licença MIT), português, timbre clonado de uma gravação de referência
  fornecida pelo cliente. Antes de uso comercial, confirme os direitos da voz de referência.
  A voz antiga (Piper, `tools/gerar_narracao.py`) continua no repositório como alternativa.
