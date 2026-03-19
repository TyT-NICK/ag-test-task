import tableStyles from "./Table.module.css";
import styles from "./TableSkeleton.module.css";

export interface SkeletonColumn {
  /** Cell (th/td) width in px */
  cellWidth?: number;
  /** Skeleton bar width inside the cell */
  barWidth?: number | string;
  /** Skeleton bar height in px (default 14) */
  barHeight?: number;
  /** Bar border-radius in px (default 4) */
  barRadius?: number;
}

export interface TableSkeletonProps {
  columns: SkeletonColumn[];
  limit?: number;
}

export function TableSkeleton({ columns, limit = 10 }: TableSkeletonProps) {
  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr className={tableStyles.headerRow}>
            {columns.map((col, i) => (
              <th
                key={i}
                className={tableStyles.th}
                style={col.cellWidth ? { width: col.cellWidth } : undefined}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: limit }).map((_, row) => (
            <tr key={row} className={tableStyles.row}>
              {columns.map((col, col_i) => (
                <td
                  key={col_i}
                  className={tableStyles.td}
                  style={
                    col.cellWidth ? { width: col.cellWidth } : undefined
                  }
                >
                  <div
                    className={styles.bar}
                    style={{
                      width: col.barWidth ?? "80%",
                      height: col.barHeight ?? 14,
                      borderRadius: col.barRadius ?? 4,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
