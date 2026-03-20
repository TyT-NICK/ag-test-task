import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { Paper } from "@/shared/ui/Paper";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

const TRANSITION = { duration: 0.2, ease: "easeOut" } as const;

export function Modal({ open, onOpenChange, children }: ModalProps) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          onClick={() => onOpenChange(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITION}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={TRANSITION}
          >
            <Paper className={styles.popup}>{children}</Paper>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
