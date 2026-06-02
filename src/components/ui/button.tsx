import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

/**
 * UNIFIED BUTTON SYSTEM
 * Two variants: primary (filled cyan) | secondary (ghost gradient-border)
 * Three sizes:  sm | default | lg
 * Shape: rounded-full (pill) — consistent everywhere
 * Motion: hover lift + active scale on both variants
 */
const buttonVariants = cva(
  // Base — shared across all variants and sizes
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-full",
    "font-extrabold text-xs uppercase tracking-widest",
    "whitespace-nowrap",
    "cursor-pointer select-none",
    "transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        /**
         * PRIMARY — filled cyan pill
         * Use for: main CTAs, "Build", "Join", "Access", "Initiate"
         */
        primary: [
          "bg-brand-primary text-black",
          "shadow-[0_0_20px_rgba(0,245,255,0.18)]",
          "hover:bg-[color-mix(in_srgb,var(--color-brand-primary)_88%,white)]",
          "hover:shadow-[0_0_35px_rgba(0,245,255,0.38)]",
        ].join(" "),

        /**
         * SECONDARY — ghost pill with gradient border
         * Use for: supporting actions, "Learn More", "Explore", "View Docs"
         */
        secondary: [
          "bg-transparent text-white",
          "border border-white/15",
          "hover:border-brand-primary/60 hover:text-brand-primary",
          "hover:shadow-[0_0_18px_rgba(0,245,255,0.10)]",
        ].join(" "),
      },

      size: {
        sm:      "h-9  px-5  text-[10px]",
        default: "h-11 px-7  text-[11px]",
        lg:      "h-13 px-10 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
