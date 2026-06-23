// Vercel Serverless Function: приймає заявку з форми та надсилає її в Telegram.
// Секрети беруться зі змінних оточення (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — токен бота від @BotFather
//   TELEGRAM_CHAT_ID   — id чату/групи, куди надсилати заявки
// Токен НЕ зберігається в коді, щоб не потрапив у публічний репозиторій.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Значення за замовчуванням; за потреби перевизначаються змінними оточення на Vercel.
  // БЕЗПЕКА: токен зашитий у код для простоти запуску. Рекомендовано перенести його
  // у змінну оточення TELEGRAM_BOT_TOKEN і перевипустити токен через @BotFather.
  const token = process.env.TELEGRAM_BOT_TOKEN || '8698912799:AAHxLlzemfkCQrhGZ3R4J0W76oD8J4ohIio';
  const chatId = process.env.TELEGRAM_CHAT_ID || '8213847123';
  if (!token) {
    return res.status(500).json({ ok: false, error: 'TELEGRAM_BOT_TOKEN is not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const name = String(body.name || '').trim().slice(0, 100);
  const phone = String(body.phone || '').trim().slice(0, 40);
  const problem = String(body.problem || '').trim().slice(0, 1000);

  if (!name || phone.replace(/\D/g, '').length < 11) {
    return res.status(400).json({ ok: false, error: 'name and valid phone are required' });
  }

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const text =
    '🛠 <b>Нова заявка — виклик кур\'єра</b>\n\n' +
    '👤 Ім\'я: <b>' + esc(name) + '</b>\n' +
    '📞 Телефон: <b>' + esc(phone) + '</b>\n' +
    (problem ? '📝 Проблема: ' + esc(problem) + '\n' : '') +
    '\n🌐 Apple Service Харків';

  try {
    const tgRes = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const data = await tgRes.json();
    if (!data.ok) {
      return res.status(502).json({ ok: false, error: 'Telegram error', detail: data.description });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'Network error' });
  }
}
