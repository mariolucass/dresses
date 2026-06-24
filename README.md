<div align="center">
  <img src="https://github.com/dresses-tech.png" width="100" alt="Dresses Engineering" style="border-radius: 15%; margin-bottom: 10px"/>
  <h1>♻️ Desapeguei (Brechó Online)</h1>
  <p><em>A economia circular na palma da sua mão. Um bazar online inteligente estruturado com Feature-Sliced Design (FSD).</em></p>

  📦 **Projeto Prático - Desenvolvimento Web I**

  ---

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
</div>

<br/>

> **Sobre o Projeto:** O Brechó Online (Desapeguei) é um sistema frontend de alta performance desenvolvido para demonstrar arquitetura escalável utilizando **Feature-Sliced Design (FSD)**, focado em **métricas de Web Performance (LCP, TBT)** e em uma **UI/UX premium**, inspirada nos mais altos padrões de mercado.
>
> ⚠️ **Importante:** Este projeto é 100% focado no Frontend. **Não possui backend real**. Toda a persistência de dados (incluindo usuários de teste) e autenticação é simulada utilizando um banco em memória/localStorage, desenhado para rodar fluidamente no navegador.

---

## 📌 Navegação Rápida
* [✨ Sobre o Desapeguei](#-sobre-o-desapeguei)
* [🧗 Maiores Desafios](#-maiores-desafios)
* [👥 Integrantes](#-integrantes)
* [📚 Documentação para Desenvolvedores](#-documentação-para-desenvolvedores)
* [⚙️ Especificações Técnicas](#️-especificações-técnicas)
* [🚀 Features do Sistema](#-features-do-sistema)
* [📐 Estrutura do Projeto (FSD)](#-estrutura-do-projeto-fsd)
* [💻 Início Rápido](#-início-rápido)
* [🛠️ Contribuição e Commits](#️-contribuição-e-commits)

---

## ✨ Sobre o Desapeguei

O **Desapeguei** nasceu para transformar a forma como as pessoas renovam seus guarda-roupas. Mais do que um site de compras comum, a plataforma foi desenhada sob o conceito de **economia circular**, permitindo que os usuários negociem roupas, calçados e acessórios de maneira colaborativa.

O grande coração do ecossistema é o **VAT**, uma moeda virtual fictícia. Com ela, o sistema viabiliza **trocas inteligentes**: se você quer uma peça, mas o seu desapego vale um pouco menos, o sistema calcula a diferença e sugere uma compensação justa (sua peça + saldo em VATs) para que ninguém saia perdendo.

**Destaques do Desenvolvimento:**
- Interfaces ultra responsivas e micro-interações focadas em conversão.
- Refinamento de acessibilidade e redação polida, priorizando a experiência do usuário.
- Carregamento de imagens otimizado (`next/image`) para manter a performance de LCP impecável.
- Lógica robusta e isolada de componentes para a visibilidade baseada no papel do usuário e escopos de sessão (ex: propostas e negociações seguras).

---

## 🧗 Maiores Desafios

Durante a construção do projeto, a equipe superou alguns desafios técnicos bastante significativos, sendo os três maiores:

1. **Arquitetura FSD na Prática**: Adaptar o pensamento da equipe para a separação rigorosa de domínios via *Feature-Sliced Design*. O grande desafio foi manter o isolamento estrito entre `features`, `entities` e `shared`, exigindo planejamento contínuo para evitar dependências circulares e acoplamento excessivo na lógica de negócio.
2. **Backend Simulado e Persistência Complexa**: Emular toda a lógica de um banco de dados relacional e serviços de autenticação rodando 100% no cliente (usando `localStorage`). Desenvolver "APIs mockadas" que garantissem a integridade das transações, a segurança baseada no dono do anúncio (para propostas/negociações) e o escopo correto da sessão para múltiplos usuários de teste na mesma máquina.
3. **Performance e Web Vitals com UI Premium**: Entregar uma interface gráfica deslumbrante, altamente interativa (micro-animações com Framer Motion) e acessível, e ainda assim alcançar métricas excepcionais de LCP (Largest Contentful Paint) e TBT. Isso envolveu otimizações cirúrgicas de `next/image` e gerenciamento inteligente da DOM no Next.js.

---

## 👥 Integrantes

Trabalho desenvolvido com dedicação pelos discentes de **Sistemas de Informação (IFCE)**:

* **Ana Caroline Gomes Carneiro** 💻
* **Mario Lucas de Almeida Silva** 🚀
* **Joao Vitor Moura Leite Lima** 🛠️
* **Wallyson Santos Souza** 🎨

---

## 📚 Documentação para Desenvolvedores

Se você é novo no projeto ou não está familiarizado com a arquitetura FSD, consulte nossa documentação interna obrigatória:

- [Guia 1: Entendendo a Arquitetura (FSD)](./src/docs/01-arquitetura-fsd.md)
- [Guia 2: Manipulação de Dados e Estado](./src/docs/02-dados-e-estado.md)
- [Guia 3: Onde colocar meu código?](./src/docs/03-guia-pratico.md)
- [Guia 4: Armadilhas Comuns e Conceitos Web](./src/docs/04-armadilhas-comuns.md)
- [Guia 5: Estilos, Animações e Views](./src/docs/05-estilos-animacoes-e-views.md)

---

## ⚙️ Especificações Técnicas

| Domínio           | Stack                                                                                                                                                                                                                                                                                      |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_19-000?style=flat-square&logo=react&logoColor=61DAFB) &nbsp; App Router configurado para renderização de features client-side estritas. |
| **Linguagem**     | ![TypeScript](https://img.shields.io/badge/TypeScript_5-000?style=flat-square&logo=typescript&logoColor=white) &nbsp; Tipagem estática mandatória e criação de Models de Domínio em `entities/`.                                                                                           |
| **Estilização**   | ![Tailwind](https://img.shields.io/badge/Tailwind_v4-000?style=flat-square&logo=tailwindcss&logoColor=38BDF8) &nbsp; Utility-first CSS com biblioteca base `shadcn/ui` + Framer Motion para animações fluidas.                                                                             |
| **Arquitetura**   | ![FSD](https://img.shields.io/badge/Feature--Sliced_Design-000?style=flat-square&logoColor=white) &nbsp; Separação por domínio: `app`, `views`, `widgets`, `features`, `entities`, `shared`.                                                                                               |
| **Estado e Mock** | ![Zustand](https://img.shields.io/badge/Zustand_5-000?style=flat-square&logoColor=white) &nbsp; Estado global local e persistência assíncrona simulada via Web Storage API encapsulada.                                                                                                    |
| **Validação**     | ![Zod](https://img.shields.io/badge/Zod-000?style=flat-square&logoColor=white) &nbsp; Schema validation em runtime e inferência automática de tipos estáticos para formulários via react-hook-form.                                                                                        |
| **URL State**     | ![nuqs](https://img.shields.io/badge/nuqs_2-000?style=flat-square&logoColor=white) &nbsp; Parâmetros de busca e navegação (filtros) tipados diretamente da URL sem causar re-renders pesados.                                                                                              |
| **Qualidade**     | ![ESLint](https://img.shields.io/badge/ESLint_9-000?style=flat-square&logo=eslint&logoColor=4B32C3) ![Prettier](https://img.shields.io/badge/Prettier-000?style=flat-square&logo=prettier&logoColor=F7BA3E) &nbsp; Regras estritas FSD automatizadas e proteção de commits.                |

---

## 🚀 Features do Sistema

1. **Autenticação Simulada (`auth`)**: Login e cadastro integrados com um sistema de seed automático (incluindo usuários de teste como `maria@mail.com` e `joao@mail.com`).
2. **Catálogo de Peças (`anuncios`)**: Listagem rica, paginação, filtros reativos e visualização em detalhes de peças de roupa (com carregamento de imagens super otimizado).
3. **Minha Garagem (`garagem`)**: Controle das peças próprias ativas, em pausa, vendidas ou em negociação.
4. **Negociações Inteligentes (`negociacao`)**: Sistema robusto onde compradores enviam propostas (dinheiro ou troca de peças) e vendedores aceitam/fazem contrapropostas, com lógicas restritas à propriedade do anúncio e sessão.
5. **Chat Contextual (`chat`)**: Janela de mensagens entre usuários atrelada a uma negociação específica.
6. **Sistema Econômico (`vat`)**: O VAT (Value Added Token) atua como moeda virtual e score de confiabilidade, destravando benefícios.
7. **Landing Page Envolvente**: Introdução elegante da plataforma contando com testemunhos reais de usuários ("Customer Testimonials") para gerar valor percebido.
8. **Avaliações (`avaliacoes`)**: Reputação comunitária pós-transação (1 a 5 estrelas).

---

## 📐 Estrutura do Projeto (FSD)

A arquitetura do projeto segue a ordem de hierarquia restrita abaixo (de cima para baixo). Camadas inferiores não podem importar de camadas superiores.

```yaml
src/
├── app/                    # 1. Rotas do Next.js. Não contém regras, apenas layouts e SEO.
├── views/                  # 2. Páginas completas coladas juntas (Auth, Feed, Landing, Perfil).
├── widgets/                # 3. Blocos globais robustos (Header, Footer, Sidebar, AnuncioCard).
├── features/               # 4. Onde a regra de negócio vive (Anúncios, Chat, Negociações...).
│   └── nome-feature/
│       ├── api/            # CRUD LocalStorage / Mock API
│       ├── model/          # Zustand store, Server Actions e Zod schemas
│       ├── ui/             # Componentes React (Ex: Login Forms bem espaçados e polidos)
│       └── index.ts        # Barrel export obrigatório
├── entities/               # 5. Domínios puros (Tipos TS, sem UI pesada).
└── shared/                 # 6. Código genérico não atrelado a negócios.
    ├── components/ui/      # Botões, inputs e componentes shadcn/ui.
    ├── config/             # theme.ts, animation.ts, routes.ts
    └── lib/                # Funções de storage, seed, id e utilities globais.
```

---

## 💻 Início Rápido

Para testar localmente o sistema e os dados pré-populados:

```bash
# 1. Clone o projeto e instale as dependências
git clone <url-do-repo> brecho-online
cd brecho-online
yarn

# 2. Inicie o servidor de desenvolvimento
yarn dev
```

> **Dica de Teste:** O sistema populará o ambiente automaticamente (`src/shared/lib/seed.ts`) criando usuários de teste. Tente acessar com:
> - **Email**: `maria@mail.com` | **Senha**: `123456`
> - **Email**: `joao@mail.com` | **Senha**: `123456`
> 
> *Para resetar o banco de dados e as alterações, limpe o LocalStorage do seu navegador.*

---

## 🛠️ Contribuição e Commits

Toda alteração de código neste repositório precisa estar no padrão `Conventional Commits` (feat, fix, refactor, chore). Facilitamos esse processo com o utilitário interativo `Commitizen`. 

Ao invés de usar `git commit` manualmente, utilize:

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
