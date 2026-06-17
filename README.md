<div align="center">
    <img src="https://github.com/dresses-tech.png" width="100" alt="Dresses Engineering" style="border-radius: 15%"/>
    <h1>Next.js Boilerplate 2026</h1>
    <p>
        <strong>Dresses — Divisão de Desenvolvimento de Software</strong>
    </p>
    <p>
        <a href="https://dresses.com.br">dresses.com.br</a>
    </p>
</div>

<br/>

> **Propósito:** Template de referência para novos projetos frontend da Dresses. Consolidamos as decisões arquiteturais, padrões de código e ferramental aprovados pelo time de Staff Engineers eliminando o custo de setup e garantindo consistência entre produtos.

<br/>

### Especificações Técnicas

| Domínio            | Stack                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**      | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_19-000?style=flat-square&logo=react&logoColor=61DAFB) &nbsp; App Router com Server Components e Server Actions nativos.                                                                              |
| **Linguagem**      | ![TypeScript](https://img.shields.io/badge/TypeScript_5-000?style=flat-square&logo=typescript&logoColor=white) &nbsp; Tipagem estática mandatória em toda a base de código.                                                                                                                                                                             |
| **Estilização**    | ![Tailwind](https://img.shields.io/badge/Tailwind_v3-000?style=flat-square&logo=tailwindcss&logoColor=38BDF8) &nbsp; Utility-first com shadcn/ui como biblioteca de componentes base.                                                                                                                                                                   |
| **Arquitetura**    | ![FSD](https://img.shields.io/badge/Feature--Sliced_Design-000?style=flat-square&logoColor=white) &nbsp; Separação por domínio: `views`, `features`, `entities`, `widgets`, `shared`.                                                                                                                                                                   |
| **Estado e Dados** | ![Zustand](https://img.shields.io/badge/Zustand_5-000?style=flat-square&logoColor=white) ![TanStack](https://img.shields.io/badge/TanStack_Query_5-000?style=flat-square&logo=reactquery&logoColor=FF4154) &nbsp; Estado global leve + server state com cache gerenciado.                                                                               |
| **Validação**      | ![Zod](https://img.shields.io/badge/Zod-000?style=flat-square&logoColor=white) ![next-safe-action](https://img.shields.io/badge/next--safe--action-000?style=flat-square&logoColor=white) &nbsp; Schema validation em runtime integrado às Server Actions.                                                                                              |
| **URL State**      | ![nuqs](https://img.shields.io/badge/nuqs_2-000?style=flat-square&logoColor=white) &nbsp; Parâmetros de URL tipados como fonte de verdade para estado de UI.                                                                                                                                                                                            |
| **Qualidade**      | ![ESLint](https://img.shields.io/badge/ESLint_9-000?style=flat-square&logo=eslint&logoColor=4B32C3) ![Prettier](https://img.shields.io/badge/Prettier-000?style=flat-square&logo=prettier&logoColor=F7BA3E) ![Husky](https://img.shields.io/badge/Husky-000?style=flat-square&logoColor=white) &nbsp; Lint, formatação e hooks de commit automatizados. |
| **Commits**        | ![Commitlint](https://img.shields.io/badge/Conventional_Commits-000?style=flat-square&logoColor=white) &nbsp; Padrão Conventional Commits validado via commitlint + commitizen.                                                                                                                                                                         |

<br/>

### Estrutura do Projeto

```
src/
├── app/                    # Shell de roteamento — Next.js App Router apenas
│   ├── (auth)/             # Route group de autenticação
│   ├── dashboard/
│   │   └── page.tsx        # Thin shell → importa de views/
│   ├── globals.css
│   └── layout.tsx
├── views/                  # Camada de páginas (FSD) — composição de widgets e features
│   └── dashboard/
│       ├── ui/
│       │   └── dashboard-page.tsx
│       └── index.ts
├── widgets/                # Blocos compostos de UI reutilizáveis entre páginas
│   ├── header/
│   └── footer/
├── features/               # Unidades de funcionalidade de negócio isoladas
│   └── counter/
│       ├── api/            # Server Actions da feature
│       ├── model/          # Store e lógica de estado local
│       ├── ui/             # Componentes da feature
│       └── index.ts
├── entities/               # Entidades de domínio (tipos, schemas, fetchers base)
└── shared/                 # Código agnóstico de domínio compartilhado
    ├── api/                # Cliente HTTP base
    ├── config/             # Constantes e mapa de rotas
    ├── hooks/              # Hooks utilitários
    ├── lib/                # Utilitários: env, cache, safe-action, utils
    ├── providers/          # Providers React (QueryProvider, ThemeProvider...)
    ├── store/              # Estado global de UI
    ├── types/              # Tipos e interfaces compartilhadas
    └── ui/                 # Componentes base (shadcn/ui)
```

<br/>

### Início Rápido

```bash
# 1. Clone o template
git clone https://github.com/dresses-tech/nextjs-template.git meu-projeto

# 2. Instale as dependências
cd meu-projeto && npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

<br/>

### Comandos Disponíveis

| Comando            | Descrição                                    |
| :----------------- | :------------------------------------------- |
| `npm run dev`      | Servidor de desenvolvimento com Turbopack    |
| `npm run build`    | Build de produção                            |
| `npm run start`    | Inicia o servidor de produção                |
| `npm run commit`   | Assistente interativo de commit (commitizen) |
| `npm run lint`     | Análise estática com ESLint                  |
| `npm run lint:fsd` | Validação das regras de arquitetura FSD      |
| `npm run format`   | Formatação automática com Prettier           |

<br/>

### Diretrizes Arquiteturais

1. **Isolamento por domínio:** Cada feature é autossuficiente — api, model e ui vivem juntos dentro da slice. Dependências sempre apontam para baixo na hierarquia FSD (`views → features → entities → shared`).
2. **App Router como shell:** O diretório `app/` contém exclusivamente arquivos de roteamento Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`). A lógica de página reside em `views/`.
3. **Server Actions como padrão de mutação:** Toda operação de escrita utiliza Server Actions via `next-safe-action` com schema Zod. Nenhuma rota de API é criada para mutações internas.
4. **URL como fonte de verdade:** Estado de filtros, paginação e parâmetros de UI é gerenciado via `nuqs` — não em estado local ou store global.
5. **Commits semânticos obrigatórios:** Toda alteração segue o padrão Conventional Commits. O hook `commit-msg` bloqueia mensagens fora do formato.

---

<div align="center">
    <sub>
        Divisão de Desenvolvimento • Dresses © 2026
    </sub>
</div>
