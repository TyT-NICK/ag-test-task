import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // TData and TValue are required by the interface signature but unused here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Column takes all remaining width instead of a fixed size. */
    flex?: boolean;
    /** Text alignment for both the header and body cells of this column. */
    align?: "left" | "center" | "right";
  }
}
