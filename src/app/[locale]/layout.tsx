import '@/app/globals.css';
import type { Metadata } from 'next';
import Providers from '../providers';
import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import MainShell from '@/components/commons/MainShell';

type Theme = 'light' | 'dark' | 'system';

function isTheme(value: string | undefined): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

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

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  const defaultTheme = isTheme(themeCookie) ? themeCookie : 'system';
  const resolvedTheme = defaultTheme === 'dark' ? 'dark' : 'light';

  return (
    <html
      lang={locale}
      data-theme={resolvedTheme}
      suppressHydrationWarning
      style={{ colorScheme: resolvedTheme }}
    >
      <body className="antialiased">
        <Providers defaultTheme={defaultTheme} locale={locale} messages={messages}>
          <MainShell>{children}</MainShell>
        </Providers>
      </body>
    </html>
  );
}
