import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: boolean
  hoverEffect?: boolean
  children: React.ReactNode
}

export function Card({
  highlight = false,
  hoverEffect = true,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        relative rounded-[20px] bg-[#161413] p-7 md:p-8
        transition-all duration-300
        ${
          highlight
            ? 'border-2 border-[#E2C2A0]/80 shadow-[0_0_35px_rgba(226,194,160,0.15)] bg-gradient-to-b from-[#1C1917] to-[#141211]'
            : 'border border-[rgba(255,255,255,0.07)]'
        }
        ${
          hoverEffect
            ? 'hover:border-[#E2C2A0]/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]'
            : ''
        }
        ${className}
      `}
      {...props}
    >
      {highlight && (
        <div className="absolute -top-3 right-6 bg-[#E2C2A0] text-[#0B0A09] text-[10px] font-semibold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md">
          Especialidade Principal
        </div>
      )}
      {children}
    </div>
  )
}

