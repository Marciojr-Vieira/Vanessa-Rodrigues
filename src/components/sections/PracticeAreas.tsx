'use client'

import React from 'react'
import Link from 'next/link'
import { Briefcase, Users, KeyRound, ArrowRight } from 'lucide-react'

interface PracticeAreaItem {
  id: string
  title: string
  slug: string
  summary: string
  icon: string
  order: number
}

interface PracticeAreasProps {
  areas?: PracticeAreaItem[]
}

const areaIcons: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-6 h-6 text-[#E2C2A0]" />,
  Users: <Users className="w-6 h-6 text-[#E2C2A0]" />,
  KeyRound: <KeyRound className="w-6 h-6 text-[#E2C2A0]" />,
}

export function PracticeAreas({ areas = [] }: PracticeAreasProps) {

  return <section id="areas" className="section-space"><div className="site-container">
    <div className="section-heading"><p className="eyebrow">Áreas de atuação</p><h2 className="heading-serif section-title max-w-4xl">Especialidades jurídicas com foco em estratégia e segurança</h2></div>
    <div className="area-list">{areas.map((area,index)=><Link href={'/areas/'+area.slug} key={area.id} className="area-row">
      <span className="heading-serif area-number">{String(index+1).padStart(2,'0')}</span>
      <span className="area-icon">{areaIcons[area.icon] || <Briefcase size={24}/>}</span>
      <div><h3 className="heading-serif">{area.title}</h3><p>{area.summary}</p></div>
      <span className="area-more"><span className="round-arrow"><ArrowRight size={22} aria-hidden="true"/></span><span>Saiba mais</span></span>
    </Link>)}</div>
  </div></section>
}
