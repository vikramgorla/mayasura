import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 focus-visible:ring-slate-950 dark:focus-visible:ring-white shadow-sm",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm",
        outline: "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-300 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-400",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-slate-950",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-400 focus-visible:ring-slate-950",
        link: "text-slate-900 dark:text-white underline-offset-4 hover:underline focus-visible:ring-slate-950",
        brand: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 focus-visible:ring-indigo-600 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 dark:shadow-indigo-500/20",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
