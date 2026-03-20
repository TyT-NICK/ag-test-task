export function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <path d="M10 6v8M6 10h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
