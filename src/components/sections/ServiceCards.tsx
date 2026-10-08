'use client'

import React from 'react'
import { Building2, UserCheck, ShieldAlert } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface ServiceCardData {
  id: string
  title: string
  subtitle: string
  icon: string
  ctaText: string
  whatsappMessage: string
  type: string
  highlight: boolean
  order: number
}

interface ServiceCardsProps {
  cards?: ServiceCardData[]
  whatsappPhone?: string
}

const iconComponentMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6 text-[#E2C2A0]" />,
  UserCheck: <UserCheck className="w-6 h-6 text-[#E2C2A0]" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-[#E2C2A0]" />,
}

export function ServiceCards({
  cards,
  whatsappPhone = '[WHATSAPP]',
}: ServiceCardsProps) {
  // Default fallback cards if none from DB
  const defaultCards = [
    {
      id: 'empresa',
      title: 'Sou empresa',
          type: 'EMPRESA',
      subtitle: 'Quero falar sobre minha empresa e assessoria preventiva',
      icon: 'Building2',
      ctaText: 'Falar sobre minha empresa',
      whatsappMessage: 'Olá, Dra. Vanessa! Sou empresário(a) e gostaria de falar sobre assessoria preventiva para minha empresa.',
      highlight: false,
      order: 1,
    },
    {
      id: 'trabalhador',
      title: 'Sou trabalhador',
          type: 'TRABALHADOR',
      subtitle: 'Quero explicar meu caso e esclarecer meus direitos',
      icon: 'UserCheck',
      ctaText: 'Explicar meu caso',
      whatsappMessage: 'Olá, Dra. Vanessa! Sou trabalhador(a) e gostaria de explicar meu caso para análise jurídica.',
      highlight: false,
      order: 2,
    },
    {
      id: 'conta',
      title: 'Preciso recuperar uma conta',
          type: 'CONTA',
      subtitle: 'Conta do Instagram ou rede social invadida, bloqueada ou suspensa',
      icon: 'ShieldAlert',
      ctaText: 'Recuperar minha conta agora',
      whatsappMessage: 'Olá, Dra. Vanessa! Minha conta de rede social foi invadida/desativada e preciso de auxílio para recuperação.',
      highlight: true,
      order: 3,
    },
  ]

  const displayCards = cards ?? defaultCards


  return <section id="como-ajudar" className="section-space service-section">
    <div className="site-container">
      <div className="section-heading"><h2 className="heading-serif section-title">Como posso te ajudar?</h2><p>Selecione o tipo de atendimento que você precisa:</p></div>
      <div className="service-grid">{displayCards.map((card,index)=><article key={card.id} className={'service-item '+(card.highlight?'service-highlight':'')}>
        <span className="item-number">{String(index+1).padStart(2,'0')}</span>
        <div className="service-title"><div className="service-icon">{iconComponentMap[card.icon] || <Building2 size={32}/>}</div><h3 className="heading-serif">{card.title}</h3></div><p>{card.subtitle}</p>
        <ButtonLink href={buildWhatsAppUrl(whatsappPhone,card.whatsappMessage,card.type as 'EMPRESA'|'TRABALHADOR'|'CONTA')} variant={card.highlight?'primary':'outline'} withArrow>{card.ctaText}</ButtonLink>
      </article>)}</div>
    </div>
  </section>
}
