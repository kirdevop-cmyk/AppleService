import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { site } from '@/data/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SiteWidgets } from '@/components/forms/SiteWidgets';
import { JsonLd } from '@/components/seo/JsonLd';
import { localBusinessSchema } from '@/lib/schema';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-inter' });

const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: 'MobiDoctor — виїзний ремонт смартфонів у Харкові',
    template: '%s',
  },
  description: site.positioning,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0c0c0b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <head>
        {GTM && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
          </Script>
        )}
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {GTM && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        )}
        <JsonLd data={localBusinessSchema()} />
        <Header />
        <main className="pb-16 sm:pb-0">{children}</main>
        <Footer />
        <SiteWidgets />
      </body>
    </html>
  );
}
