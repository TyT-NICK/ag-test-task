import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./Checkbox.module.css";

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
      <rect width="10" height="2" rx="1" />
    </svg>
  );
}

type CheckboxProps = Omit<
  ComponentProps<typeof BaseCheckbox.Root>,
  "className"
> & {
  label?: string;
  error?: string;
};

export function Checkbox({
  label,
  error,
  id,
  indeterminate,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <div className={styles.root}>
      <label className={cn(styles.label, disabled && styles.labelDisabled)}>
        <BaseCheckbox.Root
          id={id}
          indeterminate={indeterminate}
          disabled={disabled}
          className={cn(styles.checkbox, error && styles.checkboxError)}
          {...props}
        >
          <BaseCheckbox.Indicator className={styles.indicator}>
            {indeterminate ? <DashIcon /> : <CheckIcon />}
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
