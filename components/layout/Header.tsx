'use client';

import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/data/site';
import { CourierButton } from '@/components/ui/CourierButton';

const nav = [
  { href: '/remont-iphone-kharkiv', label: 'iPhone' },
  { href: '/remont-samsung-kharkiv', label: 'Samsung' },
  { href: '/remont-xiaomi-kharkiv', label: 'Xiaomi' },
  { href: '/poslugy', label: 'Послуги' },
  { href: '/tsiny', label: 'Ціни' },
  { href: '/vyizd-po-rayonah', label: 'Райони' },
  { href: '/kontakty', label: 'Контакти' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-graphite bg-void/80 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — головна`}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-grad text-[#0c0c0b]">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" />
            </svg>
          </span>
          <span className="text-lg font-medium tracking-tight">
            Mobi<span className="grad-text">Doctor</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 font-mono text-sm uppercase tracking-wider text-white/80 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-accent-3">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a href={`tel:${site.phone}`} className="hidden font-mono text-sm text-white/90 hover:text-accent-3 sm:inline">
            {site.phoneDisplay}
          </a>
          <CourierButton className="btn btn-accent hidden sm:inline-flex" />
          <button
            type="button"
            aria-label="Меню"
            className="flex flex-col gap-1.5 p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="h-px w-5 bg-white" />
            <span className="h-px w-5 bg-white" />
            <span className="h-px w-5 bg-white" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-graphite bg-void/95 px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3 font-mono text-sm uppercase tracking-wider">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-white/85 hover:text-accent-3">
                {n.label}
              </Link>
            ))}
            <a href={`tel:${site.phone}`} className="text-accent-3">
              {site.phoneDisplay}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
