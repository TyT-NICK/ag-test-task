import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  productBodySchema,
  ProductFormFields,
  type ProductBodyValues,
  type ProductListItem,
  type ProductsResponse,
} from "@/entities/product";
import useZodForm from "@/shared/lib/hooks/useZodForm";
import { useOptimisticMutation } from "@/shared/lib/hooks/useOptimisticMutation";
import { Button } from "@/shared/ui";
import styles from "./AddProductForm.module.css";
import { addProduct } from "../api/addProduct";

type AddProductFormProps = {
  onClose: () => void;
};

const PRODUCTS_FILTER = { queryKey: ["products"] };

export function AddProductForm({ onClose }: AddProductFormProps) {
  const t = useTranslations("ProductForm");

  const { mutate, isPending } = useOptimisticMutation({
    mutationFn: addProduct,
    cacheUpdates: [
      {
        filters: PRODUCTS_FILTER,
        updater: (
          old: ProductsResponse | undefined,
          variables: ProductBodyValues,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(productBodySchema);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((values) => mutate(values))}
      noValidate
    >
      <h2 className={styles.title}>{t("addTitle")}</h2>
      <ProductFormFields register={register} errors={errors} />
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {t("addSubmit")}
        </Button>
      </div>
    </form>
  );
}
