"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { AnimatePresence, motion } from "motion/react";
import {
  forwardRef,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/cn";
import { EyeIcon, EyeOffIcon } from "@/shared/ui/icons";
import styles from "./Input.module.css";

type InputProps = Omit<
  ComponentProps<typeof BaseInput>,
  "type" | "className"
> & {
  className?: string;
  label?: string;
  error?: string;
  icon?: ReactNode;
  type?: ComponentProps<"input">["type"];
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, icon, type, className, id, placeholder, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasLabel = !!label;

  return (
    <div
      className={cn(styles.root, hasLabel && styles.rootWithLabel, className)}
      data-has-icon={icon ? "" : undefined}
    >
      <div
        className={cn(styles.inputWrapper, error && styles.inputWrapperError)}
      >
        {icon && <span className={styles.iconLeft}>{icon}</span>}
        <div
          className={cn(styles.inputInner, !!icon && styles.inputInnerWithIcon)}
        >
          <BaseInput
            id={inputId}
            ref={ref}
            type={resolvedType}
            className={styles.input}
            placeholder={hasLabel ? " " : placeholder}
            data-disabled={props.disabled || undefined}
            {...props}
          />
        </div>
        {isPassword && (
          <button
            type="button"
            className={styles.iconRight}
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {hasLabel && (
        <label
          htmlFor={inputId}
          className={cn(
            styles.floatingLabel,
            error && styles.floatingLabelError,
          )}
        >
          {label}
        </label>
      )}
      <AnimatePresence>
        {error && (
          <motion.div
            className={styles.errorContainer}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <motion.span
              className={styles.errorMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              {error}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
