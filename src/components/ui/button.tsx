import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-button-hover shadow-button",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gradient-secondary text-secondary-foreground hover:shadow-button-hover shadow-button",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        mobile: "mobile-button bg-gradient-primary text-primary-foreground hover:shadow-button-hover active:translate-y-0.5",
        "mobile-secondary": "mobile-button bg-gradient-secondary text-secondary-foreground hover:shadow-button-hover active:translate-y-0.5",
        walmart: "bg-[#0071CE] text-white hover:bg-[#005CB8] shadow-button",
        "walmart-secondary": "bg-[#FFC220] text-[#0071CE] hover:bg-[#FFB400] shadow-button font-semibold",
        subtle: "bg-muted hover:bg-muted/80 text-foreground",
        light: "bg-primary-light text-primary hover:bg-primary-light/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-md px-2 text-xs",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
        "mobile-lg": "h-14 rounded-xl px-5 py-4 text-base",
        "mobile-xl": "h-16 rounded-xl px-6 py-4 text-lg",
        "touch-target": "min-h-[44px] min-w-[44px] px-4 py-2",
      },
      animation: {
        none: "",
        smooth: "transition-all duration-300",
        bounce: "transition-all duration-300 hover:transform hover:scale-105 active:scale-95",
        pulse: "transition-all duration-300 hover:animate-pulse",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "smooth",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
