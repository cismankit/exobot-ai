import * as React from "react";
import { cn } from "./cn";

type Variant = "signal" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  signal:
    "bg-signal text-bg font-semibold hover:shadow-signal hover:brightness-110 active:brightness-95",
  ghost: "bg-transparent text-fg hover:bg-surface-2",
  danger:
    "bg-danger text-bg font-semibold hover:shadow-danger hover:brightness-110",
  outline:
    "border border-line bg-transparent text-fg hover:border-signal hover:text-signal",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-5 text-sm rounded-lg",
  lg: "h-12 px-7 text-base rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "signal", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-150 disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
