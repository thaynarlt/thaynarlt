// ~/neofetch — cartão de apresentação no estilo do comando neofetch.

import { janela, escapar, CORES, ALTURA_BARRA } from './janela.mjs';

export const LARGURA_NEOFETCH = 480;
const X = 24;
const LINHA = 22;
const LARGURA_CARACTERE = 7.8; // 13px monoespaçada
const PALETA = ['#484f58', '#ff7b72', '#3fb950', '#d29922', '#58a6ff', '#bc8cff', '#39c5cf', '#f0f6fc'];

export function alturaNeofetch(campos) {
  return ALTURA_BARRA + 34 + (campos.length + 2) * LINHA + 34 + 64;
}

export function desenharNeofetch({ usuario, campos, tema, altura }) {
  const maiorRotulo = Math.max(...campos.map(([rotulo]) => rotulo.length));
  const xValor = X + (maiorRotulo + 2) * LARGURA_CARACTERE;
  const limite = Math.floor((LARGURA_NEOFETCH - X - xValor) / LARGURA_CARACTERE);

  const host = `<tspan fill="${tema.destaque}" font-weight="700">${escapar(usuario)}</tspan>@<tspan fill="${tema.destaque}" font-weight="700">github</tspan>`;
  let y = ALTURA_BARRA + 34;
  const partes = [
    `<text x="${X}" y="${y}" fill="${CORES.texto}">${host}</text>`,
    `<text x="${X}" y="${(y += LINHA)}" fill="${CORES.sutil}">${'-'.repeat(usuario.length + 7)}</text>`,
  ];

  for (const [rotulo, valor] of campos) {
    if (valor.length > limite) {
      console.warn(`neofetch: "${rotulo}" tem ${valor.length} caracteres; acima de ${limite} pode sair do card.`);
    }
    y += LINHA;
    partes.push(
      `<text x="${X}" y="${y}" fill="${tema.rotulo}" font-weight="700">${escapar(rotulo)}:</text>`,
      `<text x="${xValor}" y="${y}" fill="${CORES.texto}">${escapar(valor)}</text>`,
    );
  }

  y += 22;
  PALETA.forEach((cor, i) => {
    partes.push(`<rect x="${X + i * 26}" y="${y}" width="20" height="14" rx="3" fill="${cor}"/>`);
  });

  y += 14 + 40;
  partes.push(
    `<text x="${X}" y="${y}" fill="${CORES.texto}" xml:space="preserve">${host} <tspan fill="${tema.rotulo}">~</tspan> $ <tspan class="cursor" fill="${tema.destaque}">█</tspan></text>`,
  );

  return janela({
    largura: LARGURA_NEOFETCH,
    altura,
    titulo: '~/neofetch',
    estilo: `.nf text { font-size: 13px; }
  .cursor { animation: piscar 1.1s steps(1) infinite; }
  @keyframes piscar { 50% { opacity: 0; } }`,
    conteudo: `<g class="nf">\n${partes.join('\n')}\n</g>`,
  });
}
