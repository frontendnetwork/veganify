import type { ButtonHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "default" | "sm" | "icon" | "icon-sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  size?: Size;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  danger: "bg-danger text-white hover:opacity-90 shadow-elev-1",
  ghost: "bg-transparent text-ink hover:bg-surface-2",
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-elev-1",
  secondary:
    "bg-surface text-ink border border-line-strong hover:bg-surface-2 shadow-elev-1",
};

const sizes: Record<Size, string> = {
  default: "h-11 px-5 gap-2 rounded-lg text-sm font-medium",
  icon: "size-11 rounded-lg",
  "icon-sm": "size-9 rounded-md",
  sm: "h-9 px-3.5 gap-1.5 rounded-md text-sm font-medium",
};

export function Button({
  className,
  variant = "primary",
  size = "default",
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "fluid-hover inline-flex select-none items-center justify-center whitespace-nowrap",
        "motion-safe:transition-transform motion-safe:active:scale-[0.96]",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      type={type}
      {...props}
    />
  );
}
