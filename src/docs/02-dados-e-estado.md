# 2. Manipulação de Dados e Estado

Como este projeto é um frontend focado em UI e arquitetura, **não temos um backend real e nem um banco de dados SQL**.

## 1. Banco de Dados (LocalStorage API)

Nós simulamos um banco de dados utilizando a memória do navegador (`localStorage`).
Para não virar bagunça, **nunca use `window.localStorage` diretamente**.

Nós temos uma camada de abstração pronta para isso em `src/shared/lib/storage.ts`.

### Como buscar e salvar dados?

Você não precisa construir isso do zero. As pastas `api/` dentro de cada feature já possuem as funções prontas!
Por exemplo, se você quer atualizar o status de um anúncio na Garagem, procure pela função pronta:

```typescript
// Importe do barrel da feature
import { updateItemStatusService } from "@features/garagem";

// Use no seu componente:
const resultado = updateItemStatusService("id-do-anuncio", "EM_NEGOCIACAO");
if (resultado.success) {
  toast("Status atualizado!");
}
```

## 2. Formulários e Validações

Sempre utilize **Zod** + **React Hook Form**.
Os schemas do Zod de validação já estão criados dentro das pastas `model/` de cada feature.

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avaliacaoSchema, AvaliacaoFormData } from "@features/avaliacoes";

// No componente React:
const form = useForm<AvaliacaoFormData>({
  resolver: zodResolver(avaliacaoSchema),
});
```

## 3. Estado Global (Zustand)

Se você precisa que um componente numa tela passe informações para outro componente totalmente diferente (sem usar props intermináveis), use o Zustand.

As stores do Zustand ficam em `model/nome-da-feature-store.ts`.

Exemplo: Buscar o saldo do VAT e atualizar em todos os lugares.

```typescript
import { useVatStore } from '@features/vat';

function MeuComponente() {
  const { saldo, addSaldo } = useVatStore();

  return <button onClick={() => addSaldo(100)}>Ganhar 100 Pontos</button>
}
```

## 4. Estado na URL (Filtros)

Para filtros de busca, paginação ou abas ativas, usamos a biblioteca `nuqs`. Ela salva o estado na barra de endereços, o que permite o usuário recarregar a página e não perder o filtro.
Os parsers do `nuqs` ficam em arquivos `-filters.ts` nas pastas `model/`.
