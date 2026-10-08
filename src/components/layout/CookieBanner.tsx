'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => { try { setIsVisible(!localStorage.getItem('vr_cookie_consent')) } catch { setIsVisible(true) } }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    try { localStorage.setItem('vr_cookie_consent', 'acknowledged') } catch {}
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div role="region" aria-label="Aviso sobre cookies" className="cookie-notice fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-[#161413]/95 border-t border-[rgba(255,255,255,0.08)] backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#E2C2A0] flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#A8A19A] leading-relaxed">
            Este site utiliza apenas cookies essenciais para seu funcionamento. Saiba como seus dados são tratados na{' '}
            <Link
              href="/politica-de-privacidade"
              className="text-[#E2C2A0] underline hover:text-[#EDD5BE]"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            className="w-full sm:w-auto"
          >
            Entendi
          </Button>
        </div>
      </div>
    </div>
  )
}
