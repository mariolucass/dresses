# 6. Fluxo de Trabalho com Git (Evitando Conflitos)

Trabalhar em equipe exige organização para que o código de uma pessoa não atropele o da outra. Neste projeto, utilizamos a estratégia baseada em **Git Flow simplificado**, com duas branches principais:

- `main`: Código de produção (versão estável que está no ar).
- `develop`: Código de homologação (onde todas as novas features se encontram primeiro).

Nenhum desenvolvedor deve commitar diretamente na `main` ou na `develop`. Tudo é feito em **branches temporárias** que nascem da `develop`.

---

## 🚀 Passo a Passo Ideal do Dia a Dia

### 1. Atualize sua máquina ANTES de começar

A causa número 1 de conflitos é começar a programar em cima de um código antigo. Sempre atualize sua `develop` antes de criar uma branch.

```bash
git checkout develop
git pull origin develop
```

### 2. Crie uma branch descritiva

Sempre crie sua branch a partir da `develop`. Use prefixos claros para que todos saibam o que você está fazendo:

- `feat/`: Para novas funcionalidades (ex: `feat/anuncios-list`)
- `fix/`: Para correção de bugs (ex: `fix/header-avatar`)
- `chore/`: Para tarefas técnicas/configurações (ex: `chore/update-readme`)

```bash
git checkout -b feat/anuncios-list
```

### 3. Salve seu trabalho aos poucos (Commits Pequenos)

Não espere o dia inteiro para fazer um commit gigante. Fez o header? Commita. Terminou os filtros? Commita.
Como usamos `Conventional Commits`, sempre use o wizard interativo:

```bash
git add .
yarn commit
```

_O `yarn commit` vai te perguntar se é um `feat`, `fix`, etc., e pedir um título. Isso mantém o histórico de código lindo e legível!_

### 4. A Regra de Ouro anti-conflito: Sincronize com a `develop` frequentemente

Imagine que você está há 2 dias trabalhando na sua branch. Nesse meio tempo, seus colegas já mandaram várias coisas novas para a `develop`. Se você demorar muito, quando for juntar tudo, vai dar um conflito gigantesco.

Sempre que puder, puxe as novidades da `develop` para dentro da sua branch:

```bash
# Baixa as novidades do servidor, mas não aplica ainda
git fetch origin

# Junta o que seus colegas fizeram na sua branch atual
git merge origin/develop
```

Se der conflito aqui, será um conflito pequeno e fácil de resolver. Resolva no seu VS Code, adicione os arquivos e faça o commit.

### 5. Envie para o GitHub (Push)

Quando terminar a sua feature, envie a sua branch para o repositório remoto:

```bash
git push -u origin feat/anuncios-list
```

### 6. Abra um Pull Request (PR) para a `develop`

Vá no GitHub e abra um Pull Request da sua branch `feat/anuncios-list` apontando para a branch base **`develop`** (NÃO para a main).

1. Adicione um título claro.
2. Descreva o que você fez.
3. Peça para um colega revisar (Code Review).
4. Após aprovado, clique em **Merge**.
5. _Opcional, mas recomendado:_ Delete sua branch após o merge para manter o repositório limpo.

---

## 🚢 Indo para Produção (O merge para a `main`)

A branch `main` é sagrada. O processo de enviar as novidades para ela é chamado de **Release**.

Isso geralmente é feito pelo Líder Técnico ou quando a equipe decide que a `develop` está estável e testada o suficiente para ir para o ar.

1. Abre-se um PR de **`develop`** apontando para **`main`**.
2. O time inteiro revisa se tudo que estava em homologação pode ir para produção.
3. Faz-se o Merge.
4. (Opcional) Cria-se uma "Tag" ou "Release" no GitHub com as notas da versão (ex: `v1.0.0`).

---

## 🚨 O que fazer se der conflito enorme?

Se o VS Code ficar cheio de marcações `<<<<<<< HEAD` e você entrar em pânico:

1. **Não chute:** Não saia apagando código sem entender.
2. **Fale com o colega:** Veja quem escreveu o código conflitante pelo `Git Lens` (ou `git blame`) e chame-o numa call rápida. "Ei, você mudou o Header e eu também, qual versão queremos manter?"
3. **Use o Merge Editor do VS Code:** No painel lateral do Git no VS Code, ele mostra os conflitos de forma visual e permite clicar em "Accept Current Change", "Accept Incoming Change" ou "Accept Both".
4. Se quiser desistir e voltar ao estado antes de tentar fazer o merge:
   ```bash
   git merge --abort
   ```
