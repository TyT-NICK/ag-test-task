"use client";

import { useLocale } from "next-intl";

export default function LoginPage() {
  const locale = useLocale();
  return <div>{locale}</div>;
}
