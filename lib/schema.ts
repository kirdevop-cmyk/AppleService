import { site, sameAs } from '@/data/site';
import type { FaqItem } from '@/data/services';

const abs = (path: string) => site.domain + (path === '/' ? '/' : path);

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description:
      'Виїзний ремонт смартфонів у Харкові: iPhone, Samsung, Xiaomi, Poco та інші. Кур’єр забирає й привозить телефон. Гарантія до 12 місяців.',
    image: abs('/og-image.jpg'),
    '@id': abs('/'),
    url: abs('/'),
    telephone: site.phone,
    priceRange: '₴₴',
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'UA' },
    areaServed: { '@type': 'City', name: site.areaServed },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function serviceSchema(serviceType: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: { '@type': 'LocalBusiness', name: site.name, telephone: site.phone },
    areaServed: { '@type': 'City', name: site.areaServed },
    url: abs(path),
  };
}

export function productRepairSchema(modelName: string, path: string, priceFrom?: number | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Ремонт ${modelName}`,
    provider: { '@type': 'LocalBusiness', name: site.name, telephone: site.phone },
    areaServed: { '@type': 'City', name: site.areaServed },
    url: abs(path),
    ...(priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'UAH',
            price: String(priceFrom),
            url: abs(path),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}
