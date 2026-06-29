import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { brands } from '@/data/brands';
import { models } from '@/data/models';
import { services } from '@/data/services';
import { districts } from '@/data/districts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${site.domain}${p}`;

  const staticPaths = [
    '/',
    '/poslugy',
    '/vyizd-po-rayonah',
    '/remont-realme-oneplus',
    '/tsiny',
    '/garantiya',
    '/pro-nas',
    '/kontakty',
    '/polityka-konfidentsiynosti',
    '/umovy-vykorystannya',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const p of staticPaths) {
    entries.push({ url: url(p), lastModified: now, priority: p === '/' ? 1 : 0.6 });
  }
  for (const b of brands) {
    entries.push({ url: url(b.hubPath), lastModified: now, priority: 0.9 });
  }
  for (const m of models) {
    const brand = brands.find((b) => b.slug === m.brand)!;
    entries.push({ url: url(`${brand.hubPath}/${m.slug}`), lastModified: now, priority: 0.8 });
  }
  for (const s of services) {
    entries.push({ url: url(`/poslugy/${s.slug}`), lastModified: now, priority: 0.8 });
  }
  for (const d of districts) {
    entries.push({ url: url(`/vyizd-po-rayonah/${d.slug}`), lastModified: now, priority: 0.7 });
  }

  return entries;
}
