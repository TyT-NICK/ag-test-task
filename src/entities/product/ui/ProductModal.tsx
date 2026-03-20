"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Product } from "../model/types";
import { Rating } from "@/shared/ui";
import styles from "./ProductModal.module.css";

type ProductModalProps = {
  product: Product;
};

export function ProductModal({ product }: ProductModalProps) {
  const t = useTranslations("ProductModal");

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={80}
          height={80}
          className={styles.thumbnail}
        />
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{product.title}</h2>
          <div className={styles.meta}>
            {product.brand && <span className={styles.brand}>{product.brand}</span>}
            <span className={styles.category}>{product.category}</span>
          </div>
          <Rating value={product.rating} />
        </div>
      </div>

      {product.description && (
        <p className={styles.description}>{product.description}</p>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("price")}</span>
          <span className={styles.statValue}>{product.price} ₽</span>
        </div>
        {product.discountPercentage > 0 && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t("discount")}</span>
            <span className={styles.statValue}>{product.discountPercentage}%</span>
          </div>
        )}
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("stock")}</span>
          <span className={styles.statValue}>{product.stock}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("sku")}</span>
          <span className={styles.statValue}>{product.sku}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("status")}</span>
          <span className={styles.statValue}>{product.availabilityStatus}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t("weight")}</span>
          <span className={styles.statValue}>{product.weight} kg</span>
        </div>
      </div>

      {product.tags.length > 0 && (
        <div className={styles.tags}>
          {product.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      <div className={styles.policies}>
        <div className={styles.policy}>
          <span className={styles.policyLabel}>{t("warranty")}</span>
          <span className={styles.policyValue}>{product.warrantyInformation}</span>
        </div>
        <div className={styles.policy}>
          <span className={styles.policyLabel}>{t("shipping")}</span>
          <span className={styles.policyValue}>{product.shippingInformation}</span>
        </div>
        <div className={styles.policy}>
          <span className={styles.policyLabel}>{t("returnPolicy")}</span>
          <span className={styles.policyValue}>{product.returnPolicy}</span>
        </div>
      </div>
    </div>
  );
}
