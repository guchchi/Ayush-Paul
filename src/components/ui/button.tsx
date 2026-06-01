import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold tracking-wide uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-black hover:bg-brand-primary/90 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-brand-primary/30 bg-transparent hover:bg-brand-primary/10 hover:border-brand-primary text-white hover:text-brand-primary shadow-[inset_0_0_10px_rgba(0,255,255,0)] hover:shadow-[inset_0_0_15px_rgba(0,255,255,0.2),0_0_15px_rgba(0,255,255,0.2)]",
        secondary:
          "bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 hover:text-white",
        ghost: "text-white/40 hover:text-brand-primary hover:bg-brand-primary/5",
        link: "text-brand-primary underline-offset-4 hover:underline lowercase",
        premium: "bg-brand-primary text-black hover:bg-brand-primary/90 shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98]",
        ghostCTA: "bg-brand-primary/5 border border-brand-primary/20 hover:border-brand-primary text-brand-primary hover:text-white backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-12 w-12 rounded-xl",
        cta: "w-full sm:w-auto h-14 px-10 rounded-2xl text-sm tracking-widest",
      },
    },
    defaultVariants: {
      variant: "default",
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
