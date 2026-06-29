'use client';

import { useEffect, useRef, useState } from 'react';

type Step = { role: 'user' | 'assistant'; text: string };
type Msg = { role: 'user' | 'assistant'; text: string };

const SCRIPT: Step[] = [
  { role: 'user', text: 'Вітаю! Розбив екран на iPhone 13 😔 Скільки коштує заміна?' },
  { role: 'assistant', text: 'Доброго дня! 👋 Заміна екрана iPhone 13 — від 6 900 ₴. Є оригінал і якісна копія на вибір, ремонт зазвичай 30–60 хвилин.' },
  { role: 'user', text: 'А ви самі заберете телефон? Я на Олексіївці' },
  { role: 'assistant', text: 'Так, звісно! 🚚 Кур’єр безкоштовно забере телефон на Олексіївці й привезе відремонтований. Діагностика теж безкоштовна.' },
  { role: 'user', text: 'Супер, а коли можна сьогодні?' },
  { role: 'assistant', text: 'Можемо вже сьогодні ввечері. Залиште номер — передзвоню за пару хвилин і узгоджу зручний час. 📱' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ChatDemoCard() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setMsgs(SCRIPT.map((s) => ({ role: s.role, text: s.text })));
      return;
    }

    async function run() {
      const id = ++runId.current;
      const alive = () => id === runId.current;
      while (alive()) {
        setMsgs([]);
        setInput('');
        setTyping(false);
        await sleep(700);
        for (const step of SCRIPT) {
          if (!alive()) return;
          if (step.role === 'user') {
            for (let c = 1; c <= step.text.length; c++) {
              if (!alive()) return;
              setInput(step.text.slice(0, c));
              await sleep(26);
            }
            await sleep(380);
            if (!alive()) return;
            setInput('');
            setMsgs((m) => [...m, { role: 'user', text: step.text }]);
            await sleep(550);
          } else {
            setTyping(true);
            await sleep(1250);
            if (!alive()) return;
            setTyping(false);
            setMsgs((m) => [...m, { role: 'assistant', text: step.text }]);
            await sleep(900);
          }
        }
        await sleep(3800);
      }
    }

    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      run();
      return () => {
        runId.current++;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) run();
          else runId.current++; // зупиняємо демо поза екраном
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      runId.current++;
    };
  }, []);

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[400px] lg:ml-auto lg:mr-0">
      <div className="flex h-[440px] flex-col overflow-hidden rounded-2xl border border-graphite bg-void/90 shadow-2xl backdrop-blur">
        {/* шапка */}
        <div className="flex items-center gap-3 border-b border-graphite bg-gradient-to-r from-accent-3/10 to-accent-2/10 px-4 py-3.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-grad font-medium text-[#0c0c0b]">О</span>
          <div className="leading-tight">
            <b className="text-[15px] font-medium">Олександра</b>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-ash">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-3" />
              AI-консультант · онлайн
            </div>
          </div>
        </div>

        {/* стрічка */}
        <div ref={bodyRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
          <Bubble role="assistant">
            Вітаю! 👋 Я Олександра, консультант MobiDoctor. Що сталося з вашим телефоном?
          </Bubble>
          {msgs.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.text}
            </Bubble>
          ))}
          {typing && (
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

        {/* поле вводу (анімований набір) */}
        <div className="flex items-center gap-2 border-t border-graphite p-3">
          <div className="flex h-11 flex-1 items-center rounded-full border border-graphite bg-void px-4 text-sm text-white">
            {input ? (
              <>
                <span>{input}</span>
                <span className="ml-0.5 inline-block h-4 w-px bg-accent-3" style={{ animation: 'caretBlink 1s step-end infinite' }} />
              </>
            ) : (
              <span className="text-ash">Напишіть повідомлення…</span>
            )}
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-grad text-[#0c0c0b]">➤</span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const base =
    'max-w-[84%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed [animation:popIn_0.35s_cubic-bezier(0.16,1,0.3,1)_both]';
  return role === 'user' ? (
    <div className={`${base} self-end rounded-br-sm bg-grad text-[#0c0c0b]`}>{children}</div>
  ) : (
    <div className={`${base} self-start rounded-bl-sm border border-graphite bg-charcoal text-white`}>{children}</div>
  );
}
