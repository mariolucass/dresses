# 📚 Documentação do Desenvolvedor - Desapeguei

Bem-vindo(a) ao projeto! Sabemos que a arquitetura do projeto (Feature-Sliced Design) pode parecer intimidadora no início se você está acostumado com o Next.js tradicional (apenas a pasta `app/` e `components/`).

Criamos estes guias para ajudar você a se encontrar rapidamente na base de código e saber exatamente onde criar ou editar cada pedaço do sistema.

## Índice de Guias

1. [**Entendendo a Arquitetura (FSD)**](./01-arquitetura-fsd.md)
   _O que é a pasta `features`? Qual a diferença entre `views` e `app`? Aprenda como as peças se encaixam._

2. [**Manipulação de Dados e Estado**](./02-dados-e-estado.md)
   _Como salvar no "banco de dados" simulado via LocalStorage e como o Zustand gerencia estados globais._

3. [**Guia Prático: Onde colocar meu código?**](./03-guia-pratico.md)
   _Perguntas e respostas rápidas. Exemplo: "Preciso criar um botão novo, em qual pasta ele vai?"_

4. [**Armadilhas Comuns e Conceitos Web**](./04-armadilhas-comuns.md)
   _Erros de `'use client'`, TypeScript, Tailwind (`cn`), imports e o jeito diferente do Shadcn/UI funcionar._

5. [**Estilos, Animações e o Poder das Views**](./05-estilos-animacoes-e-views.md)
   _Por que usar `theme.ts` e `animation.ts`? Exemplo prático de como montar uma página inteira usando a pasta `views/`._

6. [**Fluxo de Trabalho com Git (Anti-Conflitos)**](./06-git-workflow.md)
   _Passo a passo de como criar branches, sincronizar com a `develop`, fazer Pull Requests e levar o código para a `main`._

7. [**Comandos e Dicas Úteis para Sobrevivência**](./07-comandos-e-dicas-uteis.md)
   _Comandos do Yarn, onde os `console.log` vão parar no Next.js, dicas de VS Code e como "resetar" o nosso banco de dados fake._

8. [**Padrões de Código e Boas Práticas (Code Style)**](./08-padroes-de-codigo.md)
   _Como nomear arquivos, porque não usamos `export default` e o que faz aquele arquivo `index.ts` mágico._

---

> **Regra de Ouro da Arquitetura FSD:**
> Uma camada superior pode importar de uma camada inferior. **NUNCA** o contrário.
>
> A ordem de cima para baixo é:
> `app` ➡️ `views` ➡️ `widgets` ➡️ `features` ➡️ `entities` ➡️ `shared`
