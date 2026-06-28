'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Додає клас `.in` елементам із класом `.reveal`, коли вони з'являються
 * у в'юпорті. Перезапускається під час клієнтської навігації (зміна pathname).
 */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    if (els.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
