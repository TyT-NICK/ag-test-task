import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui";
import styles from "./ProductFormFields.module.css";
import { ProductBodyValues } from "../model/schema";

type Props = {
  register: UseFormRegister<ProductBodyValues>;
  errors: FieldErrors<ProductBodyValues>;
};

export function ProductFormFields({ register, errors }: Props) {
  const t = useTranslations("ProductForm");
  const tV = useTranslations("validation");

  function err(message: string | undefined) {
    return message ? tV(message) : undefined;
  }

  return (
    <div className={styles.fields}>
      <Input
        label={t("fields.title")}
        error={err(errors.title?.message)}
        className={styles.fullWidth}
        {...register("title")}
      />
      <Input
        label={t("fields.price")}
        type="text"
        error={err(errors.price?.message)}
        {...register("price")}
      />
      <Input
        label={t("fields.discountPercentage")}
        type="text"
        error={err(errors.discountPercentage?.message)}
        {...register("discountPercentage")}
      />
      <Input
        label={t("fields.stock")}
        type="text"
        error={err(errors.stock?.message)}
        {...register("stock")}
      />
      <Input
        label={t("fields.brand")}
        error={err(errors.brand?.message)}
        {...register("brand")}
      />
      <Input
        label={t("fields.category")}
        error={err(errors.category?.message)}
        {...register("category")}
      />
      <Input
        label={t("fields.description")}
        error={err(errors.description?.message)}
        className={styles.fullWidth}
        {...register("description")}
      />
      <Input
        label={t("fields.thumbnail")}
        error={err(errors.thumbnail?.message)}
        className={styles.fullWidth}
        {...register("thumbnail")}
      />
    </div>
  );
}
