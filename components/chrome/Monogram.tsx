export default function Monogram({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M3 4v32M3 20h15M18 4v32" />
      <path d="M18 4h9.5a7.5 7.5 0 0 1 0 15H18M18 19.5h10.5a8.25 8.25 0 0 1 0 16.5H18" />
    </svg>
  );
}
