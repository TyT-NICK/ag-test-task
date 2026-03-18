"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ReactNode } from "react";
import styles from "./Popover.module.css";

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
};

export function Popover({ trigger, children }: PopoverProps) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        render={<span />}
        nativeButton={false}
        className={styles.trigger}
      >
        {trigger}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8}>
          <BasePopover.Popup className={styles.popup}>
            <BasePopover.Arrow className={styles.arrow} />
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
