"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { routing } from "@/shared/i18n/routing";
import { ChevronDownIcon } from "@/shared/ui/icons";
import styles from "./LanguageSwitcher.module.css";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(newLocale: string | null) {
    if (!newLocale) return;
    const query = searchParams?.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      locale: newLocale,
    });
  }

  return (
    <BaseSelect.Root value={locale} onValueChange={handleChange}>
      <BaseSelect.Trigger className={styles.trigger}>
        <BaseSelect.Value className={styles.value} />
        <BaseSelect.Icon className={styles.icon}>
          <ChevronDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={4}
          align="end"
          className={styles.positioner}
        >
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
