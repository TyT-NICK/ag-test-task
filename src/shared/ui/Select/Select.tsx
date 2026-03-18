import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "@/shared/lib/cn";
import styles from "./Select.module.css";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
};

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.293 5.293a1 1 0 0 1 1.414 0L8 7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
    >
      <path d="M10.293 2.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L5 7.586l5.293-5.293z" />
    </svg>
  );
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder,
  label,
  disabled,
  className,
}: SelectProps) {
  return (
    <div className={cn(styles.root, className)}>
      {label && <span className={styles.label}>{label}</span>}
      <BaseSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <BaseSelect.Trigger className={styles.trigger}>
          <BaseSelect.Value
            placeholder={placeholder}
            className={styles.value}
          />
          <BaseSelect.Icon className={styles.icon}>
            <ChevronIcon />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4}>
            <BaseSelect.Popup className={styles.popup}>
              <BaseSelect.List className={styles.list}>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    value={option.value}
                    className={styles.item}
                  >
                    <BaseSelect.ItemIndicator className={styles.itemIndicator}>
                      <CheckIcon />
                    </BaseSelect.ItemIndicator>
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
