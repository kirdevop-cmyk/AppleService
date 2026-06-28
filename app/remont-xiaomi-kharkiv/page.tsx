import type { Metadata } from 'next';
import { brandBySlug } from '@/data/brands';
import { buildMetadata } from '@/lib/seo';
import { BrandHubView } from '@/components/pages/Pages';

const brand = brandBySlug('xiaomi')!;
export const metadata: Metadata = buildMetadata({ title: brand.title, description: brand.description, path: brand.hubPath });

export default function Page() {
  return <BrandHubView brandSlug="xiaomi" />;
}
