import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    const hasError = Boolean(error)

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            className={cn(
              // Base styles
              'w-full px-4 py-2.5 rounded-lg border text-base',
              'transition-all duration-200',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              
              // States
              !hasError && !disabled && [
                'border-gray-300 bg-white text-gray-900',
                'hover:border-gray-400',
                'focus:border-primary-500 focus:ring-primary-500',
              ],
              hasError && [
                'border-error bg-red-50 text-gray-900',
                'focus:border-error focus:ring-error',
              ],
              disabled && [
                'bg-gray-100 text-gray-500 cursor-not-allowed',
                'border-gray-200',
              ],
              
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p className={cn(
            'mt-1.5 text-sm',
            hasError ? 'text-error' : 'text-gray-600'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }