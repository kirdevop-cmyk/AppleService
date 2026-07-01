import type { Metadata } from 'next';
import { brandBySlug } from '@/data/brands';
import { modelsByBrand, modelBySlug } from '@/data/models';
import { buildMetadata } from '@/lib/seo';
import { ModelView } from '@/components/pages/Pages';

const BRAND = 'samsung' as const;
const brand = brandBySlug(BRAND)!;
export const dynamicParams = false;

export function generateStaticParams() {
  return modelsByBrand(BRAND).map((m) => ({ model: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const m = modelBySlug(BRAND, model);
  if (!m) return {};
  return buildMetadata({
    title: `Обслуговування ${m.name} Харків — виїзд кур’єра, гарантія | MobiDoctor`,
    description: `Обслуговування ${m.name} у Харкові з виїздом кур’єра: ${m.commonIssues.slice(0, 3).join(', ').toLowerCase()}. Гарантія до 12 місяців. ☎ 073 666 18 36`,
    path: `${brand.hubPath}/${m.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  return <ModelView brandSlug={BRAND} modelSlug={model} />;
}
