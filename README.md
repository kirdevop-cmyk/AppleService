# MobiDoctor — виїзний ремонт смартфонів у Харкові

Сайт на **Next.js 14 (App Router) + TypeScript + Tailwind**, повністю статична генерація (SSG) на Vercel. Бренд **MobiDoctor** — без чужих товарних знаків, під вимоги Google Ads.

## Структура

```
app/                         # маршрути (App Router)
  page.tsx                   # головна
  remont-iphone-kharkiv/     # хаб бренду + [model] (динамічні сторінки моделей)
  remont-samsung-kharkiv/    # —//—
  remont-xiaomi-kharkiv/     # —//—
  remont-realme-oneplus/     # інші бренди
  poslugy/[service]/         # сторінки послуг
  vyizd-po-rayonah/[district]/  # геосторінки по районах
  tsiny, garantiya, pro-nas, kontakty, *-legal
  api/lead, api/chat         # прийом заявки / AI-консультант
  sitemap.ts, robots.ts      # генеруються з даних
components/                  # layout, blocks, forms, seo (JsonLd)
data/                        # site, brands, models, services, districts, faq, reviews, knowledge
lib/                         # seo (метадані), schema (JSON-LD), slug
```

## Контент — у `data/*.ts`

Сторінки моделей/районів/послуг будуються з типізованих даних. **Щоб додати модель/район — додайте запис у `data/models.ts` / `data/districts.ts`**; сторінка, sitemap і schema згенеруються автоматично. Кожна модель має унікальний `intro` та `commonIssues` (без дублікатів).

## Команди

```bash
npm install
npm run dev      # локальна розробка
npm run build    # продакшн-білд (SSG)
```

## Змінні оточення (Vercel → Settings → Environment Variables)

| Змінна | Призначення |
|--------|-------------|
| `NEXT_PUBLIC_SITE_URL` | продакшн-домен (для canonical/OG/sitemap) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (GA4 + події) |
| `ANTHROPIC_API_KEY` | AI-консультант (Claude) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | заявки в Telegram |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO` | дубль заявки на email (опц.) |

Див. `.env.example`.

## SEO

- Унікальні `title`/`description`/H1 + `canonical` на кожній сторінці (`generateMetadata`).
- JSON-LD: `LocalBusiness` (глобально), `Service`, `Service+Offer` (моделі), `FAQPage`, `BreadcrumbList`.
- `sitemap.xml` і `robots.txt` генеруються з даних; `/api` закрито.
- Внутрішня перелінковка: головна → бренди → моделі → послуги → райони.

## Лід-флоу та аналітика

- Форма (Ім'я + Телефон, honeypot, чекбокс згоди) → `POST /api/lead` → Telegram (+ email).
- AI-чат «Олександра» (Claude) консультує й приймає заявки через інструмент `save_lead`.
- Подія `generate_lead` пушиться в `dataLayer` (GTM/GA4).

## Перед публікацією

1. Вписати реальні **реквізити ФОП** у `data/site.ts` (`legalName`, `edrpou`).
2. Підключити **власний домен** + 301 зі старих URL; задати `NEXT_PUBLIC_SITE_URL`.
3. Додати `NEXT_PUBLIC_GTM_ID` (GA4 ціль `generate_lead`), подати sitemap у Search Console.
4. Замінити порожній `data/reviews.ts` реальними відгуками (Google Business Profile).
5. Додати `public/og-image.jpg` (1200×630) і реальні фото.
