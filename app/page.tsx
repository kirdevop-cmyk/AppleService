import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/data/site';
import { homeFaq } from '@/data/faq';
import { buildMetadata } from '@/lib/seo';
import { faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  Section,
  Eyebrow,
  BrandGrid,
  ServiceCards,
  HowItWorks,
  TrustBadges,
  PriceTable,
  Faq,
  PageActions,
} from '@/components/blocks/Blocks';

export const metadata: Metadata = buildMetadata({
  title: 'Виїзний ремонт смартфонів у Харкові — кур’єр забере телефон | MobiDoctor',
  description:
    'MobiDoctor — виїзний ремонт смартфонів у Харкові. Кур’єр безкоштовно забере телефон, ми відремонтуємо й привеземо назад готовий. iPhone, Samsung, Xiaomi, Poco. Гарантія до 12 місяців. ☎ 073 666 18 36',
  path: '/',
});

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(homeFaq)} />

      <section className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_80%_15%,rgba(139,92,246,0.22),transparent_60%),radial-gradient(500px_400px_at_15%_60%,rgba(34,211,238,0.16),transparent_60%)]" />
        <div className="container-x relative grid items-center gap-10 py-12 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-2/40 bg-accent-2/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-white">
              iPhone · Samsung · Xiaomi · Poco · виїзд по Харкову
            </span>
            <h1 className="mb-5 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Виїзний ремонт <span className="grad-text">смартфонів</span> у Харкові
            </h1>
            <p className="mb-8 max-w-xl text-lg text-ash">
              Не виходьте з дому. <strong className="text-white">Кур’єр забере ваш телефон, ми відремонтуємо й привеземо назад готовий.</strong>{' '}
              Гарантія до 12 місяців, безкоштовна діагностика, чесна ціна.
            </p>
            <PageActions />
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-ash">
              <li>🚚 Виїзд по Харкову — безкоштовно</li>
              <li>🛡 Гарантія до 12 місяців</li>
              <li>⚡ Ремонт від 30 хвилин</li>
            </ul>
          </div>
        </div>
      </section>

      <Section>
        <Eyebrow>Які смартфони ремонтуємо</Eyebrow>
        <h2 className="mb-6 text-3xl font-medium tracking-tight">Оберіть свій бренд</h2>
        <BrandGrid />
      </Section>

      <Section alt>
        <Eyebrow>Послуги</Eyebrow>
        <h2 className="mb-6 text-3xl font-medium tracking-tight">Що ми ремонтуємо</h2>
        <ServiceCards />
      </Section>

      <Section>
        <Eyebrow>Виїзний ремонт</Eyebrow>
        <h2 className="mb-6 text-3xl font-medium tracking-tight">Приїдемо, заберемо, привеземо готовий</h2>
        <HowItWorks />
      </Section>

      <Section alt>
        <TrustBadges />
      </Section>

      <Section>
        <Eyebrow>Орієнтовні ціни</Eyebrow>
        <h2 className="mb-6 text-3xl font-medium tracking-tight">Скільки коштує ремонт</h2>
        <PriceTable />
        <p className="mt-4 text-sm text-ash">
          * Точну ціну називаємо після безкоштовної діагностики. <Link href="/tsiny" className="underline decoration-smoke">Усі ціни →</Link>
        </p>
      </Section>

      <Section alt>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Часті питання</Eyebrow>
          <h2 className="mb-6 text-3xl font-medium tracking-tight">Питання та відповіді</h2>
          <Faq items={homeFaq} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Контакти</Eyebrow>
            <h2 className="mb-5 text-3xl font-medium tracking-tight">Викличте кур’єра у Харкові</h2>
            <ul className="mb-7 space-y-3 text-[15px]">
              <li>
                <span className="mr-3 font-mono text-xs uppercase text-ash">Телефон</span>
                <a href={`tel:${site.phone}`} className="grad-text">{site.phoneDisplay}</a>
              </li>
              <li><span className="mr-3 font-mono text-xs uppercase text-ash">Місто</span>{site.city} — виїзд кур’єра по всьому місту</li>
              <li><span className="mr-3 font-mono text-xs uppercase text-ash">Графік</span>{site.hours}</li>
            </ul>
            <PageActions />
          </div>
        </div>
      </Section>
    </>
  );
}
