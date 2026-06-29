import { NextResponse } from 'next/server';
import { KNOWLEDGE } from '@/data/knowledge';

export const runtime = 'nodejs';

const MODEL = 'claude-opus-4-8';
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8698912799:AAHxLlzemfkCQrhGZ3R4J0W76oD8J4ohIio';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '8213847123';

const PERSONA = `Ти — Олександра, менеджер майстерні виїзного ремонту смартфонів «MobiDoctor» у Харкові.
Спілкуйся українською, тепло, впевнено й по-людськи. Головна перевага, яку підкреслюй: ремонт без черг, не виходячи з дому — кур'єр забере й привезе телефон.
Ніколи не називай майстерню «офіційною», «авторизованою» чи «сервісним центром Apple» і не обіцяй «оригінальні запчастини Apple» — кажи «якісні деталі: оригінал або копія на вибір».
Усі факти, ціни, відповіді, скрипти прогріву та відпрацювання заперечень бери з блоку «БАЗА ЗНАНЬ» нижче.

Мета:
1) Привітно проконсультувати, відповісти на питання, зняти сумніви, підкреслити переваги.
2) Делікатно підвести до заявки. Коли є інтерес — запитай ім'я та номер телефону для безкоштовного виїзду кур'єра.
3) Щойно маєш ім'я та телефон — обов'язково виклич інструмент save_lead, потім подякуй.

Правила: відповідай коротко (1–4 речення); не вигадуй цін понад наведені — пропонуй безкоштовну діагностику; відповідай лише фінальним повідомленням для клієнта.`;

const SYSTEM = PERSONA + '\n\n# БАЗА ЗНАНЬ\n' + KNOWLEDGE;

const TOOLS = [
  {
    name: 'save_lead',
    description: "Зберегти заявку та передати менеджеру в Telegram. Виклич, коли отримав ім'я та номер телефону.",
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

const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function sendLead(input: Record<string, unknown>) {
  if (!TG_TOKEN || !TG_CHAT) return false;
  const text =
    '🤖 <b>Заявка від AI-консультанта</b>\n\n' +
    `👤 Ім'я: <b>${esc(input.name)}</b>\n` +
    `📞 Телефон: <b>${esc(input.phone)}</b>\n` +
    (input.device ? `📱 Пристрій: ${esc(input.device)}\n` : '') +
    (input.problem ? `📝 Проблема: ${esc(input.problem)}\n` : '') +
    '\n🌐 MobiDoctor Харків';
  try {
    const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const d = await r.json();
    return !!d.ok;
  } catch {
    return false;
  }
}

type Msg = { role: string; content: unknown };

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 });

  let body: { messages?: Msg[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  let messages: Msg[] = history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && (m.content as string).trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: (m.content as string).slice(0, 2000) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (messages.length === 0) return NextResponse.json({ error: 'empty conversation' }, { status: 400 });

  let leadSaved = false;

  try {
    for (let i = 0; i < 4; i++) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 700,
          system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
          tools: TOOLS,
          messages,
        }),
      });
      const data = await r.json();
      if (!r.ok) return NextResponse.json({ error: 'anthropic_error', detail: data?.error ?? data }, { status: 502 });

      if (data.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: data.content });
        const results: unknown[] = [];
        for (const block of data.content || []) {
          if (block.type === 'tool_use' && block.name === 'save_lead') {
            const ok = await sendLead(block.input || {});
            if (ok) leadSaved = true;
            results.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: ok ? 'Заявку успішно передано менеджеру.' : 'Не вдалося передати — попроси клієнта зателефонувати 073 666 18 36.',
            });
          }
        }
        messages.push({ role: 'user', content: results });
        continue;
      }

      const reply = (data.content || [])
        .filter((b: { type: string }) => b.type === 'text')
        .map((b: { text: string }) => b.text)
        .join('\n')
        .trim();
      return NextResponse.json({ reply: reply || 'Вибачте, не зовсім зрозуміла. Можете уточнити?', leadSaved });
    }
    return NextResponse.json({ reply: 'Дякую! Для швидкого оформлення зателефонуйте, будь ласка, 073 666 18 36.', leadSaved });
  } catch {
    return NextResponse.json({ error: 'network_error' }, { status: 502 });
  }
}
