# 8. Padrões de Código e Boas Práticas (Code Style)

Quando um projeto tem muitas pessoas trabalhando juntas, é essencial que o código pareça ter sido escrito por uma única pessoa. Essas "regrinhas invisíveis" podem gerar confusão.

Aqui está o nosso padrão para você nunca mais ter dúvida na hora de criar um arquivo!

---

## 📁 1. Como nomear arquivos e pastas?

**Regra de Ouro: Tudo deve ser `kebab-case` (tudo minúsculo separado por hífen).**

- ❌ Errado: `MeuComponente.tsx`, `loginPage.ts`, `Utils.ts`
- ✅ Certo: `meu-componente.tsx`, `login-page.tsx`, `utils.ts`

**Exceção (O nome da função/componente dentro do arquivo):**
Dentro do código, o nome da função ou componente React sempre será `PascalCase` (Primeira letra maiúscula).

```tsx
// Nome do arquivo: anuncio-card.tsx

// Nome do componente:
export function AnuncioCard() {
  return <div>Card</div>;
}
```

---

## 📦 2. `export const` vs `export default`

Você vai notar que neste projeto **nós quase não usamos `export default`**.

**Por que preferimos exportações nomeadas (`export function` ou `export const`)?**

1. O VS Code consegue achar e importar automaticamente com muito mais facilidade.
2. Evita que o desenvolvedor importe o mesmo componente com nomes diferentes em arquivos diferentes.

**A única exceção:**
Os únicos arquivos que **exigem** `export default` são os da pasta `app/` (ex: `page.tsx` e `layout.tsx`), porque é uma obrigação imposta pelo Next.js.

---

## 🛢️ 3. O mistério do arquivo `index.ts` (O Padrão "Barrel")

Você já reparou que toda pasta dentro de `features/` ou `views/` tem um arquivo `index.ts` cheio de exports? Isso se chama **Barrel Pattern** (Padrão de Barril).

Sem o `index.ts`, para importar três coisas da feature de Anúncios, você teria que fazer isso:

```typescript
// ❌ Muito feio e frágil
import { AnuncioForm } from "@features/anuncios/ui/anuncio-form";
import { fetchAnuncios } from "@features/anuncios/api/fetch-anuncios";
import type { Anuncio } from "@features/anuncios/model/anuncio-schemas";
```

Com o `index.ts` agrupando e reexportando tudo o que é "público" na feature, o seu código fica lindo assim:

```typescript
// ✅ Lindo e robusto
import { AnuncioForm, fetchAnuncios, Anuncio } from "@features/anuncios";
```

**Sua Tarefa:** Sempre que criar um componente novo, vá no arquivo `index.ts` daquela pasta e exporte ele lá!

---

## 🔒 4. Variáveis de Ambiente (`.env`)

Se no futuro o projeto passar a bater em uma API real em vez do localStorage, nós usaremos variáveis de ambiente.

- Você **nunca** deve commitar o arquivo `.env` ou `.env.local` no GitHub, porque ele contém senhas e chaves secretas.
- O arquivo `.env.example` é o único que vai pro GitHub. Ele serve como um "esqueleto" vazio para que os novos desenvolvedores saibam quais variáveis precisam configurar na máquina deles.

Se precisar rodar o projeto do zero:
Crie um arquivo `.env.local` na raiz e copie o que tem dentro do `.env.example`.
