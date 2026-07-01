export const site = {
  name: 'MobiDoctor',
  domain: (process.env.NEXT_PUBLIC_SITE_URL || 'https://mobidoctor.com.ua').replace(/\/$/, ''),
  phone: '+380736661836',
  phoneDisplay: '073 666 18 36',
  hours: 'Щодня 09:00 – 21:00',
  city: 'Харків',
  areaServed: 'Харків',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/mobi_dockh', // чат із менеджером
  telegramHandle: '@mobi_dockh',
  viber: '',
  email: '', // напр. info@mobidoctor.com.ua
  legalName: 'ФОП [вкажіть ПІБ]',
  edrpou: '[вкажіть РНОКПП]',
  disclaimer:
    'MobiDoctor не є авторизованим сервісним центром жодного виробника. Назви брендів і моделей використані лише для опису сумісності послуг.',
  positioning:
    'Виїзне обслуговування смартфонів по Харкову — кур’єр забирає телефон у вас, ми обслуговуємо, привозимо назад готовий. Гарантія до 12 місяців.',
};

export const sameAs = [site.telegram, site.viber].filter(Boolean);
