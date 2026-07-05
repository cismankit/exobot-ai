/** Crisp inline logo mark — a docked-node glyph in signal green.
 * Vector so it stays sharp at any DPI (the raster brand lockups are a
 * wide aspect ratio that squashes in a square slot). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      role="presentation"
    >
      <rect
        x="4.5"
        y="2.5"
        width="15"
        height="19"
        rx="3"
        stroke="var(--signal)"
        strokeWidth="1.6"
      />
      <circle cx="9" cy="9" r="1.6" fill="var(--signal)" />
      <circle cx="15" cy="9" r="1.6" fill="var(--signal)" />
      <path
        d="M9 14.5h6"
        stroke="var(--signal)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
