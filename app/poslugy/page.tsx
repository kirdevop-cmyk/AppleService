import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, Eyebrow, ServiceCards, PageActions, CtaBanner } from '@/components/blocks/Blocks';

export const metadata: Metadata = buildMetadata({
  title: 'Послуги ремонту смартфонів у Харкові — виїзний ремонт | MobiDoctor',
  description:
    'Послуги ремонту смартфонів у Харкові з виїздом кур’єра: заміна екрана, акумулятора, ремонт після води, роз’єму зарядки, камери, плати. Гарантія до 12 місяців. ☎ 073 666 18 36',
  path: '/poslugy',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Послуги', path: '/poslugy' }])} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Послуги' }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Послуги ремонту смартфонів у Харкові
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">
            Виконуємо всі види ремонту з виїздом кур’єра. Оберіть послугу, щоб дізнатися деталі, ціни та строки.
          </p>
          <PageActions />
        </div>
      </section>
      <Section>
        <Eyebrow>Що ремонтуємо</Eyebrow>
        <ServiceCards />
        <div className="mx-auto max-w-3xl"><CtaBanner title="Потрібен ремонт? Викличте кур’єра." /></div>
      </Section>
    </>
  );
}
