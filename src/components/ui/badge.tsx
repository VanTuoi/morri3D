import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-orange-500 text-white shadow-sm",
        secondary: "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        destructive: "border-transparent bg-red-500 text-white shadow-sm",
        outline: "text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800",
        pending: "border-blue-500/30 bg-blue-500/15 text-blue-500 dark:text-blue-300 font-bold",
        printing: "border-rose-500/30 bg-rose-500/15 text-rose-500 dark:text-rose-300 font-bold",
        completed: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold",
        cancelled: "border-red-500/30 bg-red-500/15 text-red-500 dark:text-red-300 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
