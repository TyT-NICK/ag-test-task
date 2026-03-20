"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactNode } from "react";
import styles from "./Tooltip.module.css";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
};

export function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={<span />} className={styles.trigger} delay={delay}>
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={8} className={styles.positioner}>
          <BaseTooltip.Popup className={styles.popup}>
            <BaseTooltip.Arrow className={styles.arrow} />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
