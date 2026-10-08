'use client'

import React from 'react'
import { Accordion, type AccordionItem } from '@/components/ui/Accordion'

interface FaqSectionProps {
  items?: AccordionItem[]
  title?: string
  eyebrow?: string
}

export function FaqSection({
  items = [],
  title = 'Dúvidas Frequentes',
  eyebrow = 'Esclarecimentos Jurídicos',
}: FaqSectionProps) {
  if (items.length === 0) return null


  return <section id="faq" className="section-space faq-section"><div className="site-container faq-grid">
    <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2 className="heading-serif section-title">{title}</h2><p>Respostas claras para as principais dúvidas sobre recuperação de contas e atuação jurídica.</p></div>
    <Accordion items={items} defaultOpenIndex={0}/>
  </div></section>
}
