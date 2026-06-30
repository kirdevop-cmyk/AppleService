import type { Metadata } from 'next';
import { site } from '@/data/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/blocks/Blocks';
import { LeadForm } from '@/components/forms/LeadForm';

export const metadata: Metadata = buildMetadata({
  title: 'Контакти — MobiDoctor, виїзний ремонт смартфонів у Харкові',
  description:
    'Контакти MobiDoctor: телефон 073 666 18 36, виїзний ремонт смартфонів по всьому Харкову, графік роботи щодня 09:00–21:00. Залиште заявку онлайн.',
  path: '/kontakty',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Контакти', path: '/kontakty' }])} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Контакти' }]} />
          <h1 className="mb-4 text-3xl font-medium tracking-tight sm:text-4xl">Контакти</h1>
          <p className="max-w-2xl text-lg text-ash">Зв’яжіться з нами зручним способом або залиште заявку — і кур’єр приїде до вас.</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-2xl font-medium tracking-tight">MobiDoctor — виїзний ремонт у Харкові</h2>
            <ul className="mb-7 space-y-3 text-[15px]">
              <li><span className="mr-3 font-mono text-xs uppercase text-ash">Телефон</span><a href={`tel:${site.phone}`} className="grad-text">{site.phoneDisplay}</a></li>
              {site.telegram && (
                <li>
                  <span className="mr-3 font-mono text-xs uppercase text-ash">Telegram</span>
                  <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="grad-text">{site.telegramHandle}</a>
                </li>
              )}
              <li><span className="mr-3 font-mono text-xs uppercase text-ash">Місто</span>{site.city} — виїзд кур’єра по всьому місту</li>
              <li><span className="mr-3 font-mono text-xs uppercase text-ash">Графік</span>{site.hours}</li>
            </ul>
            <div className="prose-x">
              <h3>Реквізити</h3>
              <p>{site.legalName} · РНОКПП {site.edrpou}</p>
              <p className="text-[13px] text-smoke">{site.disclaimer}</p>
              <h3>Зона обслуговування</h3>
              <p>Виконуємо виїзний ремонт у всіх районах Харкова. <a href="/vyizd-po-rayonah">Дивитись райони →</a></p>
            </div>
          </div>
          <div className="rounded-2xl border border-graphite p-7">
            <h2 className="mb-4 text-xl font-medium">Залишити заявку</h2>
            <LeadForm />
          </div>
        </div>
      </Section>
    </>
  );
}
