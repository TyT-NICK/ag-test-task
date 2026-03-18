import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./Paper.module.css";

type PaperProps = ComponentProps<"div">;

export function Paper({ className, children, ...props }: PaperProps) {
  return (
    <div className={cn(styles.paper, className)} {...props}>
      {children}
    </div>
  );
}
