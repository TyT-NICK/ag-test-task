import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "react-toastify";
import { productBodySchema } from "../model/schema";
import { addProduct, updateProduct } from "../api/productsApi";
import type {
  Product,
  ProductListItem,
  ProductsResponse,
} from "../model/types";
import useZodForm from "@/shared/lib/hooks/useZodForm";
import { useOptimisticMutation } from "@/shared/lib/hooks/useOptimisticMutation";
import { Button, Input } from "@/shared/ui";
import styles from "./ProductForm.module.css";

const productFormSchema = productBodySchema.extend({
  price: z.coerce.number({ error: "invalidNumber" }).positive("positive"),
  discountPercentage: z.coerce
    .number({ error: "invalidNumber" })
    .min(0, "minValue")
    .max(100, "maxValue")
    .optional(),
  stock: z.coerce
    .number({ error: "invalidNumber" })
    .int("integer")
    .min(0, "minValue")
    .optional(),
});

type ProductFormValues = z.output<typeof productFormSchema>;

type ProductFormProps = {
  onClose: () => void;
  product?: Product;
};

const PRODUCTS_FILTER = { queryKey: ["products"] };

export function ProductForm({ onClose, product }: ProductFormProps) {
  const t = useTranslations("ProductForm");
  const tV = useTranslations("validation");
  const isEditing = product !== undefined;

  const { mutate: add, isPending: isAdding } = useOptimisticMutation({
    mutationFn: addProduct,
    cacheUpdates: [
      {
        filters: PRODUCTS_FILTER,
        updater: (
          old: ProductsResponse | undefined,
          variables: ProductFormValues,
        ) =>
          old
            ? {
                ...old,
                total: old.total + 1,
                products: [
                  {
                    id: Date.now(),
                    sku: "",
                    rating: 0,
                    category: "",
                    thumbnail: "",
                    discountPercentage: 0,
                    ...variables,
                  } satisfies ProductListItem,
                  ...old.products,
                ],
              }
            : old,
      },
    ],
    onSuccess: () => {
      toast.success(t("addSuccess"));
      onClose();
    },
    onError: () => toast.error(t("addError")),
  });

  const { mutate: edit, isPending: isEditing_ } = useOptimisticMutation({
    mutationFn: (body: Partial<ProductFormValues>) =>
      updateProduct(product!.id, body),
    cacheUpdates: [
      {
        filters: PRODUCTS_FILTER,
        updater: (
          old: ProductsResponse | undefined,
          variables: Partial<ProductFormValues>,
        ) =>
          old
            ? {
                ...old,
                products: old.products.map((p) =>
                  p.id === product!.id ? { ...p, ...variables } : p,
                ),
              }
            : old,
      },
      {
        filters: { queryKey: ["product", product?.id] },
        updater: (
          old: Product | undefined,
          variables: Partial<ProductFormValues>,
        ) => (old ? { ...old, ...variables } : old),
      },
    ],
    onMutate: onClose,
    onSuccess: () => toast.success(t("editSuccess")),
    onError: () => toast.error(t("editError")),
  });

  const isPending = isAdding || isEditing_;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(productFormSchema, {
    defaultValues: product
      ? {
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          brand: product.brand ?? "",
          category: product.category,
          description: product.description,
          stock: product.stock,
          thumbnail: product.thumbnail,
        }
      : undefined,
  });

  function onSubmit(values: ProductFormValues) {
    if (isEditing) {
      edit(values);
    } else {
      add(values);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={styles.title}>
        {isEditing ? t("editTitle") : t("addTitle")}
      </h2>
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
          label={t("fields.discountPercentage")}
          type="text"
          error={
            errors.discountPercentage?.message &&
            tV(errors.discountPercentage.message as Parameters<typeof tV>[0])
          }
          {...register("discountPercentage")}
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
          {isEditing ? t("editSubmit") : t("addSubmit")}
        </Button>
      </div>
    </form>
  );
}
