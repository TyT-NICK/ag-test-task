import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary";

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, "className"> & {
  variant?: Variant;
  className?: string;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(styles.button, styles[variant], className)}
      {...props}
    />
  );
}
