import type { Metadata } from 'next';
import { services, serviceBySlug } from '@/data/services';
import { buildMetadata } from '@/lib/seo';
import { ServiceView } from '@/components/pages/Pages';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const s = serviceBySlug(service);
  if (!s) return {};
  return buildMetadata({ title: s.title, description: s.description, path: `/poslugy/${s.slug}` });
}

export default async function Page({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  return <ServiceView slug={service} />;
}
