"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { routing } from "@/shared/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  ru: "RU",
};

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(newLocale: string | null) {
    if (!newLocale) return;
    const query = searchParams?.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { locale: newLocale });
  }

  return (
    <BaseSelect.Root value={locale} onValueChange={handleChange}>
      <BaseSelect.Trigger className={styles.trigger}>
        <BaseSelect.Value className={styles.value} />
        <BaseSelect.Icon className={styles.icon}>
          <ChevronIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} align="end" className={styles.positioner}>
          <BaseSelect.Popup className={styles.popup}>
            <BaseSelect.List className={styles.list}>
              {routing.locales.map((loc) => (
                <BaseSelect.Item key={loc} value={loc} className={styles.item}>
                  <BaseSelect.ItemText>
                    {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
                  </BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
