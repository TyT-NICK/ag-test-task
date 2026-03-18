"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

export function ClientProviders({
  messages,
  locale,
  children,
}: {
  messages: AbstractIntlMessages;
  locale: string;
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryProvider>{children}</QueryProvider>
    </NextIntlClientProvider>
  );
}
