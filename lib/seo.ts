import type { Metadata } from 'next';
import { site } from '@/data/site';

interface SeoInput {
  title: string;
  description: string;
  path: string; // напр. '/remont-iphone-kharkiv'
}

export function buildMetadata({ title, description, path }: SeoInput): Metadata {
  const url = site.domain + (path === '/' ? '' : path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: site.name,
      locale: 'uk_UA',
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  };
}
