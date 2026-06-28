import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, CtaBanner, PageActions } from '@/components/blocks/Blocks';

export const metadata: Metadata = buildMetadata({
  title: 'Гарантія на ремонт смартфонів | MobiDoctor Харків',
  description:
    'Гарантія до 12 місяців на ремонт смартфонів у MobiDoctor: на роботи та встановлені деталі, з гарантійним талоном. Умови гарантії. ☎ 073 666 18 36',
  path: '/garantiya',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Головна', path: '/' }, { name: 'Гарантія', path: '/garantiya' }])} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Гарантія' }]} />
          <h1 className="mb-4 text-3xl font-medium tracking-tight sm:text-4xl">Гарантія на ремонт</h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">Ми відповідаємо за результат: на всі виконані роботи та встановлені деталі надаємо гарантію до 12 місяців.</p>
          <PageActions />
        </div>
      </section>
      <Section>
        <div className="prose-x max-w-3xl">
          <h2>Що покриває гарантія</h2>
          <p>Гарантія поширюється на виконану роботу та встановлену деталь. Якщо протягом гарантійного строку проявиться та сама несправність не з вини користувача — ми усунемо її <strong>безкоштовно</strong>. Гарантійний талон видаємо разом із готовим телефоном.</p>
          <h2>Строки</h2>
          <ul>
            <li>До 12 місяців — на більшість замінених деталей і робіт.</li>
            <li>Окремі складні ремонти (після води, плата) — строк узгоджується індивідуально й вказується в талоні.</li>
          </ul>
          <h2>Коли гарантія не діє</h2>
          <ul>
            <li>Механічні пошкодження після ремонту (падіння, удар, тиск).</li>
            <li>Потрапляння вологи після ремонту.</li>
            <li>Самостійне втручання або ремонт в іншому місці після нас.</li>
            <li>Пошкодження пломб (де вони встановлюються).</li>
          </ul>
          <CtaBanner title="Є питання щодо гарантії? Зателефонуйте." />
        </div>
      </Section>
    </>
  );
}
