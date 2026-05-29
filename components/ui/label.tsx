"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
