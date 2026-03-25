import '@/app/globals.css';
import type { Metadata } from 'next';
import Providers from '../providers';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import MainShell from '@/components/commons/MainShell';

export const metadata: Metadata = {
  title: 'Next.js Craft Template',
  description: 'A template for Next.js projects that include Next-Auth, Next-Intl and TailwindCSS',
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
    console.error(error);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`antialiased`}>
        <Providers locale={locale} messages={messages}>
          <MainShell>{children}</MainShell>
        </Providers>
      </body>
    </html>
  );
}
