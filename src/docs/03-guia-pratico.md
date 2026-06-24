# 3. Guia Prático: Onde coloco isso?

Para evitar paralisia por análise (pensar demais onde colocar um simples arquivo), siga este guia rápido de perguntas e respostas.

## 🎨 Onde colocar componentes?

**1. É um componente puro de UI (como um Input, Button, Accordion genérico)?**
➡️ `src/shared/components/ui/` (É aqui que vive o shadcn/ui).

**2. É um formulário ou um componente específico de negócio (ex: Lista de Anúncios, Balão de Chat)?**
➡️ `src/features/[nome-da-feature]/ui/`. (Ex: `features/anuncios/ui/anuncio-list.tsx`).

**3. É um bloco enorme que engloba o site todo ou une várias coisas (ex: Header, Footer, Sidebar)?**
➡️ `src/widgets/`.

**4. É a página inteira?**
➡️ `src/views/`. Mas lembre-se: a view deve ser construída "colando" componentes importados de features e widgets, tente não criar CSS muito complexo nela diretamente.

**5. É a rota para fazer o Next.js funcionar?**
➡️ `src/app/`. Importe a view correspondente aqui.

---

## 🛠️ Onde colocar Lógica?

**1. É uma chamada para buscar/salvar algo no "banco de dados" (localStorage)?**
➡️ `src/features/[nome-da-feature]/api/`.

**2. É uma regra de negócio, estado global ou formato de validação (Zod)?**
➡️ `src/features/[nome-da-feature]/model/`.

**3. É uma interface TypeScript que descreve o que o aplicativo faz no mundo real (ex: Usuario, Venda)?**
➡️ `src/entities/`.

**4. É uma função utilitária boba, como formatar um CPF ou converter data?**
➡️ `src/shared/lib/utils.ts` ou criar um novo arquivo em `shared/lib/`.

---

## 🔄 Qual o fluxo padrão para fazer uma tela do zero?

Seja pragmático. Imagine que o Dev 3 vá fazer a tela da Garagem:

1. **A rota já existe:** Ele vai em `src/app/(main)/garagem/page.tsx` e vê que lá apenas renderiza `<GaragemPage />`.
2. **A view é o alvo:** Ele entra em `src/views/garagem/ui/garagem-page.tsx`. Este arquivo está vazio com um texto de placeholder.
3. **Construindo a UI:** Ele começa a desenhar a UI aqui mesmo (usando divs e Tailwind).
4. **Separando em features:** Quando o código ficar grande (ex: as "Tabs" ficaram gordinhas com muita lógica), ele abre `src/features/garagem/ui/garagem-tabs.tsx`, cria o componente lá, e **exporta no `index.ts`** de features/garagem.
5. **Importando:** Ele volta na View e importa: `import { GaragemTabs } from '@features/garagem'`.

Pronto, a arquitetura está mantida e sem stress mental! 🚀
