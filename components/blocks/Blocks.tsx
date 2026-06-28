import Link from 'next/link';
import { site } from '@/data/site';
import { services, type ServiceSlug, type FaqItem } from '@/data/services';
import { brands } from '@/data/brands';
import { CourierButton } from '@/components/ui/CourierButton';

export function Section({
  children,
  alt = false,
  className = '',
}: {
  children: React.ReactNode;
  alt?: boolean;
  className?: string;
}) {
  return (
    <section className={`${alt ? 'bg-charcoal/40' : ''} py-14 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function ServiceCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Link key={s.slug} href={`/poslugy/${s.slug}`} className="card block">
          <div className="mb-4 text-3xl">{s.icon}</div>
          <h3 className="mb-2 text-xl font-medium text-white">{s.name}</h3>
          <p className="text-[15px] text-ash">{s.short}.</p>
          <p className="mt-3 font-mono text-xs text-accent-3">
            {s.priceFrom ? `від ${s.priceFrom} ₴` : 'за діагностикою'} · {s.timeFrom}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    ['1', 'Заявка', 'Телефонуєте або пишете в чат — орієнтовно називаємо ціну.'],
    ['2', 'Кур’єр забирає', 'Безкоштовно приїздить у зручний час по Харкову.'],
    ['3', 'Ремонт', 'Безкоштовна діагностика, узгодження ціни, ремонт зі складу деталей.'],
    ['4', 'Доставка', 'Кур’єр привозить готовий телефон, гарантійний талон і чек.'],
  ];
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map(([n, t, p]) => (
        <div key={n} className="rounded-2xl border border-graphite p-7">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-grad font-mono text-[#0c0c0b]">{n}</div>
          <h3 className="mb-2 text-lg font-medium text-white">{t}</h3>
          <p className="text-sm text-ash">{p}</p>
        </div>
      ))}
    </div>
  );
}

export function TrustBadges() {
  const items = [
    ['0 ₴', 'виїзд кур’єра по Харкову'],
    ['0 ₴', 'діагностика'],
    ['30 хв', 'типовий ремонт від'],
    ['12 міс', 'гарантія до'],
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-graphite lg:grid-cols-4">
      {items.map(([b, s], i) => (
        <div key={i} className="bg-void p-6 text-center">
          <b className="block text-3xl font-medium grad-text">{b}</b>
          <span className="font-mono text-xs uppercase tracking-wider text-ash">{s}</span>
        </div>
      ))}
    </div>
  );
}

export function PriceTable({ overrides }: { overrides?: Partial<Record<ServiceSlug, number>> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-graphite">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 bg-white/[0.04] px-6 py-4 font-mono text-xs uppercase tracking-wider text-ash">
        <span>Послуга</span>
        <span>Час</span>
        <span className="text-right">Ціна від</span>
      </div>
      {services.map((s) => {
        const price = overrides?.[s.slug] ?? s.priceFrom;
        return (
          <div key={s.slug} className="grid grid-cols-[2fr_1fr_1fr] items-center gap-2 border-t border-graphite px-6 py-4 text-[15px]">
            <span className="text-white">{s.name}</span>
            <span className="text-ash">{s.timeFrom}</span>
            <span className="text-right grad-text">{price ? `від ${price} ₴` : '—'}</span>
          </div>
        );
      })}
      <div className="grid grid-cols-[2fr_1fr_1fr] items-center gap-2 border-t border-graphite px-6 py-4 text-[15px]">
        <span className="text-white">Діагностика та виїзд кур’єра</span>
        <span className="text-ash">—</span>
        <span className="text-right text-green-400">безкоштовно</span>
      </div>
    </div>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-graphite">
      {items.map((f, i) => (
        <details key={i} className="border-b border-graphite">
          <summary className="cursor-pointer list-none py-5 text-lg text-white [&::-webkit-details-marker]:hidden">
            {f.q}
          </summary>
          <p className="pb-5 text-[15px] leading-relaxed text-ash">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBanner({ title }: { title: string }) {
  return (
    <div className="my-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-graphite bg-gradient-to-r from-accent-3/10 to-accent-2/10 p-7">
      <b className="text-xl font-medium">{title}</b>
      <div className="flex flex-wrap gap-3">
        <CourierButton className="btn btn-accent" />
        <Link href="/tsiny" className="btn btn-ghost">
          Дивитись ціни
        </Link>
      </div>
    </div>
  );
}

export function BrandGrid() {
  const all = [
    ...brands.map((b) => [b.hubPath, b.name] as [string, string]),
    ['/remont-realme-oneplus', 'Realme, OnePlus та інші'] as [string, string],
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {all.map(([href, name]) => (
        <Link key={href} href={href} className="rounded-full border border-graphite bg-white/[0.03] px-5 py-2.5 text-[15px] text-white hover:border-accent-3">
          {name}
        </Link>
      ))}
    </div>
  );
}

export function PageActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <CourierButton className="btn btn-accent btn-lg" />
      <a href={`tel:${site.phone}`} className="btn btn-ghost btn-lg">
        ☎ {site.phoneDisplay}
      </a>
    </div>
  );
}
