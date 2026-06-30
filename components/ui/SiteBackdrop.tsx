'use client';

import { useEffect, useRef } from 'react';

/**
 * Глобальний фон сайту: темне полотно + синє сяйво у верхньому лівому
 * куті (як на логотипі), яке плавно «дихає» й трохи зсувається під час
 * прокрутки — для відчуття глибини без буквального «променя».
 * Фіксований шар позаду всього контенту (z-index: -10).
 */
export function SiteBackdrop() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, 1200);
        const el = glowRef.current;
        if (el) el.style.transform = `translate(${y * 0.04}px, ${y * 0.12}px) scale(${1 + y * 0.00025})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden" aria-hidden="true">
      {/* синє сяйво у верхньому лівому куті (як на логотипі), реагує на скрол */}
      <div
        ref={glowRef}
        className="absolute -left-[10%] -top-[10%] h-[60vw] max-h-[820px] min-h-[420px] w-[60vw] min-w-[420px] max-w-[820px] rounded-full blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.32), rgba(29,78,216,0.14) 45%, transparent 72%)',
          animation: 'glowPulse 9s ease-in-out infinite',
        }}
      />

      {/* друге, тихіше сяйво праворуч-знизу для балансу композиції */}
      <div
        className="absolute -bottom-[15%] -right-[12%] h-[45vw] max-h-[620px] min-h-[320px] w-[45vw] min-w-[320px] max-w-[620px] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(29,78,216,0.22), transparent 70%)',
          animation: 'glowPulse 11s ease-in-out infinite reverse',
        }}
      />

      {/* м'яка вінʼєтка, щоб краї полотна не виглядали обрізаними */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(12,12,11,0.65)_100%)]" />
    </div>
  );
}
