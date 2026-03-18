"use client";

import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { loginCredentialsSchema } from "@/entities/session";
import useZodForm from "@/shared/lib/hooks/useZodForm";
import { Button, Checkbox, Input, Logo, Paper, UserIcon } from "@/shared/ui";
import styles from "./LoginForm.module.css";

const loginFormSchema = loginCredentialsSchema.extend({
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.output<typeof loginFormSchema>;

export function LoginForm() {
  const t = useTranslations("LoginForm");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useZodForm(loginFormSchema, {
    defaultValues: { username: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    const { rememberMe: _rememberMe, ...credentials } = values;
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  }

  return (
    <Paper className={styles.card}>
      <Logo size="md" />
      <div className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.inputs}>
          <Input
            label={t("username")}
            icon={<UserIcon />}
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label={t("password")}
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Checkbox
              label={t("rememberMe")}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {t("submit")}
        </Button>
      </form>
      <div className={styles.separator}>
        <hr className={styles.hr} />
        <span className={styles.separatorText}>{t("or")}</span>
        <hr className={styles.hr} />
      </div>
      <p className={styles.footer}>
        {t("noAccount")}{" "}
        <span className={styles.createLink}>{t("createAccount")}</span>
      </p>
    </Paper>
  );
}
