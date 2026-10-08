import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  href?: string
  logoUrl?: string | null
  siteName?: string
}

export function Logo({ className = '', showText = true, href = '/', logoUrl, siteName }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Monograma VR em traço fino e elegante */}
      {logoUrl ? <Image src={logoUrl} alt={siteName || 'Vanessa Rodrigues'} width={48} height={48} className="object-contain"/> : <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full border border-[#E2C2A0]/40 bg-[#161413] transition-all duration-300 group-hover:border-[#E2C2A0] group-hover:shadow-[0_0_15px_rgba(226,194,160,0.2)]">
        <svg
          viewBox="0 0 100 100"
          className="w-7 h-7 text-[#E2C2A0]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Círculo decorativo sutil */}
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
          {/* Letra V */}
          <path d="M26 34 L42 68 L50 48" />
          {/* Letra R entrelaçada */}
          <path d="M48 68 L48 32 C48 32 64 30 64 42 C64 52 48 52 48 52 L66 68" />
        </svg>
      </div>}

      {showText && (
        <div className="flex flex-col">
          <span className="font-serif text-lg tracking-[0.18em] uppercase text-[#F4EFEA] font-medium leading-none group-hover:text-[#E2C2A0] transition-colors">
            {siteName?.replace(/\s*\|.*$/, '') || 'Vanessa Rodrigues'}
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#A8A19A] font-light mt-1 pl-[1px]">
            Advogada
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>
  }

  return content
}

