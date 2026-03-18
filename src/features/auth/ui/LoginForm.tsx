"use client";

import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/shared/i18n/navigation";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { loginApi } from "../api/loginApi";
import { loginCredentialsSchema } from "@/entities/session";
import useZodForm from "@/shared/lib/hooks/useZodForm";
import {
  Button,
  Checkbox,
  Input,
  Logo,
  Paper,
  Popover,
  UserIcon,
} from "@/shared/ui";
import popoverStyles from "@/shared/ui/Popover/Popover.module.css";
import styles from "./LoginForm.module.css";

const loginFormSchema = loginCredentialsSchema.extend({
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.output<typeof loginFormSchema>;

export function LoginForm() {
  const t = useTranslations("LoginForm");
  const router = useRouter();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => router.replace("/"),
    onError: (error) => {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const key =
        status === 401
          ? "errors.invalidCredentials"
          : status === 503
            ? "errors.serviceUnavailable"
            : "errors.default";
      toast.error(t(key));
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useZodForm(loginFormSchema, {
    defaultValues: { username: "", password: "", rememberMe: false },
  });

  function onSubmit(values: LoginFormValues) {
    console.log("submit");
    login(values);
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
        <Button type="submit" variant="primary" disabled={isPending}>
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
        <Popover
          trigger={
            <span className={styles.createLink}>{t("createAccount")}</span>
          }
        >
          {t("createAccountPopover")}{" "}
          <a
            href="https://dummyjson.com/users"
            target="_blank"
            rel="noopener noreferrer"
            className={popoverStyles.link}
          >
            dummyjson.com/users
          </a>
          <br />
          <span style={{ opacity: 0.6 }}>{t("createAccountPopoverHint")}</span>
        </Popover>
      </p>
    </Paper>
  );
}
