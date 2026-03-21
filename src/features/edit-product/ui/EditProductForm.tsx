import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  ProductFormFields,
  productBodySchema,
  type ProductBodyValues,
  type Product,
  type ProductsResponse,
} from "@/entities/product";
import useZodForm from "@/shared/lib/hooks/useZodForm";
import { useOptimisticMutation } from "@/shared/lib/hooks/useOptimisticMutation";
import { Button } from "@/shared/ui";
import styles from "./EditProductForm.module.css";
import { updateProduct } from "../api/updateProduct";

type EditProductFormProps = {
  product: Product;
  onClose: () => void;
};

const PRODUCTS_FILTER = { queryKey: ["products"] };

export function EditProductForm({ product, onClose }: EditProductFormProps) {
  const t = useTranslations("ProductForm");

  const { mutate, isPending } = useOptimisticMutation({
    mutationFn: (body: Partial<ProductBodyValues>) =>
      updateProduct(product.id, body),
    cacheUpdates: [
      {
        filters: PRODUCTS_FILTER,
        updater: (
          old: ProductsResponse | undefined,
          variables: Partial<ProductBodyValues>,
        ) =>
          old
            ? {
                ...old,
                products: old.products.map((p) =>
                  p.id === product.id ? { ...p, ...variables } : p,
                ),
              }
            : old,
      },
      {
        filters: { queryKey: ["product", product.id] },
        updater: (
          old: Product | undefined,
          variables: Partial<ProductBodyValues>,
        ) => (old ? { ...old, ...variables } : old),
      },
    ],
    onMutate: onClose,
    onSuccess: () => toast.success(t("editSuccess")),
    onError: () => toast.error(t("editError")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(productBodySchema, {
    defaultValues: {
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      brand: product.brand ?? "",
      category: product.category,
      description: product.description,
      stock: product.stock,
      thumbnail: product.thumbnail,
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((values) => mutate(values))}
      noValidate
    >
      <h2 className={styles.title}>{t("editTitle")}</h2>
      <ProductFormFields register={register} errors={errors} />
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {t("editSubmit")}
        </Button>
      </div>
    </form>
  );
}
