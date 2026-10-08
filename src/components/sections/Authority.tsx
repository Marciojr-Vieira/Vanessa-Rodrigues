'use client'

import React from 'react'
import { Users, Eye, Award, Camera as Instagram, ArrowRight } from 'lucide-react'

interface AuthorityStatItem {
  id: string
  label: string
  value: string
  icon: string
}

interface AuthorityProps {
  stats?: AuthorityStatItem[]
  instagramHandle?: string
}

const statIconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5 text-[#E2C2A0]" />,
  Eye: <Eye className="w-5 h-5 text-[#E2C2A0]" />,
  Award: <Award className="w-5 h-5 text-[#E2C2A0]" />,
  TrendingUp: <Eye className="w-5 h-5 text-[#E2C2A0]" />,
}

export function Authority({
  stats,
  instagramHandle = '[INSTAGRAM]',
}: AuthorityProps) {
  const defaultStats = [
    {
      id: '1',
      label: 'Seguidores no Instagram',
      value: '+8.000',
      icon: 'Users',
    },
    {
      id: '2',
      label: 'Visualizações em Reels',
      value: '+1 Milhão',
      icon: 'Eye',
    },
    {
      id: '3',
      label: 'Análise individual e estratégica',
      value: '100%',
      icon: 'Award',
    },
  ]

  const displayStats = stats ?? defaultStats
  const cleanInstagram = instagramHandle.replace('@', '')
  const instagramUrl = `https://instagram.com/${cleanInstagram}`


  return <section className="section-space authority-section"><div className="site-container authority-grid">
    <div className="section-heading"><p className="eyebrow">Presença &amp; Autoridade</p><h2 className="heading-serif section-title">Reconhecimento digital e comunicação jurídica acessível</h2>
      <p>Através de conteúdos informativos constantes no Instagram, descomplicamos o Direito Trabalhista e Digital para milhares de pessoas e empresários em todo o país.</p>
      {cleanInstagram && !cleanInstagram.startsWith('[') && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link"><Instagram size={18}/><span>Acompanhe no Instagram ({instagramHandle})</span><ArrowRight size={18}/></a>}
    </div>
    <div className="authority-stats">{displayStats.map(stat=><div key={stat.id}><span className="stat-icon">{statIconMap[stat.icon] || <Users size={20}/>}</span><strong className="heading-serif">{stat.value}</strong><span>{stat.label}</span></div>)}</div>
  </div></section>
}
