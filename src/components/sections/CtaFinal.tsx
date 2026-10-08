'use client'

import React from 'react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface CtaFinalProps {
  content?: {
    title?: string
    subtitle?: string
    buttonText?: string
    phrase?: string
  }
  whatsappPhone?: string
}

export function CtaFinal({
  content,
  whatsappPhone = '[WHATSAPP]',
}: CtaFinalProps) {
  const title = content?.title || 'Estou à disposição para entender o seu caso.'
  const subtitle = content?.subtitle || 'Escolha o tipo de atendimento e fale comigo diretamente.'
  const buttonText = content?.buttonText || 'Falar no WhatsApp'
  const phrase = content?.phrase || 'Direito é mais do que lei. É sobre pessoas.'

  const whatsappUrl = buildWhatsAppUrl(whatsappPhone, 'Olá, Dra. Vanessa! Gostaria de conversar sobre o meu caso.')


  return <section className="section-space final-cta"><div className="site-container">
    <div><h2 className="heading-serif section-title">{title}</h2><p>{subtitle}</p><p className="heading-serif final-phrase">“{phrase}”</p></div>
    <ButtonLink href={whatsappUrl} size="lg" withArrow>{buttonText}</ButtonLink>
  </div></section>
}
