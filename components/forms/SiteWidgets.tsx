'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { LeadForm } from '@/components/forms/LeadForm';
import { openLeadModal } from '@/components/ui/CourierButton';

type Msg = { role: 'user' | 'assistant'; content: string };

const QUICK = ['Розбитий екран iPhone', 'Ремонт Samsung', 'Не тримає зарядку', 'Скільки коштує діагностика?'];

export function SiteWidgets() {
  const [modal, setModal] = useState(false);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    const open = () => setModal(true);
    const openChat = () => setChat(true);
    window.addEventListener('open-lead-modal', open);
    window.addEventListener('open-chat', openChat);
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModal(false);
      }
    };
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('open-lead-modal', open);
      window.removeEventListener('open-chat', openChat);
      window.removeEventListener('keydown', esc);
    };
  }, []);

  return (
    <>
      {/* Кнопки на десктопі */}
      <a
        href={`tel:${site.phone}`}
        aria-label="Зателефонувати"
        className="fixed bottom-6 right-6 z-30 hidden h-14 w-14 place-items-center rounded-full bg-grad text-[#0c0c0b] shadow-lg sm:grid"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
        </svg>
      </a>
      {!chat && (
        <button
          onClick={() => setChat(true)}
          aria-label="AI-консультант"
          className="fixed bottom-6 left-6 z-30 hidden items-center gap-2 rounded-full bg-grad px-5 py-3.5 text-sm font-medium text-[#0c0c0b] shadow-lg sm:inline-flex"
        >
          💬 AI-консультант
        </button>
      )}

      {/* Мобільна нижня панель */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-graphite bg-void/95 backdrop-blur sm:hidden">
        <a href={`tel:${site.phone}`} className="flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-white">
          ☎ Подзвонити
        </a>
        <button onClick={() => setChat(true)} className="flex items-center justify-center gap-2 border-l border-graphite py-3.5 text-sm font-medium text-white">
          💬 Чат
        </button>
      </div>

      {chat && <ChatPanel onClose={() => setChat(false)} />}
      {modal && <LeadModal onClose={() => setModal(false)} />}
    </>
  );
}

function LeadModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-[8vh] w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-graphite bg-void p-8 shadow-2xl">
        <button onClick={onClose} aria-label="Закрити" className="absolute right-4 top-3 text-2xl text-ash hover:text-white">
          ×
        </button>
        <h3 className="mb-2 text-2xl font-medium grad-text">Викликати кур’єра</h3>
        <p className="mb-6 text-sm text-ash">Залиште номер — передзвонимо за кілька хвилин та узгодимо час виїзду.</p>
        <LeadForm onDone={onClose} />
      </div>
    </div>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);
  const debug = typeof window !== 'undefined' && /[?&]debug=1/.test(window.location.search);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [msgs, busy]);

  async function send(text: string) {
    if (busy || !text.trim()) return;
    setShowQuick(false);
    const next = [...msgs, { role: 'user' as const, content: text }];
    // одразу додаємо порожнє повідомлення асистента — в нього стрімимо відповідь
    setMsgs([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);

    const setLast = (content: string) =>
      setMsgs((m) => {
        const copy = m.slice();
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant') {
            copy[i] = { role: 'assistant', content };
            break;
          }
        }
        return copy;
      });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => '');
        setLast(res.status === 429 ? errText || failMsg() : failMsg() + (debug ? `\n\n[debug ${res.status}: ${errText}]` : ''));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let visible = '';
      let leadSaved = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (value) {
          buf += decoder.decode(value, { stream: true });
          const sep = buf.indexOf(''); // роздільник тексту й метадану
          if (sep === -1) {
            visible = buf;
          } else {
            visible = buf.slice(0, sep);
            try {
              leadSaved = !!JSON.parse(buf.slice(sep + 1)).leadSaved;
            } catch {
              /* метадан ще не дочитано */
            }
          }
          setLast(visible);
        }
        if (done) break;
      }

      if (!visible.trim()) setLast(failMsg());
      if (leadSaved) {
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: 'generate_lead', method: 'chat' });
      }
    } catch {
      setLast(failMsg());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[80vh] max-h-[560px] w-full max-w-[380px] flex-col rounded-t-2xl border border-graphite bg-void shadow-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:h-[560px] sm:rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-graphite bg-gradient-to-r from-accent-3/10 to-accent-2/10 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-grad text-[#0c0c0b]">О</span>
          <div className="leading-tight">
            <b className="text-[15px] font-medium">Олександра</b>
            <div className="font-mono text-[11px] text-ash">AI-консультант · онлайн</div>
          </div>
        </div>
        <button onClick={onClose} aria-label="Закрити чат" className="text-2xl text-ash hover:text-white">
          ×
        </button>
      </div>

      <div ref={bodyRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <Bubble role="assistant">
          Вітаю! 👋 Я Олександра, консультант MobiDoctor. Що сталося з вашим телефоном? Підкажу ціну, строки та оформлю безкоштовний виїзд кур’єра по Харкову.
        </Bubble>
        {msgs.map((m, i) =>
          m.content ? (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          ) : null,
        )}
        {busy && msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant' && !msgs[msgs.length - 1].content && (
          <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-graphite bg-charcoal px-4 py-3.5">
            {[0, 0.15, 0.3].map((d) => (
              <span
                key={d}
                className="inline-block h-1.5 w-1.5 rounded-full bg-ash"
                style={{ animation: `typingDot 1.1s ease-in-out ${d}s infinite` }}
              />
            ))}
          </div>
        )}
      </div>

      {showQuick && (
        <div className="flex flex-wrap gap-2 px-4 pb-2.5">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-graphite bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:border-accent-3"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-graphite p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Напишіть повідомлення…"
          className="flex-1 rounded-full border border-graphite bg-void px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-bone/40"
        />
        <button type="submit" aria-label="Надіслати" disabled={busy} className="grid h-11 w-11 place-items-center rounded-full bg-grad text-[#0c0c0b] disabled:opacity-50">
          ➤
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const base = 'max-w-[84%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed';
  return role === 'user' ? (
    <div className={`${base} self-end rounded-br-sm bg-grad text-[#0c0c0b]`}>{children}</div>
  ) : (
    <div className={`${base} self-start rounded-bl-sm border border-graphite bg-charcoal text-white`}>{children}</div>
  );
}

function failMsg() {
  return 'Вибачте, стався збій звʼязку. Зателефонуйте, будь ласка: 073 666 18 36 — ми на звʼязку щодня 09:00–21:00.';
}

export { openLeadModal };
