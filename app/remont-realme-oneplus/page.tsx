import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import { brandFaq } from '@/data/faq';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, Eyebrow, ServiceCards, PriceTable, Faq, CtaBanner, PageActions } from '@/components/blocks/Blocks';

const path = '/remont-realme-oneplus';
export const metadata: Metadata = buildMetadata({
  title: 'Обслуговування Realme, OnePlus, Oppo у Харкові — виїзне обслуговування | MobiDoctor',
  description:
    'Обслуговування Realme, OnePlus, Oppo, Honor, Huawei у Харкові з виїздом кур’єра. Заміна екрана, акумулятора, після води. Гарантія до 12 місяців. ☎ 073 666 18 36',
  path,
});

export default function Page() {
  return (
    <>
      <JsonLd data={[serviceSchema('Обслуговування смартфонів', path), breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Realme, OnePlus та інші', path }]), faqSchema(brandFaq)]} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Realme, OnePlus та інші' }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Обслуговування Realme, OnePlus, Oppo та інших смартфонів у Харкові
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">
            Обслуговуємо не лише топові бренди: Realme, OnePlus, Oppo, Honor, Huawei, Motorola, Nokia. Кур’єр безкоштовно забере й привезе телефон по Харкову.
          </p>
          <PageActions />
        </div>
      </section>
      <Section alt>
        <div className="prose-x max-w-3xl">
          <h2>Виїзне обслуговування смартфонів інших брендів</h2>
          <p>Навіть якщо вашого бренду немає в меню — ми, найімовірніше, його обслуговуємо. MobiDoctor працює з <strong>Realme, OnePlus, Oppo, Honor, Huawei, Motorola, Nokia</strong> та іншими смартфонами. Залиште заявку з моделлю й описом проблеми — підкажемо ціну й вишлемо кур’єра. Виїзд по Харкову та діагностика безкоштовні, гарантія до 12 місяців. Деталі — оригінал або сертифікована копія на вибір.</p>
        </div>
      </Section>
      <Section>
        <Eyebrow>Послуги</Eyebrow>
        <ServiceCards />
      </Section>
      <Section alt>
        <Eyebrow>Ціни</Eyebrow>
        <PriceTable />
      </Section>
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Часті питання</h2>
          <Faq items={brandFaq} />
          <CtaBanner title="Не знайшли свій бренд? Напишіть нам." />
        </div>
      </Section>
    </>
  );
}
