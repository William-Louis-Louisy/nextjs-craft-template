"use client";

import Header from "@/components/navigation/Header";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

export default function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}) {
  return (
    <SessionProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Europe/Paris"
      >
        <Header />
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
