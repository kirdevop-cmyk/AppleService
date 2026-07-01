import Anthropic from '@anthropic-ai/sdk';
import { getKnowledgeBaseText } from '@/lib/knowledge-base';
import { sendLeadNotification } from '@/lib/notifications';
import { rateLimit } from '@/lib/ratelimit';
import { ruleReply } from '@/lib/assistant';

export const runtime = 'nodejs';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Модель легко змінити тут (ТЗ: швидка й дешева для чат-консультанта).
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 800;

// Роздільник для метадану в кінці потоку (не зустрічається у звичайному тексті).
const META = '';

const PERSONA = `Ти — Олександра, менеджер майстерні виїзного обслуговування смартфонів «MobiDoctor» у Харкові.
Спілкуйся українською, тепло, впевнено й по-людськи, короткими реченнями (1–4). Головна перевага, яку підкреслюй: обслуговування без черг, не виходячи з дому — кур'єр забере й привезе телефон.
Ніколи не називай майстерню «офіційною», «авторизованою» чи «сервісним центром Apple» і не обіцяй «оригінальні запчастини Apple» — кажи «якісні деталі: оригінал або копія на вибір».
Усі факти, ціни та відповіді бери з блоку «БАЗА ЗНАНЬ» нижче. Не вигадуй цін понад наведені — пропонуй безкоштовну діагностику. Якщо не знаєш точної відповіді — чесно скажи і запропонуй зателефонувати 073 666 18 36. Допомагай лише з обслуговуванням смартфонів; на інші теми (ноутбуки, побутова техніка тощо) ввічливо відмов і запропонуй дзвінок.

Мета:
1) Привітно проконсультувати, відповісти на питання, зняти сумніви, підкреслити переваги.
2) Делікатно підвести до заявки. Коли є інтерес — запитай ім'я та номер телефону для безкоштовного виїзду кур'єра.
3) Щойно маєш ім'я та телефон — обов'язково виклич інструмент save_lead, потім коротко подякуй і скажи, що менеджер передзвонить.`;

const SYSTEM = PERSONA + '\n\n# БАЗА ЗНАНЬ\n' + getKnowledgeBaseText();

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'save_lead',
    description: "Зберегти заявку й передати менеджеру. Виклич, коли отримав ім'я та номер телефону клієнта.",
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Ім'я клієнта" },
        phone: { type: 'string', description: 'Номер телефону' },
        device: { type: 'string', description: 'Модель пристрою, якщо відома' },
        problem: { type: 'string', description: 'Опис проблеми, якщо відомий' },
      },
      required: ['name', 'phone'],
    },
  },
];

type InMsg = { role?: string; content?: unknown };

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || 'anon';
}

const FAIL = 'Вибачте, стався збій зв’язку. Зателефонуйте, будь ласка: 073 666 18 36 — ми на зв’язку щодня 09:00–21:00.';

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!rateLimit(clientIp(req)).ok) {
    return new Response('Забагато повідомлень. Зробіть невелику паузу або зателефонуйте 073 666 18 36.', {
      status: 429,
    });
  }

  let body: { messages?: InMsg[] } = {};
  try {
    body = await req.json();
  } catch {
    return new Response('bad json', { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const messages: Anthropic.MessageParam[] = history
    .filter(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && (m.content as string).trim(),
    )
    .slice(-20)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: (m.content as string).slice(0, 2000) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (messages.length === 0) return new Response('empty conversation', { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (s: string) => controller.enqueue(encoder.encode(s));
      let leadSaved = false;
      let telegram = false;

      try {
        if (!apiKey) {
          // Безключовий режим: «жива» скриптова Олександра з бази знань.
          const lastUser = [...messages].reverse().find((m) => m.role === 'user');
          const text = typeof lastUser?.content === 'string' ? lastUser.content : '';
          const r = ruleReply(text);
          telegram = r.telegram;
          // стрімимо по словах — щоб виглядало як живий набір
          for (const w of r.reply.split(/(\s+)/)) {
            send(w);
            if (w.trim()) await sleep(24);
          }
        } else {
          const client = new Anthropic({ apiKey });
          const lastUserText = [...messages].reverse().find(
            (m) => m.role === 'user' && typeof m.content === 'string',
          )?.content as string | undefined;
          for (let i = 0; i < 4; i++) {
            const turn = client.messages.stream({
              model: MODEL,
              max_tokens: MAX_TOKENS,
              system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
              tools: TOOLS,
              messages,
            });

            turn.on('text', (delta) => send(delta));
            const msg = await turn.finalMessage();

            if (msg.stop_reason === 'tool_use') {
              messages.push({ role: 'assistant', content: msg.content as unknown as Anthropic.ContentBlockParam[] });
              const results: Anthropic.ToolResultBlockParam[] = [];
              for (const block of msg.content) {
                if (block.type === 'tool_use' && block.name === 'save_lead') {
                  const input = (block.input ?? {}) as Record<string, string>;
                  const ok = await sendLeadNotification({
                    name: input.name,
                    phone: input.phone,
                    device: input.device,
                    issue: input.problem,
                  });
                  if (ok) leadSaved = true;
                  results.push({
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: ok
                      ? 'Заявку успішно передано менеджеру.'
                      : 'Не вдалося передати — попроси клієнта зателефонувати 073 666 18 36.',
                  });
                }
              }
              messages.push({ role: 'user', content: results });
              continue;
            }

            break;
          }
          // На етапі ціни/замовлення (і коли лід ще не оформлено) — підказати Telegram
          if (!leadSaved && lastUserText && ruleReply(lastUserText).telegram) telegram = true;
        }
      } catch {
        send(FAIL);
      } finally {
        send(META + JSON.stringify({ leadSaved, telegram }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
