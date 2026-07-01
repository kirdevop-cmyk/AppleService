import type { Metadata } from 'next';
import Link from 'next/link';
import { districts } from '@/data/districts';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, Eyebrow, PageActions, CtaBanner } from '@/components/blocks/Blocks';

export const metadata: Metadata = buildMetadata({
  title: 'Виїзне обслуговування телефонів по районах Харкова | MobiDoctor',
  description:
    'Виїзне обслуговування смартфонів у всіх районах Харкова: Салтівка, Олексіївка, Центр, ХТЗ, Холодна Гора, Павлове Поле та інші. Кур’єр приїде безкоштовно. ☎ 073 666 18 36',
  path: '/vyizd-po-rayonah',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Виїзд по районах', path: '/vyizd-po-rayonah' }])} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Виїзд по районах' }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Виїзне обслуговування телефонів по районах Харкова
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">
            Кур’єр MobiDoctor безкоштовно приїде у будь-який район Харкова — забере телефон і привезе обслужений. Оберіть свій район:
          </p>
          <PageActions />
        </div>
      </section>
      <Section>
        <Eyebrow>Райони Харкова</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <Link key={d.slug} href={`/vyizd-po-rayonah/${d.slug}`} className="card flex items-center justify-between">
              <span className="text-[15px] text-white">📍 {d.name}</span>
              <span className="text-accent-3">→</span>
            </Link>
          ))}
        </div>
        <div className="mx-auto max-w-3xl"><CtaBanner title="Викличте кур’єра у свій район." /></div>
      </Section>
    </>
  );
}
