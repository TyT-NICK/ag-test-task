import { Select as BaseSelect } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "@/shared/ui/icons";
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
            <ChevronDownIcon />
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
