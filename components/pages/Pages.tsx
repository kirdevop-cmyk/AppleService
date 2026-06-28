import Link from 'next/link';
import { notFound } from 'next/navigation';
import { brandBySlug, type BrandSlug } from '@/data/brands';
import { modelsByBrand, modelBySlug } from '@/data/models';
import { services, serviceBySlug } from '@/data/services';
import { districtBySlug } from '@/data/districts';
import { brandFaq } from '@/data/faq';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Section,
  Eyebrow,
  ServiceCards,
  HowItWorks,
  PriceTable,
  Faq,
  CtaBanner,
  PageActions,
} from '@/components/blocks/Blocks';
import { serviceSchema, productRepairSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

/* ---------------- Brand hub ---------------- */
export function BrandHubView({ brandSlug }: { brandSlug: BrandSlug }) {
  const brand = brandBySlug(brandSlug);
  if (!brand) notFound();
  const list = modelsByBrand(brandSlug);
  const crumbs = [
    { name: 'Головна', path: '/' },
    { name: `Ремонт ${brand.name}`, path: brand.hubPath },
  ];

  return (
    <>
      <JsonLd data={[serviceSchema(`Ремонт ${brand.name}`, brand.hubPath), breadcrumbSchema(crumbs), faqSchema(brandFaq)]} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: `Ремонт ${brand.name}` }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Ремонт {brand.name} у Харкові з виїздом кур’єра
          </h1>
          <div className="mb-7"><PageActions /></div>
        </div>
      </section>

      {list.length > 0 && (
        <Section>
          <Eyebrow>Оберіть модель</Eyebrow>
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Моделі {brand.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m) => (
              <Link key={m.slug} href={`${brand.hubPath}/${m.slug}`} className="card flex items-center justify-between">
                <span className="text-[15px] text-white">Ремонт {m.name}</span>
                <span className="text-accent-3">→</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section alt>
        <div className="prose-x max-w-3xl" dangerouslySetInnerHTML={{ __html: brand.intro }} />
      </Section>

      <Section>
        <Eyebrow>Послуги</Eyebrow>
        <h2 className="mb-6 text-2xl font-medium tracking-tight">Що ремонтуємо у {brand.name}</h2>
        <ServiceCards />
      </Section>

      <Section alt>
        <Eyebrow>Ціни</Eyebrow>
        <h2 className="mb-6 text-2xl font-medium tracking-tight">Орієнтовні ціни</h2>
        <PriceTable />
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Часті питання</h2>
          <Faq items={brandFaq} />
          <CtaBanner title={`Зламався ${brand.name}? Викличте кур’єра.`} />
        </div>
      </Section>
    </>
  );
}

/* ---------------- Model ---------------- */
export function ModelView({ brandSlug, modelSlug }: { brandSlug: BrandSlug; modelSlug: string }) {
  const brand = brandBySlug(brandSlug);
  const model = brand && modelBySlug(brandSlug, modelSlug);
  if (!brand || !model) notFound();
  const path = `${brand.hubPath}/${model.slug}`;
  const crumbs = [
    { name: 'Головна', path: '/' },
    { name: `Ремонт ${brand.name}`, path: brand.hubPath },
    { name: model.name, path },
  ];
  const minPrice =
    model.priceOverrides?.['zamina-ekrana'] ??
    Math.min(...services.filter((s) => s.priceFrom).map((s) => s.priceFrom as number));
  const related = modelsByBrand(brandSlug)
    .filter((m) => m.slug !== model.slug)
    .slice(0, 4);

  const modelFaq = [
    { q: `Скільки коштує ремонт ${model.name}?`, a: `Залежить від поломки та обраної деталі (оригінал чи копія). Точну ціну називаємо після безкоштовної діагностики. Орієнтовно — від ${minPrice} ₴.` },
    ...brandFaq,
  ];

  return (
    <>
      <JsonLd data={[productRepairSchema(model.name, path, minPrice), breadcrumbSchema(crumbs), faqSchema(modelFaq)]} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: `Ремонт ${brand.name}`, href: brand.hubPath }, { name: model.name }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Ремонт {model.name} у Харкові з виїздом кур’єра
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">{model.intro}</p>
          <PageActions />
        </div>
      </section>

      <Section>
        <Eyebrow>Типові поломки {model.name}</Eyebrow>
        <h2 className="mb-6 text-2xl font-medium tracking-tight">З чим звертаються найчастіше</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {model.commonIssues.map((issue) => (
            <li key={issue} className="rounded-xl border border-graphite px-5 py-4 text-[15px] text-white">
              {issue}
            </li>
          ))}
        </ul>
      </Section>

      <Section alt>
        <Eyebrow>Ціни на ремонт {model.name}</Eyebrow>
        <h2 className="mb-6 text-2xl font-medium tracking-tight">Орієнтовні ціни</h2>
        <PriceTable overrides={model.priceOverrides} />
        <p className="mt-4 text-sm text-ash">* Точну вартість узгоджуємо до робіт після безкоштовної діагностики. Деталі: оригінал або копія на вибір.</p>
      </Section>

      <Section>
        <Eyebrow>Як це працює</Eyebrow>
        <h2 className="mb-6 text-2xl font-medium tracking-tight">Виїзний ремонт у 4 кроки</h2>
        <HowItWorks />
      </Section>

      <Section alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Питання про ремонт {model.name}</h2>
          <Faq items={modelFaq} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Схожі моделі {brand.name}</h2>
          <div className="flex flex-wrap gap-3">
            {related.map((m) => (
              <Link key={m.slug} href={`${brand.hubPath}/${m.slug}`} className="rounded-full border border-graphite px-5 py-2.5 text-[15px] text-white hover:border-accent-3">
                {m.name}
              </Link>
            ))}
          </div>
          <CtaBanner title={`Потрібен ремонт ${model.name}? Викличте кур’єра.`} />
        </Section>
      )}
    </>
  );
}

