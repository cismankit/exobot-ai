import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";

export const SelectField = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    options: { value: string; label: string }[];
  }
>(({ label, error, options, className, id, ...props }, ref) => {
  const fieldId = id ?? props.name;

  return (
    <label className="block space-y-2 text-sm text-text-muted" htmlFor={fieldId}>
      <span className="text-text-main">{label}</span>
      <select
        ref={ref}
        id={fieldId}
        className={cn(
          "w-full rounded-xl border border-line/80 bg-surface-soft/80 px-3 py-3 text-sm text-text-main outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/30",
          error && "border-warning/70 focus:ring-warning/30",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-warning">{error}</p> : null}
    </label>
  );
});

SelectField.displayName = "SelectField";
