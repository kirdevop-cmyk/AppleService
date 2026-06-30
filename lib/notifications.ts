/**
 * Доставка лідів власнику. Канал — Telegram (основний), з опційним дублем на email
 * через Resend. Викликається з серверних route-handlers — ключі ніколи не
 * потрапляють у клієнтський бандл.
 */

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8698912799:AAHxLlzemfkCQrhGZ3R4J0W76oD8J4ohIio';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '8213847123';

export interface Lead {
  name?: string;
  phone: string;
  issue?: string;
  device?: string;
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function sendTelegram(text: string): Promise<boolean> {
  if (!TG_TOKEN || !TG_CHAT) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const d = await r.json().catch(() => ({}));
    return !!d.ok;
  } catch {
    return false;
  }
}

async function sendEmail(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO || process.env.NOTIFY_EMAIL_TO;
  if (!key || !to) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'MobiDoctor <onboarding@resend.dev>', to, subject, text }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Відправляє лід власнику. Повертає true, якщо хоча б один канал спрацював.
 * ПДн (телефон) використовуються лише для передачі заявки й не логуються.
 */
export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  const text =
    '🤖 <b>Заявка від AI-консультанта</b>\n\n' +
    (lead.name ? `👤 Ім'я: <b>${esc(lead.name)}</b>\n` : '') +
    `📞 Телефон: <b>${esc(lead.phone)}</b>\n` +
    (lead.device ? `📱 Пристрій: ${esc(lead.device)}\n` : '') +
    (lead.issue ? `📝 Проблема: ${esc(lead.issue)}\n` : '') +
    '\n🌐 MobiDoctor Харків';

  const tg = await sendTelegram(text);
  const mail = await sendEmail('MobiDoctor — заявка від AI-консультанта', text.replace(/<[^>]+>/g, ''));
  return tg || mail;
}
