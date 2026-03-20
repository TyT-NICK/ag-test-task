"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "react-toastify";
import { productBodySchema } from "../model/schema";
import { addProduct } from "../api/productsApi";
import useZodForm from "@/shared/lib/hooks/useZodForm";
import { Button, Input } from "@/shared/ui";
import styles from "./AddProductForm.module.css";

const productFormSchema = productBodySchema.extend({
  price: z.coerce.number().positive(),
  stock: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number().int().min(0).optional(),
  ),
});

type ProductFormValues = z.output<typeof productFormSchema>;

type AddProductFormProps = {
  onClose: () => void;
};

export function AddProductForm({ onClose }: AddProductFormProps) {
  const t = useTranslations("AddProductForm");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("success"));
      onClose();
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(productFormSchema);

  function onSubmit(values: ProductFormValues) {
    mutate(values);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={styles.title}>{t("title")}</h2>
      <div className={styles.fields}>
        <Input
          label={t("fields.title")}
          error={errors.title?.message}
          className={styles.fullWidth}
          {...register("title")}
        />
        <Input
          label={t("fields.price")}
          type="number"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          label={t("fields.stock")}
          type="number"
          error={errors.stock?.message}
          {...register("stock")}
        />
        <Input
          label={t("fields.brand")}
          error={errors.brand?.message}
          {...register("brand")}
        />
        <Input
          label={t("fields.category")}
          error={errors.category?.message}
          {...register("category")}
        />
        <Input
          label={t("fields.description")}
          error={errors.description?.message}
          className={styles.fullWidth}
          {...register("description")}
        />
        <Input
          label={t("fields.thumbnail")}
          error={errors.thumbnail?.message}
          className={styles.fullWidth}
          {...register("thumbnail")}
        />
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}
