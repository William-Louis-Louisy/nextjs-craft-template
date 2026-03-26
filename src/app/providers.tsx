'use client';

import Header from '@/components/navigation/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';

export default function Providers({
  children,
  defaultTheme,
  locale,
  messages,
}: {
  children: React.ReactNode;
  defaultTheme: 'light' | 'dark' | 'system';
  locale: string;
  messages: Record<string, string>;
}) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Paris">
        <ThemeProvider defaultTheme={defaultTheme}>
          <Header />
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
