// ~/portrait.txt — converte a foto (PNG com fundo transparente) em arte ASCII.

import sharp from 'sharp';
import { janela, escapar, CORES, ALTURA_BARRA } from './janela.mjs';

export const LARGURA_RETRATO = 380;
const CELULA_X = 4.4;
const CELULA_Y = 8;
const RAMPA = '.:-=+*cs%#@'; // do mais vazio ao mais cheio
const CINZA = [0xc9, 0xd1, 0xd9];

// Recorta as bordas transparentes para a pessoa ocupar o quadro todo.
async function recortarTransparencia(caminho) {
  const { data, info } = await sharp(caminho).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let [x1, y1, x2, y2] = [info.width, info.height, 0, 0];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 128) {
        x1 = Math.min(x1, x);
        y1 = Math.min(y1, y);
        x2 = Math.max(x2, x);
        y2 = Math.max(y2, y);
      }
    }
  }
  if (x2 < x1) throw new Error(`${caminho} está totalmente transparente.`);
  const area = { left: x1, top: y1, width: x2 - x1 + 1, height: y2 - y1 + 1 };
  return { imagem: sharp(caminho).ensureAlpha().extract(area), ...area };
}

const hex = (v) => Math.round(v / 17).toString(16);

export async function prepararRetrato({ foto, colunas = 70, contraste = 1.25, colorido = true }) {
  const { imagem, width, height } = await recortarTransparencia(foto);
  const linhas = Math.round(colunas * (height / width) * (CELULA_X / CELULA_Y));

  const data = await imagem.resize(colunas, linhas, { fit: 'fill' }).sharpen().raw().toBuffer();

  const luzDe = (i) => (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;

  // Estica o brilho da pessoa (ignorando o fundo) para usar a rampa inteira.
  const luzes = [];
  for (let i = 0; i < data.length; i += 4) if (data[i + 3] >= 128) luzes.push(luzDe(i));
  luzes.sort((a, b) => a - b);
  const minimo = luzes[Math.floor(luzes.length * 0.02)];
  const maximo = luzes[Math.floor(luzes.length * 0.98)];

  const grade = [];
  for (let y = 0; y < linhas; y++) {
    const linha = [];
    for (let x = 0; x < colunas; x++) {
      const i = (y * colunas + x) * 4;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a < 128) {
        linha.push({ ch: ' ', cor: null });
        continue;
      }
      const luz = (luzDe(i) - minimo) / (maximo - minimo || 1);
      const ajustada = Math.min(1, Math.max(0, (luz - 0.5) * contraste + 0.5));
      const ch = RAMPA[Math.round(ajustada * (RAMPA.length - 1))];
      // Mistura a cor da foto com cinza claro para continuar legível no fundo escuro.
      const cor = colorido
        ? `#${[r, g, b].map((v, k) => hex(v * 0.55 + CINZA[k] * 0.45)).join('')}`
        : CORES.texto;
      linha.push({ ch, cor });
    }
    grade.push(linha);
  }

  return { grade, alturaMinima: ALTURA_BARRA + linhas * CELULA_Y + 32 };
}

export function desenharRetrato({ grade }, altura) {
  const colunas = grade[0].length;
  const larguraTexto = colunas * CELULA_X;
  const x0 = (LARGURA_RETRATO - larguraTexto) / 2;
  // A arte fica "apoiada" na base do card, como um busto.
  const yBase = altura - 14 - grade.length * CELULA_Y;

  const linhas = grade.map((linha, y) => {
    const trechos = [];
    for (const { ch, cor } of linha) {
      const ultimo = trechos.at(-1);
      if (ultimo && (ultimo.cor === cor || ch === ' ')) ultimo.texto += ch;
      else trechos.push({ cor, texto: ch });
    }
    const tspans = trechos
      .map((t) => (t.cor ? `<tspan fill="${t.cor}">${escapar(t.texto)}</tspan>` : t.texto))
      .join('');
    return `<text x="${x0}" y="${yBase + (y + 1) * CELULA_Y}" textLength="${larguraTexto}" lengthAdjust="spacing">${tspans}</text>`;
  });

  return janela({
    largura: LARGURA_RETRATO,
    altura,
    titulo: '~/portrait.txt',
    estilo: `.arte text { font-size: 7.4px; white-space: pre; }`,
    conteudo: `<g class="arte" xml:space="preserve">\n${linhas.join('\n')}\n</g>`,
  });
}
