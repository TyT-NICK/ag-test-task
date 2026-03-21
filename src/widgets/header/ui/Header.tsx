"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { logoutApi, unregisterUnloadLogout } from "@/features/auth";
import { useRouter } from "@/shared/i18n/navigation";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { SearchBar } from "@/shared/ui/SearchBar";
import { UserInfo } from "./UserInfo";
import styles from "./Header.module.css";

export function Header() {
  const t = useTranslations("Header");
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleLogout() {
    unregisterUnloadLogout();
    await logoutApi();
    queryClient.clear();
    router.replace("/login");
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{t("products")}</h1>
      </div>
      <div className={styles.center}>
        <Suspense>
          <SearchBar placeholder={t("searchPlaceholder")} />
        </Suspense>
      </div>
      <div className={styles.right}>
        <Suspense>
          <LanguageSwitcher />
        </Suspense>
        <UserInfo onClick={handleLogout} />
      </div>
    </header>
  );
}
