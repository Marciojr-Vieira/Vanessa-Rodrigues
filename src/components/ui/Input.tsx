import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-[#A8A19A]">
            {label}
            {props.required && <span className="text-[#E2C2A0] ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full rounded-xl bg-[#0B0A09]/70 px-4 py-3 text-sm text-[#F4EFEA]
            border ${error ? 'border-red-500/80 focus:border-red-500' : 'border-[rgba(255,255,255,0.08)] focus:border-[#E2C2A0]'}
            placeholder-[#A8A19A] transition-all duration-200
            focus:outline-none focus:ring-1 focus:ring-[#E2C2A0]/40
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#A8A19A] mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

