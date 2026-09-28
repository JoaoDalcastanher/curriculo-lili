# Currículo da Gabrieli

Site-currículo da Gabrieli, professora. Uma página única, bonita e estática — sem banco de
dados, sem login, sem backend.

---

## Linguagem / Language

| Setting              | Value      |
| -------------------- | ---------- |
| Primary language     | Portuguese |
| Multilingual support | No         |
| i18n library         | none       |

> Toda a UI é em português. ADRs e documentação técnica ficam em inglês.

---

## Stack

| Concern           | Choice                                                     |
| ----------------- | ---------------------------------------------------------- |
| Framework         | TanStack Start (prerender estático)                        |
| UI                | Material UI                                                |
| Runtime / pacotes | Bun                                                        |
| Testes            | `bun test` (unitário) + Playwright (E2E)                   |
| Hospedagem        | Railway (`frontend/server.ts` serve os arquivos estáticos) |

Por que só frontend: veja `docs/adr/0014-frontend-only-static-site.md`.

---

## Como editar o conteúdo

Todo o texto do site está em **`frontend/src/content/profile.ts`**: apresentação,
números do topo, sobre, trajetória, projetos, formação e contatos. O conteúdo atual veio
do design do Claude Design; revise escolas, projetos, cursos e contatos.

### Fotos

1. Coloque o arquivo em `frontend/public/fotos/` (ex.: `retrato.jpg`).
2. No `profile.ts`, troque `src: null` pelo caminho, ex.: `src: "/fotos/retrato.jpg"`.

Enquanto `src` for `null`, aparece um espaço reservado com a dica da foto.
Nos projetos, use fotos de mãos, materiais, trabalhos e ambientes, ou crianças de
costas — **nunca rostos de alunos identificáveis**.

### Projetos

Cada projeto tem um `id` (usado no link direto `/?projeto=<id>`), etiquetas (`tags`)
que precisam estar em `projects.filters`, etapas, aprendizados, galeria e um
depoimento opcional.

---

## Rodando

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # gera frontend/dist/client (HTML estático)
bun run start      # serve o build (usa PORT, padrão 3000)
```

## Testes e qualidade

```bash
bun run test       # unitários
bun run test:e2e   # Playwright (build + servidor + navegador)
bun run typecheck
bun run lint
bun run format
```

## Deploy no Railway

1. Crie um projeto no Railway apontando para este repositório.
2. Pronto — `railway.json` já define `bun run build` e `bun run start`. O Railway
   injeta `PORT` automaticamente.

## Estrutura

```
frontend/
  src/content/     conteúdo do site (edite aqui)
  src/models/      tipos
  src/services/    ProfileService (ordenação, filtros, formatação)
  src/animation/   animações (Motion)
  public/fotos/    fotos do site
  src/components/  seções da página
  src/theme/       cores e fontes
  src/utils/       datas
  server.ts        servidor estático para produção
e2e/               testes Playwright
```
