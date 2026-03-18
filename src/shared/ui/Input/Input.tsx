"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import {
  forwardRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./Input.module.css";

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

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
  { label, error, icon, type, className, id, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.root}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={cn(styles.inputWrapper, error && styles.inputWrapperError)}
      >
        {icon && <span className={styles.iconLeft}>{icon}</span>}
        <BaseInput
          id={id}
          ref={ref}
          type={resolvedType}
          className={cn(
            styles.input,
            !!icon && styles.inputWithIcon,
            className,
          )}
          {...props}
        />
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
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});
