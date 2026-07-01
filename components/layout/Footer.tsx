import Link from 'next/link';
import { site } from '@/data/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-graphite">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <span className="text-lg font-medium">
            Mobi<span className="grad-text">Doctor</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-ash">
            Виїзне обслуговування смартфонів у Харкові: iPhone, Samsung, Xiaomi, Poco та інші. Кур’єр забере й привезе телефон. Гарантія до 12 місяців.
          </p>
          <div className="mt-4 flex flex-col gap-1.5 text-sm">
            <a href={`tel:${site.phone}`} className="text-white/80 hover:text-accent-3">☎ {site.phoneDisplay}</a>
            {site.telegram && (
              <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-accent-3">
                ✈️ Telegram: {site.telegramHandle}
              </a>
            )}
          </div>
        </div>
        <FooterCol
          title="Бренди"
          links={[
            ['/remont-iphone-kharkiv', 'Обслуговування iPhone'],
            ['/remont-samsung-kharkiv', 'Обслуговування Samsung'],
            ['/remont-xiaomi-kharkiv', 'Обслуговування Xiaomi / Poco'],
            ['/remont-realme-oneplus', 'Realme, OnePlus та інші'],
          ]}
        />
        <FooterCol
          title="Послуги"
          links={[
            ['/poslugy/zamina-ekrana', 'Заміна екрана'],
            ['/poslugy/zamina-akumulyatora', 'Заміна акумулятора'],
            ['/poslugy/pislya-vody', 'Обслуговування після води'],
            ['/poslugy/remont-platy', 'Обслуговування плати'],
          ]}
        />
        <FooterCol
          title="Інформація"
          links={[
            ['/tsiny', 'Ціни'],
            ['/garantiya', 'Гарантія'],
            ['/vyizd-po-rayonah', 'Виїзд по районах'],
            ['/pro-nas', 'Про нас'],
            ['/kontakty', 'Контакти'],
            ['/polityka-konfidentsiynosti', 'Політика конфіденційності'],
            ['/umovy-vykorystannya', 'Умови використання'],
          ]}
        />
      </div>
      <div className="container-x border-t border-graphite py-6 font-mono text-xs text-ash">
        © {year} {site.name} · Виїзне обслуговування смартфонів у Харкові · ☎ {site.phoneDisplay}
        <br />
        {site.disclaimer}
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="mb-1 font-mono text-xs uppercase tracking-wider text-white">{title}</h4>
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="text-sm text-white/80 hover:text-accent-3">
          {label}
        </Link>
      ))}
    </div>
  );
}
