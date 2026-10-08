import React from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  withArrow?: boolean
  icon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  withArrow = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'site-button inline-flex items-center justify-center font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizeStyles = {
    sm: 'min-h-11 text-[13px] px-4 py-2 gap-2',
    md: 'min-h-12 text-sm px-6 py-3 gap-2',
    lg: 'min-h-14 text-[15px] px-7 py-4 gap-2.5',
  }

  const variantStyles = {
    // Pill totalmente arredondado com dourado champanhe e texto escuro
    primary:
      'rounded-xl bg-[#E2C2A0] text-[#0B0A09] hover:bg-[#EDD5BE] active:bg-[#C4A47E]',
    // Secundário escuro com borda e hover dourado
    secondary:
      'rounded-xl bg-transparent text-[#F4EFEA] border border-[#E2C2A0]/40 hover:border-[#E2C2A0] hover:text-[#E2C2A0]',
    // Outline refinado
    outline:
      'rounded-xl bg-transparent text-[#E2C2A0] border border-[#E2C2A0]/60 hover:bg-[#E2C2A0]/10 hover:border-[#E2C2A0]',
    // Ghost
    ghost:
      'rounded-lg bg-transparent text-[#A8A19A] hover:text-[#F4EFEA] hover:bg-white/5',
    // Link elegante com seta
    link:
      'p-0 rounded-none bg-transparent text-[#E2C2A0] hover:text-[#EDD5BE] hover:translate-x-1',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {withArrow && !isLoading && (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
      )}
    </button>
  )
}
