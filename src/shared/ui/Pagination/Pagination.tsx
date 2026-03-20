"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/shared/i18n/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/cn";
import styles from "./Pagination.module.css";

interface PaginationProps {
  total: number;
  limit: number;
  paramKey?: string;
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(2, current - 2);
  const right = Math.min(total - 1, current + 2);
  const pages: (number | "…")[] = [1];

  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

export function Pagination({
  total,
  limit,
  paramKey = "page",
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Math.max(1, Number(searchParams?.get(paramKey) ?? 1));
  const totalPages = Math.ceil(total / limit);

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (page <= 1) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, String(page));
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const pages = buildPageList(currentPage, totalPages);

  if (totalPages <= 1) {
    return (
      <nav
        className={styles.root}
        aria-label="Pagination"
        style={{ visibility: "hidden" }}
      />
    );
  }

  return (
    <nav className={styles.root} aria-label="Pagination">
      <button
        className={cn(styles.arrow, currentPage === 1 && styles.arrowDisabled)}
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((page, i) =>
        page === "…" ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={cn(styles.page, page === currentPage && styles.active)}
            onClick={() => navigate(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        className={cn(
          styles.arrow,
          currentPage === totalPages && styles.arrowDisabled,
        )}
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
