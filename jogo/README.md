# A viagem do Pingo

Jogo de navegador para crianças praticarem **escala de mapa**. O Pingo, um
pinguim-de-magalhães, precisa nadar de um lugar até outro — por padrão, da
Patagônia até Santa Catarina, mas **dá para escolher a saída e a chegada**
entre todos os lugares da Terra do jogo. A criança conta os quadradinhos do
caminho, usa a legenda (`1 quadradinho = 150 km`) e digita quantos quilômetros
ele vai nadar. O Pingo nada exatamente essa distância, sempre pela água.

**A escala é lei:** no mapa, o Pingo só anda na horizontal ou na vertical, de
quadradinho em quadradinho, e cada 150 km são exatamente 1 quadradinho. Toda
distância do jogo (no mapa, no globo e no espaço) aparece em quadradinhos.

Resposta certa no percurso da atividade (Patagônia → Santa Catarina):
**21 quadradinhos = 3.150 km**. Nas outras rotas, a resposta é o número de
quadradinhos do caminho × 150 km.

## Saída e chegada

- No painel, **Saída** e **Chegada** listam todos os lugares da Terra (os do
  caminho, as Ilhas Malvinas e os do mundo). O botão ⇄ inverte os dois.
- Ao trocar a rota aparece o **cartão de partida**: o selo do lugar de saída e
  o mesmo texto para qualquer rota. O **Parabéns** também é um só, com o selo
  da chegada: "O Pingo saiu de X e chegou em Y!".
- **Patagônia ↔ Santa Catarina** usa o mapa e o percurso originais da
  atividade (A–O, 1–15). As outras rotas ganham um **mapa automático** com a
  costa de verdade, sempre com 1 quadradinho = 150 km: o caminho segue a rede
  de rotas pelo mar e vira degraus de 1 quadradinho (só horizontal e vertical).
- Em rotas com mais de 40 quadradinhos aparecem **bolinhas de 10 em 10** no
  caminho, para contar de 10 em 10.
- Passou da chegada? O Pingo continua pelo globo e os lugares do mundo ficam
  na distância **proporcional**: quadradinhos até a chegada + quadradinhos da
  chegada até cada lugar.

## Linguagem / Language

Tudo em **português** (interface, mensagens e testes). Não há suporte a inglês.

## Os dois modos

### Jogar

Toda resposta termina do mesmo jeito: um **cartão-postal** de onde o Pingo parou, que abre assim que a animação termina.

| Distância | O que acontece |
|---|---|
| Menos que o caminho | Ele para no mar, no quadradinho exato. Cartão "Por pouco!" ou "Ainda falta nadar bastante…". |
| Exatamente a resposta | Chega na chegada: confete e o cartão de **Parabéns!** com o selo do lugar e a conta. |
| Um pouco mais | A viagem vai **direto para o globo**: "Passou raspando!" ou "Passou do ponto!". |
| Mais ainda | No globo, o Pingo segue pelo mar até o lugar mais longe que dá para alcançar, com o cartão próprio de cada lugar. |
| Mais longe que todos os destinos | **Voltas na Terra**, desenhadas no globo. |
| A partir da Lua | **Espaço**: Lua, Vênus, Marte, Sol, Júpiter, Saturno, Netuno, Plutão e Proxima Centauri. |

### Explorar

Um passeio livre pelo mundinho do Pingo, sem conta:

- arraste o **Pingo** pelo globo (ele segue o dedo); levando-o até a borda, o globo gira devagar para ele continuar; ao soltar perto de um lugar, ele mostra o cartão dele;
- ou toque num lugar da lista (no caminho, pelo mundo, no espaço);
- na aba **Espaço**, arraste o Pingo de planeta em planeta.
- clique no selo do cartão para abrir o cartão-postal grande;
- nas **Ilhas Malvinas** mora a **Pinga**, a namorada do Pingo (de flor na
  cabeça e cachecol vermelho).

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
| Rede de rotas pelo mar e porto de cada lugar | `src/game/sea.ts` |
| Lugares de saída e chegada (inclui as Ilhas Malvinas) | `src/game/stops.ts` |
| Viagem entre dois lugares: degraus, resposta, "passou do ponto" | `src/game/trip.ts` |
| Mapa automático das rotas novas (bolinhas de 10 em 10) | `src/components/RouteMap.tsx` |
| Desenhos dos cartões-postais | `src/components/scenes/PlaceScenes.tsx` |
| Desenhos do Pingo | `src/components/Penguin.tsx` |

Cada lugar tem um porto (um ponto no mar ao largo da costa). O caminho entre
dois lugares é: lugar → porto → caminho mais curto pela rede de mar → porto →
lugar, desenhado em degraus no quadriculado. Um teste garante que nenhum trecho de mar
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
