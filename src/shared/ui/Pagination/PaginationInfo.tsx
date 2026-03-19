"use client";

import { useTranslations } from "next-intl";
import styles from "./PaginationInfo.module.css";

interface PaginationInfoProps {
  from: number;
  to: number;
  total: number;
}

export function PaginationInfo({ from, to, total }: PaginationInfoProps) {
  const t = useTranslations("PaginationInfo");

  return (
    <p className={styles.root}>
      <span className={styles.label}>{t("showing")} </span>
      <span className={styles.value}>{from}–{to}</span>
      <span className={styles.label}> {t("of")} </span>
      <span className={styles.value}>{total}</span>
    </p>
  );
}
