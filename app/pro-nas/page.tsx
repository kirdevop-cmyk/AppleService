import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, CtaBanner, PageActions } from '@/components/blocks/Blocks';

export const metadata: Metadata = buildMetadata({
  title: 'Про нас — MobiDoctor, виїзне обслуговування смартфонів у Харкові',
  description:
    'MobiDoctor — майстерня виїзного обслуговування смартфонів у Харкові. Кур’єр забирає й привозить телефон, гарантія до 12 місяців, чесні ціни. ☎ 073 666 18 36',
  path: '/pro-nas',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Про нас', path: '/pro-nas' }])} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Про нас' }]} />
          <h1 className="mb-4 text-3xl font-medium tracking-tight sm:text-4xl">Про MobiDoctor</h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">Ми зробили обслуговування смартфонів зручним: без черг і поїздок через усе місто. Кур’єр приїде до вас.</p>
          <PageActions />
        </div>
      </section>
      <Section>
        <div className="prose-x max-w-3xl">
          <h2>Як ми працюємо</h2>
          <p>MobiDoctor — це майстерня <strong>виїзного обслуговування смартфонів у Харкові</strong>. Наша головна перевага перед стаціонарними майстернями — комфорт клієнта: вам не потрібно нікуди їхати. Кур’єр безкоштовно забирає телефон, ми обслуговуємо в обладнаній майстерні (паяльні станції, мікроскопи) і привозимо девайс назад готовим.</p>
          <h2>Чому нам довіряють</h2>
          <ul>
            <li><strong>Безкоштовний виїзд кур’єра</strong> по всьому Харкову.</li>
            <li><strong>Безкоштовна діагностика</strong> й узгодження ціни до робіт.</li>
            <li><strong>Гарантія до 12 місяців</strong> на роботи та деталі.</li>
            <li><strong>Деталі на вибір</strong> — оригінал або сертифікована копія.</li>
            <li>Обслуговування будь-якої складності: від заміни екрана до плати.</li>
          </ul>
          <CtaBanner title="Готові допомогти. Викличте кур’єра." />
        </div>
      </Section>
    </>
  );
}
