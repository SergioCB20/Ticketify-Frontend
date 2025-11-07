import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'violet' | 'blue' | 'orange' | 'cyan'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default',size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      destructive: 'bg-red-100 text-red-800 border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      violet: 'bg-violet-100 text-violet-800 border-violet-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium border',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
export type { BadgeProps }
