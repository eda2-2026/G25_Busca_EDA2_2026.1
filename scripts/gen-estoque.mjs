import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../src/app/data');
fs.mkdirSync(root, { recursive: true });
const lines = fs.readFileSync(path.join(__dirname, '../../farmacia_busca_binaria.ts'), 'utf8').split(/\r?\n/);
let body = lines.slice(57, 259).join('\n');
body = body.replace(
  'const estoqueMedicamentos: Medicamento[]',
  'export const ESTOQUE_MEDICAMENTOS_ORDENADO: Medicamento[]',
);
const out =
  "import type { Medicamento } from '../models/farmacia.models';\n\n" + body + '\n';
fs.writeFileSync(path.join(root, 'estoque-medicamentos.ts'), out);
console.log('Wrote estoque-medicamentos.ts');
