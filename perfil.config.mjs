// Tudo o que aparece nos cards sai daqui. Edite, rode `npm run gerar` e faça commit.

export default {
  usuario: 'thaynarlt',

  // Cor de destaque dos cards: 'roxo' ou 'verde'
  tema: 'roxo',

  // ~/neofetch — cada linha vira "Rótulo:  valor"
  neofetch: [
    ['Nome', 'Thayná Tolentino'],
    ['Função', 'UX/UI Designer & Front-End Dev'],
    ['Foco', 'Interfaces acessíveis e responsivas'],
    ['Linguagens', 'TypeScript, JavaScript, Java, Python'],
    ['Front-end', 'React, Next.js, TailwindCSS'],
    ['Back-end', 'Node.js, Supabase, PostgreSQL'],
    ['Design', 'Figma, Adobe CC, edição de vídeo'],
    ['Segurança', 'Cibersegurança (estudos e prática)'],
    ['Estudando', 'Node.js, arquitetura front-end'],
    ['Local', 'João Pessoa, PB'],
    ['Portfólio', 'thaynarlt.com.br'],
    ['LinkedIn', 'linkedin.com/in/thaynarlt'],
  ],

  // ~/portrait.txt — foto com fundo removido (PNG transparente)
  retrato: {
    foto: 'assets/foto.png',
    colunas: 80, // mais colunas = mais detalhe (máx. ~82 para caber no card)
    contraste: 1.1,
    colorido: true, // false = caracteres numa cor só
  },
};
