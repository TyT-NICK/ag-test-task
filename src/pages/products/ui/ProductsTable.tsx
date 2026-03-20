"use client";

import { useCallback, useMemo, useState } from "react";
import { useIdlePrefetch } from "@/shared/lib/hooks/useIdlePrefetch";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { Table } from "@/shared/ui/Table";
import type { SkeletonColumn } from "@/shared/ui/Table";
import { Button, Modal, Pagination, PaginationInfo, Rating } from "@/shared/ui";
import { DotsHorizontalIcon, PlusIcon, RefreshIcon } from "@/shared/ui/icons";
import {
  fetchProduct,
  fetchProducts,
  Price,
  ProductForm,
  ProductModal,
} from "@/entities/product";
import type { ProductListItem } from "@/entities/product";
import styles from "./ProductsTable.module.css";
import Image from "next/image";

const LIMIT = 20;

const COLUMN_SIZES = {
  checkbox: 44,
  thumbnail: 68,
  brand: 240,
  sku: 190,
  rating: 120,
  price: 140,
  actions: 96,
} as const;

const COLUMN_ALIGNS = {
  rating: "center",
  price: "right",
} as const satisfies Partial<Record<string, SkeletonColumn["align"]>>;

const SKELETON_COLUMNS: SkeletonColumn[] = [
  {
    cellWidth: COLUMN_SIZES.checkbox,
    barWidth: 18,
    barHeight: 18,
    barRadius: 4,
  },
  {
    cellWidth: COLUMN_SIZES.thumbnail,
    barWidth: 36,
    barHeight: 36,
    barRadius: 6,
  },
  { barWidth: "55%" },
  { cellWidth: COLUMN_SIZES.brand, barWidth: "60%" },
  { cellWidth: COLUMN_SIZES.sku, barWidth: "70%" },
  {
    cellWidth: COLUMN_SIZES.rating,
    barWidth: "50%",
    align: COLUMN_ALIGNS.rating,
  },
  {
    cellWidth: COLUMN_SIZES.price,
    barWidth: "55%",
    align: COLUMN_ALIGNS.price,
  },
  { cellWidth: COLUMN_SIZES.actions, barWidth: 64 },
];

const columnHelper = createColumnHelper<ProductListItem>();

export function ProductsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("ProductsTable");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [viewProductId, setViewProductId] = useState<number | null>(null);

  const handleCloseAdd = useCallback(() => setIsAddOpen(false), []);
  const handleCloseEdit = useCallback(() => setEditProductId(null), []);

  const { data: editProduct } = useQuery({
    queryKey: ["product", editProductId],
    queryFn: () => fetchProduct(editProductId!),
    enabled: editProductId !== null,
  });

  const { data: viewProduct } = useQuery({
    queryKey: ["product", viewProductId],
    queryFn: () => fetchProduct(viewProductId!),
    enabled: viewProductId !== null,
  });

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("thumbnail", {
          id: "thumbnail",
          header: "",
          size: COLUMN_SIZES.thumbnail,
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
          meta: { flex: true },
          cell: ({ getValue, row }) => (
            <div className={styles.titleCell}>
              <span className={styles.titleText}>{getValue()}</span>
              <span className={styles.categoryText}>
                {row.original.category}
              </span>
            </div>
          ),
        }),
        columnHelper.accessor("brand", {
          id: "brand",
          header: t("columns.brand"),
          size: COLUMN_SIZES.brand,
          enableSorting: false,
          cell: ({ getValue }) => (
            <span className={styles.brand}>
              {getValue() || tCommon("notSpecified")}
            </span>
          ),
        }),
        columnHelper.accessor("sku", {
          id: "sku",
          header: t("columns.sku"),
          size: COLUMN_SIZES.sku,
          enableSorting: false,
          cell: ({ getValue }) => (
            <span className={styles.sku}>{getValue()}</span>
          ),
        }),
        columnHelper.accessor("rating", {
          id: "rating",
          header: t("columns.rating"),
          size: COLUMN_SIZES.rating,
          enableSorting: true,
          meta: { align: COLUMN_ALIGNS.rating },
          cell: ({ getValue }) => <Rating value={getValue()} />,
        }),
        columnHelper.accessor("price", {
          id: "price",
          header: t("columns.price"),
          size: COLUMN_SIZES.price,
          enableSorting: true,
          meta: { align: COLUMN_ALIGNS.price },
          cell: ({ row }) => (
            <Price
              price={row.original.price}
              discountPercentage={row.original.discountPercentage}
            />
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "",
          size: COLUMN_SIZES.actions,
          cell: ({ row }) => (
            <div className={styles.actions}>
              <Button
                variant="secondary"
                rounded
                aria-label={t("editProduct")}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditProductId(row.original.id);
                }}
              >
                <DotsHorizontalIcon size={12} />
              </Button>
            </div>
          ),
        }),
      ] as Array<ColumnDef<ProductListItem, unknown>>,
    [t, tCommon],
  );

  const [sortBy, order, q, page] = searchParams
    ? [
        searchParams.get("sortBy") ?? undefined,
        searchParams.get("order") as "asc" | "desc",
        searchParams.get("q") ?? undefined,
        Math.max(1, Number(searchParams.get("page") ?? 1)),
      ]
    : [];

  const skip = ((page ?? 1) - 1) * LIMIT;

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: order === "desc" }]
    : [];

  const { data, isFetching, isPending } = useQuery({
    queryKey: ["products", { page: page ?? 1, sortBy, order, q }],
    queryFn: () => fetchProducts({ limit: LIMIT, skip, sortBy, order, q }),
    placeholderData: keepPreviousData,
  });

  useIdlePrefetch(
    data?.products,
    useCallback(
      (product) => ({
        queryKey: ["product", product.id] as const,
        queryFn: () => fetchProduct(product.id),
      }),
      [],
    ),
  );

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [queryClient]);

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

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(skip + LIMIT, total);

  return (
    <>
      <Modal open={isAddOpen} onOpenChange={setIsAddOpen}>
        <ProductForm onClose={handleCloseAdd} />
      </Modal>
      <Modal
        open={editProductId !== null}
        onOpenChange={(open) => !open && setEditProductId(null)}
      >
        {editProduct && (
          <ProductForm product={editProduct} onClose={handleCloseEdit} />
        )}
      </Modal>
      <Modal
        open={viewProductId !== null}
        onOpenChange={(open) => !open && setViewProductId(null)}
      >
        {viewProduct && <ProductModal product={viewProduct} />}
      </Modal>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("title")}</h2>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            rounded
            aria-label={t("refresh")}
            onClick={handleRefresh}
          >
            <RefreshIcon size={12} />
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <PlusIcon />
            {t("addProduct")}
          </Button>
        </div>
      </div>
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
          onRowClick={(row) => setViewProductId(row.id)}
        />
      </div>
      <div
        className={styles.footer}
        style={isPending ? { visibility: "hidden" } : undefined}
      >
        <PaginationInfo from={from} to={to} total={total} />
        <Pagination total={total} limit={LIMIT} loading={isFetching} />
      </div>
    </>
  );
}
