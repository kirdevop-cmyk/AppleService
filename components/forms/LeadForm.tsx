'use client';

import { useState } from 'react';
import Link from 'next/link';

function pushEvent(name: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...params });
}

function maskPhone(v: string) {
  let d = v.replace(/\D/g, '');
  if (d.startsWith('380')) d = d.slice(3);
  d = d.slice(0, 9);
  let out = '+38 0';
  if (d.length > 0) out += d.slice(0, 2);
  if (d.length >= 3) out += ' ' + d.slice(2, 5);
  if (d.length >= 6) out += ' ' + d.slice(5, 7);
  if (d.length >= 8) out += ' ' + d.slice(7, 9);
  return out;
}

export function LeadForm({ onDone, compact = false }: { onDone?: () => void; compact?: boolean }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 11) {
      setState('err');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          problem: problem.trim(),
          company, // honeypot — порожнє для людей
          source: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error('fail');
      pushEvent('generate_lead', { method: 'form' });
      setState('ok');
    } catch {
      setState('err');
    }
  }

  if (state === 'ok') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-green-400 to-cyan-400 text-2xl text-[#0c0c0b]">
          ✓
        </div>
        <h3 className="mb-2 text-2xl font-medium grad-text">Дякуємо!</h3>
        <p className="mb-5 text-ash">Ваша заявка прийнята. Ми передзвонимо найближчим часом.</p>
        {onDone && (
          <button className="btn btn-ghost" onClick={onDone}>
            Закрити
          </button>
        )}
      </div>
    );
  }

  const input =
    'w-full rounded-3xl border border-graphite bg-void px-4 py-3 text-[15px] text-white outline-none focus:border-accent focus:ring-2 focus:ring-bone/40';

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5" noValidate>
      <input className="hidden" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} aria-hidden />
      <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-ash">
        Ваше ім’я
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім’я" autoComplete="name" required />
      </label>
      <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-ash">
        Телефон
        <input
          className={input}
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          placeholder="+38 0__ ___ __ __"
          inputMode="tel"
          autoComplete="tel"
          required
        />
      </label>
      {!compact && (
        <label className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-ash">
          Що з пристроєм? <span className="lowercase tracking-normal text-smoke">(необов’язково)</span>
          <textarea className={input} rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Напр.: iPhone 13, розбитий екран" />
        </label>
      )}
      <button type="submit" className="btn btn-accent btn-lg w-full" disabled={state === 'sending'}>
        {state === 'sending' ? 'Надсилаємо…' : 'Залишити заявку'}
      </button>
      {state === 'err' && (
        <p className="text-center text-xs text-accent-4">
          Перевірте ім’я й телефон або зателефонуйте: 073 666 18 36
        </p>
      )}
      <p className="text-center font-mono text-[11px] text-ash">
        Натискаючи кнопку, ви погоджуєтесь на обробку даних згідно з{' '}
        <Link href="/polityka-konfidentsiynosti" className="underline decoration-smoke">
          політикою конфіденційності
        </Link>
        .
      </p>
    </form>
  );
}
