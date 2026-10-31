# Como funciona o README de perfil "terminal"

O GitHub mostra no seu perfil o `README.md` do repositório que tem **o mesmo nome do seu usuário** — no seu caso, [`thaynarlt/thaynarlt`](https://github.com/thaynarlt/thaynarlt).

O visual de terminal não é Markdown: são **três imagens SVG** geradas por script e coladas no README.

| Card | Arquivo | De onde vêm os dados |
|---|---|---|
| `~/contributions.sh` | `cards/contribuicoes.svg` | API GraphQL do GitHub (contribuições do último ano, sequência, melhor dia) |
| `~/portrait.txt` | `cards/retrato.svg` | `assets/foto.png` convertida em caracteres ASCII coloridos |
| `~/neofetch` | `cards/neofetch.svg` | lista de campos em `perfil.config.mjs` |

Uma **GitHub Action** (`.github/workflows/atualizar-perfil.yml`) roda todo dia às 06:00, gera os SVGs de novo e faz commit — por isso o mapa de contribuições fica sempre atualizado.

## Estrutura

```
perfil.config.mjs          ← o que você edita (textos, tema, foto)
assets/foto.png            ← sua foto SEM fundo (PNG transparente)
cards/*.svg                ← gerados automaticamente, não editar à mão
scripts/                   ← geradores (Node.js)
.github/workflows/         ← agendamento diário
README.md                  ← a página do perfil
```

## Publicar (passo a passo)

1. Copie todos os arquivos desta pasta para o repositório `thaynarlt/thaynarlt` (os banners `.png` que já estão lá podem ficar).
2. Faça commit e push para a branch `main`.
3. No GitHub, abra o repositório → aba **Actions** → **Atualizar cards do perfil** → **Run workflow**.
4. Espere ficar verde (✓) e abra [github.com/thaynarlt](https://github.com/thaynarlt).

Se o passo 3 falhar com erro de permissão no `git push`: **Settings → Actions → General → Workflow permissions → Read and write permissions → Save**, e rode de novo.

## Mudar alguma coisa

Tudo pode ser feito pelo próprio site do GitHub (ícone de lápis ✏️ no arquivo):

- **Textos do neofetch** → edite a lista `neofetch` em `perfil.config.mjs`. Cada linha é `['Rótulo', 'valor']`. Valores com mais de ~40 caracteres podem sair do card (o `npm run gerar` avisa).
- **Cor** → `tema: 'roxo'` ou `tema: 'verde'` (verde fica igual ao GitHub).
- **Foto** → remova o fundo em [remove.bg](https://www.remove.bg), Canva ou Adobe Express, baixe como PNG e substitua `assets/foto.png`. Fotos de rosto com boa luz e fundo removido ficam melhores.
- **Detalhe do retrato** → `colunas` (até ~82) e `contraste` em `retrato`. `colorido: false` deixa tudo numa cor só.

- **Sobre mim, stack, projetos, links e a frase digitando no topo** → são texto normal no `README.md`; edite direto lá (não precisa gerar nada).

Ao salvar `perfil.config.mjs` ou a foto na `main`, a Action roda sozinha e os cards são refeitos em ~1 minuto.

## Gerar no seu computador (opcional)

Precisa de Node.js e do GitHub CLI logado (`gh auth login`):

```bash
npm install
npm run gerar
```

## Observações

- O total de contribuições inclui repositórios privados porque a opção **Private contributions** está ligada no seu perfil (Contribution settings, acima do mapa). Se desligar, o card passa a contar só as públicas.
- O card "atualizado em" muda todo dia, então a Action faz um commit diário do `github-actions[bot]`. Esses commits **não** contam como contribuições suas.
- O GitHub pausa Actions agendadas em repositórios sem atividade por 60 dias; o commit diário evita isso.