/* ---------------- Service ---------------- */
export function ServiceView({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const path = `/poslugy/${service.slug}`;
  const crumbs = [
    { name: 'Головна', path: '/' },
    { name: 'Послуги', path: '/poslugy' },
    { name: service.name, path },
  ];
  return (
    <>
      <JsonLd data={[serviceSchema(service.name, path), breadcrumbSchema(crumbs), faqSchema(service.faq)]} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Послуги', href: '/poslugy' }, { name: service.name }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            {service.name} у Харкові з виїздом кур’єра
          </h1>
          <p className="mb-3 font-mono text-sm text-accent-3">
            {service.priceFrom ? `від ${service.priceFrom} ₴` : 'за діагностикою'} · {service.timeFrom}
          </p>
          <div className="mb-7"><PageActions /></div>
        </div>
      </section>
      <Section>
        <div className="prose-x max-w-3xl" dangerouslySetInnerHTML={{ __html: service.body }} />
        <div className="max-w-3xl"><CtaBanner title="Потрібен ремонт? Викличте кур’єра." /></div>
      </Section>
      <Section alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Часті питання</h2>
          <Faq items={service.faq} />
        </div>
      </Section>
    </>
  );
}

/* ---------------- District ---------------- */
export function DistrictView({ slug }: { slug: string }) {
  const d = districtBySlug(slug);
  if (!d) notFound();
  const path = `/vyizd-po-rayonah/${d.slug}`;
  const crumbs = [
    { name: 'Головна', path: '/' },
    { name: 'Виїзд по районах', path: '/vyizd-po-rayonah' },
    { name: d.name, path },
  ];
  const faq = [
    { q: `Кур’єр приїде ${d.prepositional}?`, a: `Так. Кур’єр MobiDoctor безкоштовно приїде ${d.prepositional}, забере телефон і привезе відремонтований.` },
    { q: 'Скільки коштує виїзд?', a: 'Виїзд кур’єра по Харкову безкоштовний. Ви оплачуєте лише ремонт після узгодження ціни.' },
  ];
  return (
    <>
      <JsonLd data={[serviceSchema(`Виїзний ремонт смартфонів ${d.prepositional}`, path), breadcrumbSchema(crumbs), faqSchema(faq)]} />
      <section className="pt-16">
        <div className="container-x py-12">
          <Breadcrumbs items={[{ name: 'Головна', href: '/' }, { name: 'Виїзд по районах', href: '/vyizd-po-rayonah' }, { name: d.name }]} />
          <h1 className="mb-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Виїзний ремонт смартфонів {d.prepositional} (Харків)
          </h1>
          <p className="mb-7 max-w-2xl text-lg text-ash">{d.intro}</p>
          <PageActions />
          {d.landmarks.length > 0 && (
            <p className="mt-5 font-mono text-xs text-ash">Орієнтири: {d.landmarks.join(' · ')}</p>
          )}
        </div>
      </section>
      <Section>
        <Eyebrow>Послуги {d.prepositional}</Eyebrow>
        <h2 className="mb-6 text-2xl font-medium tracking-tight">Що ремонтуємо</h2>
        <ServiceCards />
      </Section>
      <Section alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">Часті питання</h2>
          <Faq items={faq} />
          <CtaBanner title={`Викличте кур’єра ${d.prepositional}.`} />
        </div>
      </Section>
    </>
  );
}
