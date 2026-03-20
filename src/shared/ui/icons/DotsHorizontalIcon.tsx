export function DotsHorizontalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="2" cy="8" r="2" />
      <circle cx="8" cy="8" r="2" />
      <circle cx="14" cy="8" r="2" />
    </svg>
  );
}
