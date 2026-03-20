import styles from "./Price.module.css";

type PriceProps = {
  price: number;
  discountPercentage: number;
};

const fmt = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function splitPrice(value: number): [string, string] {
  const parts = fmt.formatToParts(value);
  const decimalIndex = parts.findIndex((p) => p.type === "decimal");
  const whole = parts.slice(0, decimalIndex).map((p) => p.value).join("");
  const fraction = parts.slice(decimalIndex).map((p) => p.value).join("");
  return [whole, fraction];
}

export function Price({ price, discountPercentage }: PriceProps) {
  const original = Math.round(price / (1 - discountPercentage / 100));
  const [whole, fraction] = splitPrice(price);

  return (
    <span className={styles.root}>
      {Boolean(discountPercentage) && (
        <span className={styles.original}>{fmt.format(original)}</span>
      )}
      <span>
        {whole}
        <span className={styles.fraction}>{fraction}</span>
      </span>
    </span>
  );
}
