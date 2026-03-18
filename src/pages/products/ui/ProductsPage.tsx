import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/shared/i18n/navigation";

export async function ProductsPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);

  if (!cookieStore.get("accessToken")) {
    redirect({ href: { pathname: "/login", query: { from: "/" } }, locale });
  }

  return <div className=""></div>;
}
