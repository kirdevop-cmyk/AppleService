import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * База знань AI-консультанта. Читає всі .md-файли з content/kb/ і конкатенує
 * їх в один текстовий блок із заголовками-розділювачами.
 *
 * Щоб змінити, що знає асистент — відредагуйте або додайте файли в content/kb/.
 * Розробник не потрібен. Результат кешується в памʼяті процесу.
 *
 * Порядок файлів фіксований (за наявності) для стабільності prompt-кешу;
 * будь-які інші .md додаються після, за абеткою.
 */

const KB_DIR = join(process.cwd(), 'content', 'kb');
const PREFERRED_ORDER = [
  'company.md',
  'brands.md',
  'services.md',
  'prices.md',
  'warranty.md',
  'faq.md',
  'districts.md',
];

let cached: string | null = null;

function orderedFiles(): string[] {
  let files: string[];
  try {
    files = readdirSync(KB_DIR).filter((f) => f.toLowerCase().endsWith('.md'));
  } catch {
    return [];
  }
  const rest = files.filter((f) => !PREFERRED_ORDER.includes(f)).sort();
  return [...PREFERRED_ORDER.filter((f) => files.includes(f)), ...rest];
}

export function getKnowledgeBaseText(): string {
  if (cached !== null) return cached;
  const parts = orderedFiles().map((file) => {
    try {
      return readFileSync(join(KB_DIR, file), 'utf8').trim();
    } catch {
      return '';
    }
  });
  cached = parts.filter(Boolean).join('\n\n---\n\n');
  return cached;
}
