import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, Eyebrow, PriceTable, PageActions, CtaBanner } from '@/components/blocks/Blocks';

export const metadata: Metadata = buildMetadata({
  title: 'Ціни на обслуговування смартфонів у Харкові | MobiDoctor',
  description:
    'Орієнтовні ціни на обслуговування смартфонів у Харкові: заміна екрана, акумулятора, після води, роз’єм зарядки. Діагностика та виїзд кур’єра — безкоштовно. ☎ 073 666 18 36',
  path: '/tsiny',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Ціни', path: '/tsiny' }])} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Ціни' }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Ціни на обслуговування смартфонів у Харкові
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">
            Нижче — орієнтовні ціни «від». Точну вартість називаємо після <strong className="text-white">безкоштовної діагностики</strong>: вона залежить від моделі та обраних деталей (оригінал або копія).
          </p>
          <PageActions />
        </div>
      </section>
      <Section>
        <Eyebrow>Прайс</Eyebrow>
        <PriceTable />
        <p className="mt-4 text-sm text-ash">* Ціни орієнтовні та залежать від моделі телефону й типу деталей. Остаточну суму узгоджуємо до початку робіт.</p>
        <div className="prose-x mt-8 max-w-3xl">
          <h2>Чесні ціни без прихованих доплат</h2>
          <p>Ми завжди узгоджуємо вартість обслуговування <strong>до початку робіт</strong> — після безкоштовної діагностики. Жодних сюрпризів у підсумковому чеку. Пропонуємо деталі на вибір: <strong>оригінал</strong> (дорожче, максимальна якість) або <strong>сертифікована копія</strong> (дешевше, з гарантією). На все — гарантія до 12 місяців.</p>
        </div>
        <div className="max-w-3xl"><CtaBanner title="Дізнатися точну ціну — безкоштовно." /></div>
      </Section>
    </>
  );
}
