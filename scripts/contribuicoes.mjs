// ~/contributions.sh — mapa de contribuições do último ano, via API GraphQL do GitHub.

import { execSync } from 'node:child_process';
import { janela, CORES } from './janela.mjs';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const NIVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const LARGURA = 860;
const PASSO = 14; // célula (11) + espaço (3)
const CELULA = 11;
const LARGURA_DIAS = 32;

function token() {
  const doAmbiente = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (doAmbiente) return doAmbiente;
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim();
  } catch {
    throw new Error('Sem token: defina GITHUB_TOKEN ou faça login com `gh auth login`.');
  }
}

export async function buscarCalendario(usuario) {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date weekday contributionCount contributionLevel } }
        }
      }
    }
  }`;
  const resposta = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: usuario } }),
  });
  const json = await resposta.json();
  if (!resposta.ok || json.errors) {
    throw new Error(`API do GitHub: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.data.user.contributionsCollection.contributionCalendar;
}

function estatisticas(semanas) {
  const dias = semanas.flatMap((s) => s.contributionDays);

  let maior = 0;
  let corrida = 0;
  let melhor = dias[0];
  for (const dia of dias) {
    corrida = dia.contributionCount > 0 ? corrida + 1 : 0;
    maior = Math.max(maior, corrida);
    if (dia.contributionCount > melhor.contributionCount) melhor = dia;
  }

  // A sequência atual não quebra só porque hoje ainda não teve contribuição.
  let i = dias.length - 1;
  if (dias[i].contributionCount === 0) i--;
  let atual = 0;
  while (i >= 0 && dias[i].contributionCount > 0) {
    atual++;
    i--;
  }

  return { atual, maior, melhor };
}

function rotulosDosMeses(semanas, x0) {
  const rotulos = [];
  let mesAnterior = null;
  semanas.forEach((semana, i) => {
    const mes = Number(semana.contributionDays[0].date.slice(5, 7)) - 1;
    if (mes === mesAnterior) return;
    mesAnterior = mes;
    const ultimo = rotulos.at(-1);
    if (ultimo && i - ultimo.semana < 3) rotulos.pop(); // evita rótulos encavalados
    if (i < semanas.length - 2) rotulos.push({ semana: i, texto: MESES[mes] });
  });
  return rotulos.map(
    (r) => `<text x="${x0 + r.semana * PASSO}" y="58" font-size="11" fill="${CORES.apagado}">${r.texto}</text>`,
  );
}

function hojeFormatado() {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Recife' }).format(new Date());
}

export function desenharContribuicoes(calendario, tema) {
  const semanas = calendario.weeks;
  const larguraGrade = semanas.length * PASSO - (PASSO - CELULA);
  const margem = (LARGURA - (LARGURA_DIAS + larguraGrade)) / 2;
  const x0 = margem + LARGURA_DIAS;
  const y0 = 68;
  const fimGrade = x0 + larguraGrade;

  const colunas = semanas.map((semana, i) => {
    const celulas = semana.contributionDays.map((dia) => {
      const cor = tema.niveis[NIVEL[dia.contributionLevel]];
      const titulo = `${dia.contributionCount} em ${dia.date.split('-').reverse().join('/')}`;
      return `<rect x="${x0 + i * PASSO}" y="${y0 + dia.weekday * PASSO}" width="${CELULA}" height="${CELULA}" rx="2" fill="${cor}"><title>${titulo}</title></rect>`;
    });
    return `<g class="s" style="animation-delay:${i * 14}ms">${celulas.join('')}</g>`;
  });

  const dias = [
    [1, 'Seg'],
    [3, 'Qua'],
    [5, 'Sex'],
  ].map(
    ([d, nome]) =>
      `<text x="${margem}" y="${y0 + d * PASSO + 9}" font-size="11" fill="${CORES.apagado}">${nome}</text>`,
  );

  const { atual, maior, melhor } = estatisticas(semanas);
  const [, mesMelhor, diaMelhor] = melhor.date.split('-');
  const n = (valor) => `<tspan fill="${tema.destaque}" font-weight="600">${valor}</tspan>`;
  const rodape = `<text x="${margem}" y="192" font-size="12" fill="${CORES.texto}" xml:space="preserve">${n(
    calendario.totalContributions.toLocaleString('pt-BR'),
  )} contribuições no último ano · sequência ${n(`${atual}d`)} · maior ${n(`${maior}d`)} · melhor dia ${n(
    melhor.contributionCount,
  )} <tspan fill="${CORES.sutil}">(${Number(diaMelhor)} ${MESES[Number(mesMelhor) - 1].toLowerCase()})</tspan></text>`;

  const xLegenda = fimGrade - 34 - 5 * PASSO;
  const legenda = [
    `<text x="${xLegenda - 6}" y="192" font-size="10" fill="${CORES.sutil}" text-anchor="end">Menos</text>`,
    ...tema.niveis.map(
      (cor, i) => `<rect x="${xLegenda + i * PASSO}" y="182" width="${CELULA}" height="${CELULA}" rx="2" fill="${cor}"/>`,
    ),
    `<text x="${xLegenda + 5 * PASSO + 3}" y="192" font-size="10" fill="${CORES.sutil}">Mais</text>`,
  ];

  const atualizado = `<text x="${fimGrade}" y="214" font-size="10" fill="${CORES.sutil}" text-anchor="end">atualizado em ${hojeFormatado()}</text>`;

  return janela({
    largura: LARGURA,
    altura: 232,
    titulo: '~/contributions.sh',
    estilo: `.s { animation: surgir .5s ease-out backwards; }
  @keyframes surgir { from { opacity: 0; } }`,
    conteudo: [...rotulosDosMeses(semanas, x0), ...dias, ...colunas, rodape, ...legenda, atualizado].join('\n'),
  });
}
