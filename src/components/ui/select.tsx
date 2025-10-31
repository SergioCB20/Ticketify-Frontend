import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  // Make options optional so consumers can either provide an `options` array
  // or render custom <option> children directly.
  options?: Array<{ label: string; value: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    options,
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

        {/* Select Container */}
        <div className="relative">
          <select
            className={cn(
              // Base styles
              'w-full px-4 py-2.5 pr-10 rounded-lg border text-base appearance-none',
              'transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              
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
          >
            {(options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className={cn(
              'h-5 w-5',
              disabled ? 'text-gray-400' : 'text-gray-500'
            )} />
          </div>
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

Select.displayName = 'Select'

export { Select }
export type { SelectProps }