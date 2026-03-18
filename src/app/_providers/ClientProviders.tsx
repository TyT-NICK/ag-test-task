"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      <ToastContainer position="top-right" autoClose={4000} theme="light" />
    </NextIntlClientProvider>
  );
}
