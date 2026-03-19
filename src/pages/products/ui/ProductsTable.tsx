"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { Table } from "@/shared/ui/Table";
import type { SkeletonColumn } from "@/shared/ui/Table";
import { fetchProducts } from "@/features/products";
import type { ProductListItem } from "@/entities/product";
import styles from "./ProductsTable.module.css";
import Image from "next/image";

const LIMIT = 20;

const SKELETON_COLUMNS: SkeletonColumn[] = [
  { cellWidth: 44, barWidth: 18, barHeight: 18, barRadius: 4 }, // checkbox
  { cellWidth: 52, barWidth: 36, barHeight: 36, barRadius: 6 }, // thumbnail
  { barWidth: "55%" }, // title
  { cellWidth: 120, barWidth: "60%" }, // brand
  { cellWidth: 120, barWidth: "70%" }, // sku
  { cellWidth: 90, barWidth: "50%" }, // rating
  { cellWidth: 130, barWidth: "55%" }, // price
  { cellWidth: 96, barWidth: 64 }, // actions
];

const columnHelper = createColumnHelper<ProductListItem>();

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function ProductsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("ProductsTable");

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("thumbnail", {
          id: "thumbnail",
          header: "",
          size: 52,
          enableSorting: false,
          cell: ({ getValue }) => (
            <Image
              src={getValue()}
              alt=""
              width={36}
              height={36}
              className={styles.thumbnail}
            />
          ),
        }),
        columnHelper.accessor("title", {
          id: "title",
          header: t("columns.name"),
          enableSorting: true,
          cell: ({ getValue, row }) => (
            <div className={styles.titleCell}>
              <span className={styles.titleText}>{getValue()}</span>
              <span className={styles.categoryText}>{row.original.category}</span>
            </div>
          ),
        }),
        columnHelper.accessor("brand", {
          id: "brand",
          header: t("columns.vendor"),
          size: 120,
          enableSorting: false,
          cell: ({ getValue }) => (
            <strong className={styles.brand}>{getValue() ?? "—"}</strong>
          ),
        }),
        columnHelper.accessor("sku", {
          id: "sku",
          header: t("columns.sku"),
          size: 120,
          enableSorting: false,
          cell: ({ getValue }) => (
            <span className={styles.sku}>{getValue()}</span>
          ),
        }),
        columnHelper.accessor("rating", {
          id: "rating",
          header: t("columns.rating"),
          size: 90,
          enableSorting: true,
          cell: ({ getValue }) => {
            const value = getValue();
            return (
              <span className={value < 4 ? styles.ratingLow : styles.rating}>
                {value.toFixed(1)}/5
              </span>
            );
          },
        }),
        columnHelper.accessor("price", {
          id: "price",
          header: t("columns.price"),
          size: 130,
          enableSorting: true,
          cell: ({ getValue }) => (
            <span className={styles.price}>{formatPrice(getValue())}</span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "",
          size: 96,
          cell: () => (
            <div className={styles.actions}>
              <button
                className={styles.addButton}
                type="button"
                aria-label="Добавить"
              >
                +
              </button>
              <button
                className={styles.menuButton}
                type="button"
                aria-label="Меню"
              >
                <span className={styles.dots} />
              </button>
            </div>
          ),
        }),
      ] as Array<ColumnDef<ProductListItem, unknown>>,
    [t],
  );

  const [sortBy, order, q, skip] = searchParams
    ? [
        searchParams.get("sortBy") ?? undefined,
        searchParams.get("order") as "asc" | "desc",
        searchParams.get("q") ?? undefined,
        Number(searchParams.get("skip")),
      ]
    : [];

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: order === "desc" }]
    : [];

  const { data, isFetching, isPending } = useQuery({
    queryKey: ["products", { limit: LIMIT, skip, sortBy, order, q }],
    queryFn: () => fetchProducts({ limit: LIMIT, skip, sortBy, order, q }),
  });

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      const params = searchParams
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

      if (newSorting.length > 0) {
        params.set("sortBy", newSorting[0].id);
        params.set("order", newSorting[0].desc ? "desc" : "asc");
      } else {
        params.delete("sortBy");
        params.delete("order");
      }
      router.push({ pathname, query: Object.fromEntries(params.entries()) });
    },
    [searchParams, router, pathname],
  );

  return (
    <div className={styles.container}>
      <Table
        data={data?.products ?? []}
        columns={columns}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        getRowId={(row) => String(row.id)}
        loading={isPending || isFetching}
        skeleton={SKELETON_COLUMNS}
        skeletonLimit={LIMIT}
      />
    </div>
  );
}
