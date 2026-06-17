# 1. Entendendo a Arquitetura FSD

O projeto utiliza **Feature-Sliced Design (FSD)**. O objetivo é manter o código organizado por domínio de negócio, e não por tipo técnico (não temos uma pasta gigante de "components" com tudo misturado).

Aqui está a hierarquia das pastas dentro de `src/`, ordenadas do mais externo (Next.js) para o mais interno (Core):

## 1. `app/` (Thin Shells)

A pasta raiz do Next.js. **Nenhuma lógica de negócio deve existir aqui.** Os arquivos `page.tsx` aqui devem ser "burros". Eles apenas importam a página correspondente da pasta `views/` e cuidam de coisas exclusivas do Next.js, como leitura de params da URL dinâmicos (`[id]`) ou metadados de SEO.

## 2. `views/` (Páginas)

Uma "View" é a tela inteira. Por exemplo, a página de Login (`views/auth/ui/login-page.tsx`).
A view é responsável por orquestrar os widgets e features.
_Ex: A `anuncios-list-page` importa os filtros, a lista de itens, o header e monta a tela._

## 3. `widgets/` (Blocos independentes globais)

Componentes independentes e robustos, que são formados por múltiplas "features".
Geralmente são itens estruturais como `Header`, `Footer`, `Sidebar`, ou um `AnuncioCard` super complexo que vai aparecer em múltiplos lugares (no feed, na garagem, no perfil).

## 4. `features/` (O coração do negócio)

É aqui que você vai passar a maior parte do seu tempo. Cada feature encapsula uma "funcionalidade que entrega valor".
Exemplo: `features/anuncios`, `features/negociacao`, `features/auth`.

Dentro de uma feature, dividimos o código em 3 partes:

- **`api/`**: As funções que buscam ou salvam dados (no nosso caso, as funções que mexem no LocalStorage).
- **`model/`**: A "mente" da feature. Contém validações (Zod Schemas) e o estado global da feature (Zustand store).
- **`ui/`**: Os componentes React específicos dessa feature (ex: `AnuncioForm`, `AnuncioList`).

> **Importante:** Todo módulo de feature deve exportar tudo o que é público através do arquivo `index.ts` (Barrel export). Quando você importar algo de uma feature, importe da raiz dela (`@features/anuncios`) e não do arquivo direto.

## 5. `entities/` (Tipos e Essência)

Aqui guardamos apenas as **interfaces e tipos TypeScript** puros (os modelos de domínio).
_Ex: Como é o formato do objeto `User` ou `Anuncio`?_. Ficam aqui para que todo o sistema os conheça.

## 6. `shared/` (Utilitários e UI Base)

O nível mais baixo. Tudo aqui deve ser genérico e desconhecer completamente a regra de negócio do Brechó.

- **`components/ui/`**: Onde ficam todos os componentes do **shadcn/ui** (Input, Button, Dialog). Eles são burros e só cuidam da aparência.
- **`lib/`**: Funções utilitárias (formatar data, manipulação de cache, storage).
- **`config/`**: Variáveis de ambiente, fontes e configuração de rotas.
