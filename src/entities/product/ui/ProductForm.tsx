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
  price: z.coerce.number().positive(),
  stock: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number().int().min(0).optional(),
  ),
});

type ProductFormValues = z.output<typeof productFormSchema>;

type ProductFormProps = {
  onClose: () => void;
  product?: Product;
};

const PRODUCTS_FILTER = { queryKey: ["products"] };

export function ProductForm({ onClose, product }: ProductFormProps) {
  const t = useTranslations("ProductForm");
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
          {isEditing ? t("editSubmit") : t("addSubmit")}
        </Button>
      </div>
    </form>
  );
}
