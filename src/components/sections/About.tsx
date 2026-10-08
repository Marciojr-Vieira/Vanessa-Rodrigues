'use client'

import React from 'react'
import Image from 'next/image'
import { Scale, HeartHandshake, SearchCheck, Lock } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface PillarItem {
  icon: string
  title: string
}

interface AboutProps {
  content?: {
    name?: string
    title?: string
    bio?: string
    photoUrl?: string | null
    ctaText?: string
    pillars?: string
  }
  oab?: string
  whatsappPhone?: string
}

const pillarIconMap: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-5 h-5 text-[#E2C2A0]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-[#E2C2A0]" />,
  Heart: <HeartHandshake className="w-5 h-5 text-[#E2C2A0]" />,
  SearchCheck: <SearchCheck className="w-5 h-5 text-[#E2C2A0]" />,
  Search: <SearchCheck className="w-5 h-5 text-[#E2C2A0]" />,
  Lock: <Lock className="w-5 h-5 text-[#E2C2A0]" />,
}

export function About({
  oab,
  content,
  whatsappPhone = '[WHATSAPP]',
}: AboutProps) {
  const name = content?.name || 'Vanessa Rodrigues'
  const title = content?.title || 'Advogada'
  const bio = content?.bio || 'Advogada atuante nas áreas de Direito Trabalhista e Direito Digital, com foco em assessoria jurídica preventiva e contenciosa para empresas de diversos segmentos. Especialista em recuperação de contas em redes sociais, com atendimento humanizado e comprometido com a segurança jurídica de cada caso.'
  const photoUrl = content?.photoUrl || '/images/architecture.webp'
  const ctaText = content?.ctaText || 'Falar no WhatsApp'

  let pillars: PillarItem[] = [
    { icon: 'Scale', title: 'Atuação ética e responsável' },
    { icon: 'HeartHandshake', title: 'Atendimento humanizado' },
    { icon: 'SearchCheck', title: 'Análise individual de cada caso' },
    { icon: 'Lock', title: 'Seu caso com sigilo e segurança' },
  ]

  if (content?.pillars) {
    try {
      pillars = JSON.parse(content.pillars)
    } catch {
      // fallback
    }
  }

  const whatsappUrl = buildWhatsAppUrl(whatsappPhone, 'Olá, Dra. Vanessa! Gostaria de falar sobre o meu caso.')


  return <section id="sobre" className="section-space"><div className="site-container about-grid">
    <div className="about-image"><Image src={photoUrl} alt={content?.photoUrl ? name+', '+title : ''} fill className="object-cover" sizes="(max-width: 767px) 90vw, 480px"/></div>
    <div className="about-copy"><p className="eyebrow">Sobre a advogada</p><h2 className="heading-serif section-title">{name}</h2><p className="about-role">{title}{oab && !oab.startsWith('[') ? ' · OAB '+oab : ''}</p>
      <p className="about-bio">{bio}</p>
      <div className="about-pillars">{pillars.map((pillar,index)=><div key={index}>{pillarIconMap[pillar.icon] || <Scale size={20}/>}<span>{pillar.title}</span></div>)}</div>
      <ButtonLink href={whatsappUrl} withArrow>{ctaText}</ButtonLink>
    </div>
  </div></section>
}
