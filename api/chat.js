// Vercel Serverless Function: онлайн AI-консультант (топ-менеджер) на базі Claude.
// Веде діалог із відвідувачем, «прогріває» та приймає заявку через інструмент save_lead,
// який пересилає її в Telegram (як і /api/lead).
//
// Змінні оточення (Vercel → Settings → Environment Variables):
//   ANTHROPIC_API_KEY  — ключ Anthropic API (обов'язково; у код НЕ зашивається)
//   TELEGRAM_BOT_TOKEN — токен бота (для пересилання заявок)
//   TELEGRAM_CHAT_ID   — id чату отримувача (необов'язково; є значення за замовчуванням)

import { KNOWLEDGE } from '../lib/knowledge.js';

const MODEL = 'claude-opus-4-8';

const PERSONA = `Ти — Олександра, менеджер майстерні виїзного ремонту смартфонів «MobiDoctor» у Харкові.
Головна перевага, яку підкреслюй: ремонт без черг, не виходячи з дому — кур'єр забере й привезе телефон.
Ніколи не називай майстерню «офіційною», «авторизованою» чи «сервісним центром Apple» і не обіцяй «оригінальні запчастини Apple» — кажи «якісні деталі: оригінал або копія на вибір».
Спілкуйся українською, тепло, впевнено та по-людськи, як найкращий менеджер з продажу й турботи про клієнта.
Усі факти, ціни, відповіді на питання, скрипти прогріву та відпрацювання заперечень бери з блоку «БАЗА ЗНАНЬ» нижче.

Твоя мета:
1) Привітно проконсультувати, відповісти на питання, зняти сумніви та підкреслити переваги (виїзд кур'єра, гарантія, швидкість).
2) Делікатно підвести клієнта до заявки. Коли відчуваєш інтерес — запитай ім'я та номер телефону, щоб менеджер передзвонив і узгодив виїзд кур'єра.
3) Щойно отримаєш ім'я та телефон — обов'язково виклич інструмент save_lead, щоб передати заявку. Після цього подякуй і скажи, що передзвонимо найближчим часом.

Правила:
- Відповідай коротко: 1–4 речення, без «води».
- Не вигадуй точних цін чи строків понад наведені — для точності пропонуй безкоштовну діагностику.
- Не проси зайвих даних: достатньо імені, телефону та (якщо клієнт сказав) моделі й суті поломки.
- Відповідай лише фінальним повідомленням для клієнта, без службових міркувань.`;

const SYSTEM_PROMPT = PERSONA + '\n\n# БАЗА ЗНАНЬ\n' + KNOWLEDGE;

const TOOLS = [
  {
    name: 'save_lead',
    description:
      "Зберегти заявку клієнта та передати її менеджеру в Telegram. Виклич, коли отримав ім'я та номер телефону клієнта.",
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Ім'я клієнта" },
        phone: { type: 'string', description: 'Номер телефону клієнта' },
        device: { type: 'string', description: 'Модель пристрою, якщо відома' },
        problem: { type: 'string', description: 'Опис проблеми, якщо відомий' }
      },
      required: ['name', 'phone']
    }
  }
];

async function sendLeadToTelegram(input) {
  const token = process.env.TELEGRAM_BOT_TOKEN || '8698912799:AAHxLlzemfkCQrhGZ3R4J0W76oD8J4ohIio';
  const chatId = process.env.TELEGRAM_CHAT_ID || '8213847123';
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const text =
    '🤖 <b>Заявка від AI-консультанта</b>\n\n' +
    '👤 Ім\'я: <b>' + esc(input.name) + '</b>\n' +
    '📞 Телефон: <b>' + esc(input.phone) + '</b>\n' +
    (input.device ? '📱 Пристрій: ' + esc(input.device) + '\n' : '') +
    (input.problem ? '📝 Проблема: ' + esc(input.problem) + '\n' : '') +
    '\n🌐 Apple Service Харків';
  try {
    const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const data = await r.json();
    return !!data.ok;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  // Історія діалогу з клієнта: лише текстові репліки user/assistant.
  const history = Array.isArray(body.messages) ? body.messages : [];
  let messages = history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  // Розмова має починатися з user.
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (messages.length === 0) {
    return res.status(400).json({ error: 'empty conversation' });
  }

  let leadSaved = false;

  try {
    for (let i = 0; i < 4; i++) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 700,
          system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
          tools: TOOLS,
          messages
        })
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(502).json({ error: 'anthropic_error', detail: data && data.error ? data.error : data });
      }

      if (data.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: data.content });
        const toolResults = [];
        for (const block of data.content || []) {
          if (block.type === 'tool_use' && block.name === 'save_lead') {
            const ok = await sendLeadToTelegram(block.input || {});
            if (ok) leadSaved = true;
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: ok
                ? 'Заявку успішно передано менеджеру.'
                : 'Не вдалося передати заявку — попроси клієнта зателефонувати 073 666 18 36.'
            });
          }
        }
        messages.push({ role: 'user', content: toolResults });
        continue;
      }

      // end_turn — фінальна відповідь
      const reply = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim();
      return res.status(200).json({ reply: reply || 'Вибачте, не зовсім зрозуміла. Можете уточнити?', leadSaved });
    }

    return res.status(200).json({
      reply: 'Дякую! Для швидкого оформлення зателефонуйте, будь ласка, 073 666 18 36.',
      leadSaved
    });
  } catch (e) {
    return res.status(502).json({ error: 'network_error' });
  }
}
