"use client";

import {
  type ColumnDef,
  type Column,
  type SortingState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/shared/ui/Checkbox";
import { cn } from "@/shared/lib/cn";
import type { SkeletonColumn } from "./TableSkeleton";
import styles from "./Table.module.css";
import skeletonStyles from "./TableSkeleton.module.css";

const ALIGN_TO_JUSTIFY = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getColumnStyle(column: Column<any, unknown>): React.CSSProperties {
  const { meta } = column.columnDef;
  return {
    ...(!meta?.flex && { width: column.getSize() }),
    ...(meta?.align && { textAlign: meta.align }),
  };
}

function getHeaderContentStyle(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, unknown>,
): React.CSSProperties | undefined {
  const align = column.columnDef.meta?.align;
  if (!align) return undefined;
  return { justifyContent: ALIGN_TO_JUSTIFY[align] };
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      className={styles.sortIcon}
      aria-hidden
    >
      <path
        d="M4 0L7.4641 4.5H0.535898L4 0Z"
        fill={sorted === "asc" ? "#242edb" : "#c9c9c9"}
      />
      <path
        d="M4 12L0.535898 7.5H7.4641L4 12Z"
        fill={sorted === "desc" ? "#242edb" : "#c9c9c9"}
      />
    </svg>
  );
}

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  onSelectChange?: (ids: Set<string>) => void;
  onRowMouseEnter?: (row: TData) => void;
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string;
  loading?: boolean;
  skeleton?: SkeletonColumn[];
  skeletonLimit?: number;
}

export function Table<TData>({
  data,
  columns,
  sorting = [],
  onSortingChange,
  onSelectChange,
  onRowMouseEnter,
  onRowClick,
  getRowId,
  loading,
  skeleton,
  skeletonLimit = 10,
}: TableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (!onSelectChange) return;
    const ids = new Set(
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([id]) => id),
    );
    onSelectChange(ids);
  }, [rowSelection, onSelectChange]);

  const selectionColumn: ColumnDef<TData, unknown> = useMemo(
    () => ({
      id: "__select__",
      size: 44,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={
            table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onCheckedChange={() => table.toggleAllRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={() => row.toggleSelected()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    }),
    [],
  );

  const allColumns = useMemo(
    () => [selectionColumn, ...columns],
    [selectionColumn, columns],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    getRowId,
  });

  const leafColumns = table.getAllLeafColumns();
  const t = useTranslations("common");

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.headerRow}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    styles.th,
                    header.column.id === "__select__" && styles.selectCell,
                    header.column.getCanSort() && styles.thSortable,
                    header.column.getIsSorted() && styles.thSorted,
                  )}
                  style={getColumnStyle(header.column)}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span
                    className={styles.thContent}
                    style={getHeaderContentStyle(header.column)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanSort() && (
                      <SortIcon sorted={header.column.getIsSorted()} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonLimit }).map((_, rowIdx) => (
              <tr key={`sk-${rowIdx}`} className={styles.row}>
                {leafColumns.map((col, colIdx) => {
                  const skCol = skeleton?.[colIdx];
                  return (
                    <td
                      key={col.id}
                      className={cn(
                        styles.td,
                        col.id === "__select__" && styles.selectCell,
                      )}
                    >
                      <div
                        className={skeletonStyles.bar}
                        style={{
                          width: skCol?.barWidth ?? "80%",
                          height: skCol?.barHeight ?? 14,
                          borderRadius: skCol?.barRadius ?? 4,
                          marginLeft:
                            skCol?.align === "right" ||
                            skCol?.align === "center"
                              ? "auto"
                              : undefined,
                          marginRight:
                            skCol?.align === "center" ? "auto" : undefined,
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr className={styles.row}>
              <td
                colSpan={leafColumns.length}
                className={cn(styles.td, styles.emptyCell)}
              >
                {t("nothingFound")}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  styles.row,
                  row.getIsSelected() && styles.rowSelected,
                  onRowClick && styles.rowClickable,
                )}
                onMouseEnter={
                  onRowMouseEnter
                    ? () => onRowMouseEnter(row.original)
                    : undefined
                }
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      styles.td,
                      cell.column.id === "__select__" && styles.selectCell,
                    )}
                    style={getColumnStyle(cell.column)}
                    onClick={
                      cell.column.id === "__select__"
                        ? (e) => e.stopPropagation()
                        : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
