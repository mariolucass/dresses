<div align="center">
    <img src="https://github.com/dresses-tech.png" width="100" alt="Dresses Engineering" style="border-radius: 15%"/>
    <h1>Brechó Online</h1>
    <p>
        <strong>Plataforma de Compra, Venda e Troca de Roupas Sustentável</strong>
    </p>
    <p>
        <a href="https://dresses.com.br">dresses.com.br</a>
    </p>
</div>

<br/>

> **Sobre o Projeto:** O Brechó Online é um sistema frontend desenvolvido para demonstrar arquitetura escalável utilizando **Feature-Sliced Design (FSD)**. 
> 
> ⚠️ **Importante:** Este projeto é focado em UI/UX e arquitetura. **Não possui backend real**. Toda a persistência de dados e autenticação é simulada e armazenada no `localStorage` do navegador do usuário.

<br/>

### 📚 Documentação para Desenvolvedores
Se você é novo no projeto ou não está familiarizado com a arquitetura FSD, consulte nossa documentação interna obrigatória:
- [Guia 1: Entendendo a Arquitetura (FSD)](./src/docs/01-arquitetura-fsd.md)
- [Guia 2: Manipulação de Dados e Estado](./src/docs/02-dados-e-estado.md)
- [Guia 3: Onde colocar meu código?](./src/docs/03-guia-pratico.md)
- [Guia 4: Armadilhas Comuns e Conceitos Web](./src/docs/04-armadilhas-comuns.md)
- [Guia 5: Estilos, Animações e Views](./src/docs/05-estilos-animacoes-e-views.md)

<br/>

### Especificações Técnicas

| Domínio            | Stack                                                                                                                                                                                                                                                                                                                                                   |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**      | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_19-000?style=flat-square&logo=react&logoColor=61DAFB) &nbsp; App Router configurado para renderização de features client-side estritas.                                                                              |
| **Linguagem**      | ![TypeScript](https://img.shields.io/badge/TypeScript_5-000?style=flat-square&logo=typescript&logoColor=white) &nbsp; Tipagem estática mandatória e criação de Models de Domínio em `entities/`.                                                                                                                                                                             |
| **Estilização**    | ![Tailwind](https://img.shields.io/badge/Tailwind_v4-000?style=flat-square&logo=tailwindcss&logoColor=38BDF8) &nbsp; Utility-first CSS com biblioteca base `shadcn/ui` + Framer Motion para animações fluidas.                                                                                                                                                                   |
| **Arquitetura**    | ![FSD](https://img.shields.io/badge/Feature--Sliced_Design-000?style=flat-square&logoColor=white) &nbsp; Separação por domínio: `app`, `views`, `widgets`, `features`, `entities`, `shared`.                                                                                                                                                                   |
| **Estado e Mock**  | ![Zustand](https://img.shields.io/badge/Zustand_5-000?style=flat-square&logoColor=white) &nbsp; Estado global local e persistência assíncrona simulada via Web Storage API encapsulada.                                                                               |
| **Validação**      | ![Zod](https://img.shields.io/badge/Zod-000?style=flat-square&logoColor=white) &nbsp; Schema validation em runtime e inferência automática de tipos estáticos para formulários via react-hook-form.                                                                                              |
| **URL State**      | ![nuqs](https://img.shields.io/badge/nuqs_2-000?style=flat-square&logoColor=white) &nbsp; Parâmetros de busca e navegação (filtros) tipados diretamente da URL sem causar re-renders pesados.                                                                                                                                                                                            |
| **Qualidade**      | ![ESLint](https://img.shields.io/badge/ESLint_9-000?style=flat-square&logo=eslint&logoColor=4B32C3) ![Prettier](https://img.shields.io/badge/Prettier-000?style=flat-square&logo=prettier&logoColor=F7BA3E) &nbsp; Regras estritas FSD automatizadas e proteção de commits. |

<br/>

### Features do Sistema

1. **Autenticação Simulada (`auth`)**: Login e cadastro que interagem com o banco fake e criam sessões de usuário no frontend.
2. **Catálogo de Peças (`anuncios`)**: Listagem rica, paginação, filtros reativos e visualização em detalhes de peças de roupa.
3. **Minha Garagem (`garagem`)**: Controle das peças próprias ativas, em pausa, vendidas ou em negociação.
4. **Negociações (`negociacao`)**: Sistema poderoso onde compradores enviam propostas (dinheiro ou troca de peças) e vendedores aceitam/fazem contrapropostas.
5. **Chat Inteligente (`chat`)**: Janela de mensagens entre usuários atrelada a uma negociação.
6. **Sistema Econômico (`vat`)**: O VAT (Value Added Token) é uma moeda virtual e score de confiabilidade do usuário que destrava benefícios e limites.
7. **Avaliações (`avaliacoes`)**: Reputação comunitária pós-transação (1 a 5 estrelas).

<br/>

### Estrutura do Projeto (FSD)

A arquitetura do projeto segue a ordem de hierarquia restrita abaixo (de cima para baixo). Camadas inferiores não podem importar de camadas superiores.

```
src/
├── app/                    # 1. Rotas do Next.js. Não contém regras, apenas layouts e SEO.
├── views/                  # 2. Páginas completas coladas juntas (Auth, Feed, Landing, Perfil).
├── widgets/                # 3. Blocos globais robustos (Header, Footer, Sidebar, AnuncioCard).
├── features/               # 4. Onde a regra de negócio vive (Anúncios, Chat, Negociações...).
│   └── nome-feature/
│       ├── api/            # CRUD LocalStorage
│       ├── model/          # Zustand store e Zod schemas
│       ├── ui/             # Componentes React
│       └── index.ts        # Barrel export obrigatório
├── entities/               # 5. Domínios puros (Tipos TS, sem UI ou lógica pesada).
└── shared/                 # 6. Código genérico não atrelado a negócios.
    ├── components/ui/      # Botões, inputs e componentes shadcn/ui.
    ├── config/             # theme.ts, animation.ts, routes.ts
    └── lib/                # Funções de storage, id, mask.
```

<br/>

### Início Rápido

Para testar localmente o sistema e os dados pré-populados do "banco de dados" fake:

```bash
# 1. Clone o projeto e instale
git clone <url-do-repo> brecho-online
cd brecho-online
yarn

# 2. Inicie o projeto
yarn dev
```

*Nota: O sistema populará o LocalStorage automaticamente com 3 usuários, 5 anúncios e saldos padrão ao abrir a página pela primeira vez (`src/shared/lib/seed.ts`). Para resetar, limpe os dados do site no seu navegador.*

<br/>

### Contribuição e Commits

Toda alteração de código neste repositório precisa estar no padrão `Conventional Commits` (feat, fix, refactor, chore). Se você não sabe usar ou quer evitar falhas, use nosso utilitário na hora de commitar:

```bash
git add .
yarn commit  # Um wizard interativo no terminal vai te guiar
git push
```

---

<div align="center">
    <sub>
        Divisão de Desenvolvimento • Dresses © 2026
    </sub>
</div>
