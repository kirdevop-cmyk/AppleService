'use client';

import { useEffect, useRef } from 'react';

/**
 * Тонка градієнтна смуга зверху сторінки, що заповнюється під час
 * прокрутки. Дає відчуття прогресу й завершеності — підвищує довіру
 * та час на сторінці.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-white/[0.06]" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left bg-grad shadow-[0_0_12px_2px_rgba(59,130,246,0.6)]"
        style={{ transform: 'scaleX(0)', transition: 'transform 80ms linear' }}
      />
    </div>
  );
}
