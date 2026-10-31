// Gera os três cards em cards/. Uso: npm run gerar

import { mkdir, writeFile } from 'node:fs/promises';
import config from '../perfil.config.mjs';
import { TEMAS } from './janela.mjs';
import { buscarCalendario, desenharContribuicoes } from './contribuicoes.mjs';
import { prepararRetrato, desenharRetrato } from './retrato.mjs';
import { alturaNeofetch, desenharNeofetch } from './neofetch.mjs';

const tema = TEMAS[config.tema];
if (!tema) throw new Error(`Tema "${config.tema}" não existe. Use: ${Object.keys(TEMAS).join(', ')}`);

await mkdir('cards', { recursive: true });

const calendario = await buscarCalendario(config.usuario);
await writeFile('cards/contribuicoes.svg', desenharContribuicoes(calendario, tema));
console.log(`contribuicoes.svg — ${calendario.totalContributions} contribuições`);

// Retrato e neofetch ficam lado a lado, então os dois recebem a mesma altura.
const retrato = await prepararRetrato(config.retrato);
const altura = Math.max(retrato.alturaMinima, alturaNeofetch(config.neofetch));
await writeFile('cards/retrato.svg', desenharRetrato(retrato, altura));
await writeFile(
  'cards/neofetch.svg',
  desenharNeofetch({ usuario: config.usuario, campos: config.neofetch, tema, altura }),
);
console.log(`retrato.svg + neofetch.svg — ${altura}px de altura`);
