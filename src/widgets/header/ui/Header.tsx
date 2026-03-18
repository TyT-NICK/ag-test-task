"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { SearchBar } from "@/shared/ui/SearchBar";
import styles from "./Header.module.css";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{t("products")}</h1>
      </div>
      <div className={styles.center}>
        <SearchBar placeholder={t("searchPlaceholder")} />
      </div>
      <div className={styles.right}>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
