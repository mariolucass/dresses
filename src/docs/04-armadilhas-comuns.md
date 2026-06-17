# 4. Armadilhas Comuns e Conceitos Web

Se você está começando agora com o ecossistema moderno do React (Next.js App Router, Tailwind, TypeScript), algumas coisas neste projeto podem parecer confusas ou dar erros estranhos.

Aqui estão as armadilhas mais comuns e como sair delas:

## 1. O misterioso erro de `"localStorage is not defined"` ou `"useState is not defined"`

O Next.js utiliza **Server Components** por padrão. Isso significa que ele tenta rodar o código no servidor (Node.js) antes de mandar para o navegador. O servidor não tem tela, não tem `localStorage` e não tem `onClick`.

**Como resolver:**
Se o seu componente (`.tsx`) tem interatividade de tela (clicks, formulários) ou usa hooks (`useState`, `useEffect`), **você deve escrever `'use client';` na linha 1 do arquivo.**

```tsx
"use client";

import { useState } from "react";

export function MeuBotao() {
  const [cliques, setCliques] = useState(0);
  return (
    <button onClick={() => setCliques((c) => c + 1)}>Cliques: {cliques}</button>
  );
}
```

## 2. Onde instalo os componentes visuais? (Entendendo o Shadcn/UI)

Você pode estar acostumado a instalar bibliotecas como Material UI ou Bootstrap via NPM (`npm install @mui/material`).
O **Shadcn/UI**, que usamos aqui, é diferente: ele não é uma biblioteca instalada no `node_modules`.

Quando instalamos um componente (ex: Button), o código fonte do botão é **copiado fisicamente** para dentro de `src/shared/components/ui/button.tsx`.
Isso é incrível porque significa que se você quiser mudar como o botão padrão do projeto funciona, basta abrir esse arquivo e editar o código dele à vontade!

## 3. Chega de `../../../../` nos imports (Path Aliases)

Ao navegar pelas pastas da arquitetura FSD, os caminhos relativos ficariam gigantescos:
`import { AnuncioCard } from '../../../../../widgets/anuncio-card'` ❌

Para resolver isso, usamos "Path Aliases" (configurados no `tsconfig.json`). Você sempre pode puxar algo direto da raiz da sua respectiva camada usando `@`:

```tsx
import { AnuncioCard } from "@widgets/anuncio-card"; // ✅ Certo
import { useAuthStore } from "@features/auth"; // ✅ Certo
import { Button } from "@shared/components/ui/button"; // ✅ Certo
```

## 4. Por que usamos `cn()` no Tailwind CSS?

Muitas vezes, você quer combinar classes do Tailwind estáticas com classes que vêm por variável:

```tsx
// ❌ Pode dar conflito se a props.className também tiver margem!
<div className={`mt-4 bg-red-500 ${props.className}`}>
```

O utilitário `cn()` (Tailwind Merge + clsx) que temos em `src/shared/lib/utils.ts` existe para resolver conflitos de classes. Se você enviar uma cor de fundo na prop, ele inteligentemente apaga a cor de fundo original:

```tsx
import { cn } from '@shared/lib/utils';

// ✅ Certo e seguro
<div className={cn('mt-4 bg-red-500', props.className)}>
```

## 5. Zod vs Typescript Interfaces

Você deve ter visto pastas `model/` cheias de arquivos `*-schemas.ts` que usam uma biblioteca chamada `Zod`.
O TypeScript é maravilhoso, mas **ele desaparece** quando o código vira JavaScript e roda no navegador. Se o usuário digitar um número num campo de texto, o TypeScript não pode fazer nada na hora.

O Zod serve para checar os dados em **tempo de execução** (quando o app já está rodando).
E o melhor: nós não precisamos escrever a Interface TypeScript e o Schema do Zod. O Zod gera a Interface para nós!

```typescript
import { z } from "zod";

// 1. Criamos a regra real que vai rodar no navegador
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido!"),
  senha: z.string().min(6, "Mínimo de 6 caracteres"),
});

// 2. O TypeScript cria o Type automaticamente a partir da regra!
export type LoginFormData = z.infer<typeof loginSchema>;
```

## 6. TypeScript muito "chato" com Null/Undefined

O TypeScript frequentemente vai reclamar que `O objeto possivelmente é 'undefined'`.
Não use `any` ou `//@ts-ignore` para calar o TypeScript. Se ele está avisando, é porque sua tela pode quebrar se o dado realmente não existir.

Use os operadores modernos do JS para se proteger:

- **Optional Chaining (`?.`)**: `usuario?.nome` (só tenta acessar `nome` se `usuario` existir).
- **Nullish Coalescing (`??`)**: `usuario?.saldo ?? 0` (se o saldo for undefined ou null, usa `0`).
- **Early Return**:
  ```tsx
  if (!usuario) return <p>Carregando...</p>;
  return <h1>{usuario.nome}</h1>;
  ```
