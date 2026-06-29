import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8698912799:AAHxLlzemfkCQrhGZ3R4J0W76oD8J4ohIio';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '8213847123';

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function sendTelegram(text: string) {
  if (!TG_TOKEN || !TG_CHAT) return false;
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

async function sendEmail(subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
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

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  // honeypot — заповнене поле = бот
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? '').trim().slice(0, 100);
  const phone = String(body.phone ?? '').trim().slice(0, 40);
  const problem = String(body.problem ?? '').trim().slice(0, 1000);
  const source = String(body.source ?? '').trim().slice(0, 200);

  if (!name || phone.replace(/\D/g, '').length < 11) {
    return NextResponse.json({ ok: false, error: 'name and valid phone required' }, { status: 400 });
  }

  const text =
    '🛠 <b>Нова заявка — виклик кур’єра</b>\n\n' +
    `👤 Ім’я: <b>${esc(name)}</b>\n` +
    `📞 Телефон: <b>${esc(phone)}</b>\n` +
    (problem ? `📝 Проблема: ${esc(problem)}\n` : '') +
    (source ? `🔗 Сторінка: ${esc(source)}\n` : '') +
    '\n🌐 MobiDoctor Харків';

  const tg = await sendTelegram(text);
  await sendEmail('MobiDoctor — нова заявка', text.replace(/<[^>]+>/g, ''));

  if (!tg) {
    return NextResponse.json({ ok: false, error: 'delivery failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
