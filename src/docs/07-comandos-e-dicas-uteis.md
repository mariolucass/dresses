# 7. Comandos e Dicas Úteis para Sobrevivência

Seja você um iniciante no desenvolvimento Web ou apenas novo no ecossistema do Next.js e Yarn, esta página reúne os comandos que você mais vai usar no terminal e algumas dicas de ouro para o dia a dia.

---

## 💻 1. Comandos do Terminal (Yarn)

Você deve rodar estes comandos no terminal, garantindo que está dentro da pasta do projeto (`brecho-online`).

- **`yarn dev`**: O comando que você vai usar todo dia. Ele liga o servidor local na sua máquina. Abra `http://localhost:3000` no navegador para ver o site funcionando. Ele atualiza sozinho quando você salva um arquivo!
- **`yarn commit`**: Esqueça o `git commit -m "fiz tal coisa"`. Use este comando! Ele abre um menu interativo bonitinho no terminal perguntando o que você fez (nova feature? correção? documentação?) e formata a mensagem no padrão perfeito exigido pela empresa.
- **`yarn build`**: Compila o projeto simulando o ambiente de produção. **Dica de ouro:** Rode isso na sua máquina antes de enviar o código pro GitHub (antes do PR). Se passar no build, significa que o TypeScript não encontrou erros graves e o site não vai quebrar no ar!
- **`yarn`** (sozinho): Instala pacotes novos. Se alguém da equipe avisar "adicionei uma biblioteca nova", rode esse comando para baixar o que falta na sua máquina.

---

## 🕵️ 2. Onde está o meu `console.log`? (O truque do Next.js)

Isso confunde **TODO MUNDO** no início do Next.js (App Router):

Se você colocar um `console.log('Teste!')` no seu código, para onde ele vai?

- Se o arquivo **não tiver** `'use client'` na primeira linha: O log vai aparecer na telinha preta do seu **Terminal do VS Code**. Por que? Porque ele rodou no Servidor (Node.js).
- Se o arquivo **tiver** `'use client'`: O log vai aparecer na aba `Console` da aba de Desenvolvedor (F12) do seu **Navegador** (Google Chrome).

---

## 🧹 3. Como eu "reseto" o Banco de Dados do Brechó?

Lembre-se: O nosso banco de dados é falso, ele mora na memória do seu navegador (`localStorage`).
Se você fizer uma bagunça nos dados, criar anúncios zumbis, ou esgotar todo o seu saldo de VAT e quiser começar do zero, faça isso:

1. Abra o seu site no Chrome (`localhost:3000`).
2. Aperte `F12` para abrir o DevTools.
3. Vá na aba **Application** (Aplicativo).
4. No menu esquerdo, abra **Local Storage** e clique em `http://localhost:3000`.
5. Apague tudo que tiver a chave começando com `@brecho:`.
6. Recarregue a página (F5). O nosso script (`seed.ts`) vai rodar de novo e repopular a loja para você zeradinha!

---

## 🔎 4. Dicas de VS Code

Para não perder tempo procurando arquivos numa arquitetura cheia de pastas igual o FSD:

- **Aperte `Ctrl + P` (ou `Cmd + P` no Mac):** Não fique abrindo pasta por pasta. Aperte esse atalho e digite o nome do arquivo, ex: `login-page`. Ele acha na hora.
- **Aperte `Ctrl + Shift + F`:** Buscar na Lupa. Se você não sabe onde um texto ou uma cor está no projeto inteiro, digite aqui e ele varre todos os arquivos.
- **Auto-Formatação (Prettier):** Você não precisa arrumar os espaços e quebras de linha manualmente. Configure seu VS Code para "Format on Save" (Formatar ao Salvar). Assim, toda vez que você apertar `Ctrl + S`, o código fica perfeitamente alinhado.

---

## 🛑 5. Resolvendo "Erros Vermelhos" no Terminal

O TypeScript pode gritar com você. Aqui está como não entrar em pânico:

1. **Leia o erro devagar.** Ele costuma dizer exatamente onde doeu: `Expected 2 arguments, but got 1`.
2. Se o erro for misterioso, veja se você importou a coisa certa. Com FSD, às vezes o VS Code tenta importar do arquivo profundo (`@features/anuncios/ui/anuncio-list`) em vez do raiz (`@features/anuncios`). Mude para o caminho mais curto e o erro deve sumir.
