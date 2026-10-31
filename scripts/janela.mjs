// Moldura de "janela de terminal" usada pelos três cards.

export const FONTE =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

export const CORES = {
  fundo: '#0d1117',
  borda: '#30363d',
  texto: '#c9d1d9',
  apagado: '#8b949e',
  sutil: '#6e7681',
};

export const TEMAS = {
  verde: {
    niveis: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    destaque: '#3fb950',
    rotulo: '#58a6ff',
  },
  roxo: {
    niveis: ['#161b22', '#2e1a52', '#4c2889', '#7a45d1', '#b48aff'],
    destaque: '#b48aff',
    rotulo: '#d2a8ff',
  },
};

export const ALTURA_BARRA = 32;

export function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function janela({ largura, altura, titulo, estilo = '', conteudo }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="${escapar(titulo)}">
<style>
  text { font-family: ${FONTE}; }
  ${estilo}
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
<rect x="0.5" y="0.5" width="${largura - 1}" height="${altura - 1}" rx="10" fill="${CORES.fundo}" stroke="${CORES.borda}"/>
<circle cx="18" cy="16" r="5.5" fill="#ff5f56"/>
<circle cx="36" cy="16" r="5.5" fill="#ffbd2e"/>
<circle cx="54" cy="16" r="5.5" fill="#27c93f"/>
<text x="${largura / 2}" y="20" text-anchor="middle" font-size="12" fill="${CORES.apagado}">${escapar(titulo)}</text>
<line x1="1" y1="${ALTURA_BARRA}" x2="${largura - 1}" y2="${ALTURA_BARRA}" stroke="${CORES.borda}"/>
${conteudo}
</svg>
`;
}
