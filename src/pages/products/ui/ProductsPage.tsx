import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/shared/i18n/navigation";
import { Header } from "@/widgets/header";
import { ProductsTable } from "./ProductsTable";
import styles from "./ProductsPage.module.css";

export async function ProductsPage() {
  const [cookieStore, locale] = await Promise.all([cookies(), getLocale()]);

  if (!cookieStore.get("accessToken")) {
    redirect({ href: { pathname: "/login", query: { from: "/" } }, locale });
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <ProductsTable />
      </main>
    </div>
  );
}
