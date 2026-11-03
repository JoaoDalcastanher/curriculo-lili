# A viagem do Pingo

Jogo de navegador para crianças praticarem **escala de mapa**. O Pingo, um
pinguim-de-magalhães, precisa nadar da Patagônia até Santa Catarina. A criança
conta os quadradinhos do caminho, usa a legenda (`1 quadradinho = 150 km`) e
digita quantos quilômetros ele vai nadar. O Pingo nada exatamente essa
distância, sempre pela água.

**A escala é lei:** no mapa, o Pingo só anda na horizontal ou na vertical, de
quadradinho em quadradinho, e cada 150 km são exatamente 1 quadradinho. Toda
distância do jogo (no mapa, no globo e no espaço) aparece em quadradinhos.

Resposta certa: **21 quadradinhos = 3.150 km**.

## Linguagem / Language

Tudo em **português** (interface, mensagens e testes). Não há suporte a inglês.

## Os dois modos

### Jogar

Toda resposta termina do mesmo jeito: um **cartão-postal** de onde o Pingo parou.

| Distância | O que acontece |
|---|---|
| Menos que o caminho | Ele para no mar, no quadradinho exato. Cartão "Por pouco!" ou "Ainda falta nadar bastante…". |
| Exatamente 3.150 km | Chega na Ponte Hercílio Luz: confete, faixa de **Parabéns!** e a conta no cartão. |
| Um pouco mais | O mapa **se expande** pela costa do Brasil (Rio, Salvador, Natal, Equador) até o Gabão, na África. |
| Depois da África | A viagem começa **direto no globo**. O Pingo nada pelo mar (Canal de Suez, Estreito de Gibraltar, Cabo da Boa Esperança…) até o lugar mais longe que dá para alcançar. Cada destino tem um cartão próprio. |
| Mais longe que todos os destinos | **Voltas na Terra**, desenhadas no globo. |
| A partir da Lua | **Espaço**: Lua, Vênus, Marte, Sol, Júpiter, Saturno, Netuno, Plutão e Proxima Centauri. |

### Explorar

Um passeio livre pelo mundinho do Pingo, sem conta:

- arraste o globo para levar o Pingo; ao soltar perto de um lugar, ele mostra o cartão dele;
- ou toque num lugar da lista (no caminho, pelo mundo, no espaço);
- na aba **Espaço**, arraste o Pingo de planeta em planeta.

Não tem backend: é só front-end estático.

## Como rodar

```bash
bun install
```

```bash
bun run dev
```

## Testes

```bash
bun run test:unit
```

```bash
bun run test:e2e
```

Os testes E2E usam Playwright (desktop 1440×900 e celular Pixel 7) e sobem o Vite
sozinhos. Na primeira vez numa máquina nova, instale o navegador do Playwright:

```bash
bunx playwright install chromium
```

## Onde mudar as regras

| O quê | Arquivo |
|---|---|
| Percurso na malha (R = direita, U = cima), paradas e escala | `src/game/config.ts` |
| Resposta certa (passos até Santa Catarina × 150 km) | `src/game/route.ts` |
| Interpretador: distância → lugar, cartão, voltas, planetas | `src/game/interpreter.ts` |
| Destinos do mundo e corpos do espaço (textos dos cartões) | `src/game/destinations.ts` |
| Rede de rotas pelo mar e porto de cada destino | `src/game/sea.ts` |
| Desenhos dos cartões-postais | `src/components/scenes/PlaceScenes.tsx` |
| Desenhos do Pingo | `src/components/Penguin.tsx` |

Depois da África, a distância até cada destino é: o caminho na malha
(79 quadradinhos = 11.850 km) + o caminho pelo mar até o porto mais próximo +
o trechinho do porto até o lugar. Um teste garante que nenhum trecho de mar
passa por cima de terra (fora canais estreitos demais para o mapa-múndi
simplificado, listados em `NARROW_EDGES`).

## Vídeos e imagens

- `docs/videos/`: cada tipo de viagem em ritmo calmo, mais o modo Explorar.
- `docs/postais/`: todos os cartões-postais (`*-selo.png` é só o selo ampliado).
- `docs/pingo/`: as poses do Pingo.

---

## Tutorial: subir no GitHub

O código já está no repositório **privado**
`JoaoDalcastanher/projeto-pinguim`, na `main` e na branch
`claude/bold-hamilton-ax4s4k`. Ninguém de fora vê nada enquanto o repositório
for privado.

### 1. Conferir o que já está lá

1. Abra https://github.com/JoaoDalcastanher/projeto-pinguim.
2. Confira se aparece o selo **Private** ao lado do nome.
3. Na aba **Actions**, o fluxo **Testes** roda sozinho a cada push na `main`
   ou em pull requests: typecheck, testes unitários e Playwright. Isso não
   publica nada.

### 2. Trabalhar no seu computador

```bash
git clone https://github.com/JoaoDalcastanher/projeto-pinguim.git
```

```bash
cd projeto-pinguim
```

```bash
bun install
```

```bash
bun run dev
```

### 3. (Opcional) Colocar o jogo no ar com o GitHub Pages

**Atenção: um site no GitHub Pages fica público na internet**, mesmo com o
repositório privado. Só faça isso quando quiser que outras pessoas joguem.
GitHub Pages em repositório privado exige plano pago (Pro, Team ou Enterprise).
No plano gratuito, o repositório precisa ser público.

1. No repositório: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
2. Vá em **Actions → Publicar no GitHub Pages → Run workflow**. O fluxo só
   roda quando você clica: nada vai ao ar sozinho.
3. Quando terminar, o link aparece no próprio fluxo, no formato
   `https://joaodalcastanher.github.io/projeto-pinguim/`.

Para tirar do ar depois: **Settings → Pages → Unpublish site**.

### 4. Alternativas para publicar

O jogo é só arquivos estáticos (`bun run build` gera a pasta `dist/`).
Também funciona em Netlify, Vercel ou Cloudflare Pages: aponte para o
repositório, comando de build `bun run build`, pasta de saída `dist`.
