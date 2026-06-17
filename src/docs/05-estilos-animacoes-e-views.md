# 5. Estilos, Animações e o Poder das "Views"

Se você precisa mudar a cor de um botão, fazer um card aparecer suavemente na tela, ou simplesmente montar a página final, preste muita atenção neste guia. Ele vai te salvar horas de debug!

---

## 🎨 1. O Arquivo Mágico: `theme.ts`

Localizado em `src/shared/config/theme.ts`.

Neste projeto, **nós não usamos cores hexadecimais soltas** (ex: `#FF0000`) espalhadas pelos arquivos.
Se a cor principal da marca do Brechó mudar amanhã, nós alteramos em **um único lugar** e o site inteiro é atualizado.

O `theme.ts` guarda todos os _Design Tokens_ (cores da marca, tamanhos de sombra, z-index, links e até mensagens padrão do WhatsApp).

### Como usar?

Sempre que precisar passar uma cor num componente (como o chart, ou num `style={{}}` direto) ou precisar de um degradê padronizado:

```tsx
import theme from "@shared/config/theme";

function MeuBanner() {
  return (
    <div style={{ background: theme.gradient.hero }}>
      <h1 style={{ color: theme.brand.orange }}>Destaque!</h1>
      <p>Dúvidas? Ligue para {theme.contact.phone}</p>
    </div>
  );
}
```

_(Nota: Para 90% do tempo você ainda usará as classes do Tailwind CSS como `bg-primary` ou `text-orange-500`, mas o `theme.ts` é o "Dicionário Oficial" do site no JavaScript)._

---

## ✨ 2. Padronizando o Movimento: `animation.ts`

Localizado em `src/shared/config/animation.ts`.

Usamos a biblioteca **Framer Motion** para animações no React. Mas acertar a "física" de uma mola (spring) ou o timing de um fade-in é muito chato.
O `animation.ts` já exporta as constantes de física padronizadas para o projeto. O projeto inteiro vai parecer fluído e igual!

### Como usar?

```tsx
import { motion } from "framer-motion";
import {
  spring1,
  staggerContainer,
  staggerItem,
} from "@shared/config/animation";

function MinhaListaAnimada() {
  return (
    // 'staggerContainer' faz os itens aparecerem um de cada vez (efeito escadinha)
    <motion.ul variants={staggerContainer} initial="hidden" animate="show">
      <motion.li variants={staggerItem}>Roupas 1</motion.li>
      <motion.li variants={staggerItem}>Roupas 2</motion.li>
    </motion.ul>
  );
}
```

Não precise chutar valores de `stiffness` ou `damping`, basta usar `spring1` ou `spring2`.

---

## 🏗️ 3. Como as Páginas (Views) funcionam na prática?

Como mencionado antes, a pasta `app/` é burra, e a pasta `features/` é inteligente, mas quebrada em pedaços (botões, forms, listas).
A pasta **`views/` é a cola que junta tudo isso!**

### Exemplo Prático: Tela de Login

Imagine que você quer criar a tela de login. Eis como o arquivo `src/views/auth/ui/login-page.tsx` vai ficar na prática:

```tsx
// 1. Importações (juntando os ingredientes)
import { LoginForm } from "@features/auth"; // Pega o formulário da feature de Auth
import { AppHeader } from "@widgets/header"; // Pega o header estrutural
import { motion } from "framer-motion";
import { spring1 } from "@shared/config/animation";

// 2. A View (Montando o prato)
export function LoginPage() {
  return (
    <div className="min-h-screen bg-bgBase flex flex-col">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring1}
          className="w-full max-w-md"
        >
          {/* A view não tem lógica de submissão. Ela só chama a Feature! */}
          <LoginForm />
        </motion.div>
      </main>
    </div>
  );
}
```

A **View** foca apenas no layout estrutural (divs, margens centralizadas, fundo da tela). A inteligência de "o que acontece ao clicar no botão Entrar" ficou perfeitamente encapsulada dentro de `<LoginForm />` que está lá na pasta `features/auth`.

Se der pau no login, você já sabe exatamente onde procurar: não é na view, é na feature!
