import type { Metadata } from 'next';
import { districts, districtBySlug } from '@/data/districts';
import { buildMetadata } from '@/lib/seo';
import { DistrictView } from '@/components/pages/Pages';

export const dynamicParams = false;

export function generateStaticParams() {
  return districts.map((d) => ({ district: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ district: string }> }): Promise<Metadata> {
  const { district } = await params;
  const d = districtBySlug(district);
  if (!d) return {};
  return buildMetadata({
    title: `Обслуговування смартфонів ${d.prepositional} — виклик кур’єра | MobiDoctor`,
    description: `Виїзне обслуговування смартфонів ${d.prepositional} (Харків): кур’єр безкоштовно забере й привезе телефон. Заміна екрана, акумулятора, після води. Гарантія до 12 місяців. ☎ 073 666 18 36`,
    path: `/vyizd-po-rayonah/${d.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ district: string }> }) {
  const { district } = await params;
  return <DistrictView slug={district} />;
}
