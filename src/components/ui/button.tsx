import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold tracking-wide uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/90 shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20 text-white/80 hover:text-white",
        secondary:
          "bg-white/5 border border-white/5 text-white/60 hover:bg-white/10 hover:text-white",
        ghost: "text-white/40 hover:text-white hover:bg-white/5",
        link: "text-brand-primary underline-offset-4 hover:underline lowercase",
        premium: "bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-[1.02] active:scale-[0.98]",
        ghostCTA: "bg-white/5 border border-white/5 hover:border-white/10 text-white/80 hover:text-white backdrop-blur-md shadow-lg hover:scale-[1.02] active:scale-[0.98]",
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
