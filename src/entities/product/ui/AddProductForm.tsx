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
  price: z.coerce.number({ error: "invalidNumber" }).positive("positive"),
  stock: z.coerce
    .number({ error: "invalidNumber" })
    .int("integer")
    .min(0, "minValue")
    .optional(),
});

type ProductFormValues = z.output<typeof productFormSchema>;

type AddProductFormProps = {
  onClose: () => void;
};

export function AddProductForm({ onClose }: AddProductFormProps) {
  const t = useTranslations("AddProductForm");
  const tV = useTranslations("validation");
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
          error={
            errors.title?.message &&
            tV(errors.title.message as Parameters<typeof tV>[0])
          }
          className={styles.fullWidth}
          {...register("title")}
        />
        <Input
          label={t("fields.price")}
          type="text"
          error={
            errors.price?.message &&
            tV(errors.price.message as Parameters<typeof tV>[0])
          }
          {...register("price")}
        />
        <Input
          label={t("fields.stock")}
          type="text"
          error={
            errors.stock?.message &&
            tV(errors.stock.message as Parameters<typeof tV>[0])
          }
          {...register("stock")}
        />
        <Input
          label={t("fields.brand")}
          error={
            errors.brand?.message &&
            tV(errors.brand.message as Parameters<typeof tV>[0])
          }
          {...register("brand")}
        />
        <Input
          label={t("fields.category")}
          error={
            errors.category?.message &&
            tV(errors.category.message as Parameters<typeof tV>[0])
          }
          {...register("category")}
        />
        <Input
          label={t("fields.description")}
          error={
            errors.description?.message &&
            tV(errors.description.message as Parameters<typeof tV>[0])
          }
          className={styles.fullWidth}
          {...register("description")}
        />
        <Input
          label={t("fields.thumbnail")}
          error={
            errors.thumbnail?.message &&
            tV(errors.thumbnail.message as Parameters<typeof tV>[0])
          }
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
