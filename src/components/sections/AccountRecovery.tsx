'use client'

import React from 'react'
import {
  ShieldAlert,
  Ban,
  AlertTriangle,
  UserX,
  MailWarning,
  Building,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Accordion } from '@/components/ui/Accordion'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface RecoveryType {
  id: string
  title: string
  description: string
  icon: string
}

interface AccountRecoveryProps {
  content?: {title:string;description:string;processTitle:string;processDescription:string;ctaText:string}
  faqItems?: {id:string;question:string;answer:string}[]
  types?: RecoveryType[]
  whatsappPhone?: string
  whatsappMessage?: string
}

const recoveryIconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-[#E2C2A0]" />,
  Ban: <Ban className="w-5 h-5 text-[#E2C2A0]" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-[#E2C2A0]" />,
  UserX: <UserX className="w-5 h-5 text-[#E2C2A0]" />,
  MailWarning: <MailWarning className="w-5 h-5 text-[#E2C2A0]" />,
  Building: <Building className="w-5 h-5 text-[#E2C2A0]" />,
}

export function AccountRecovery({
  content,
  faqItems = [],
  types,
  whatsappPhone = '[WHATSAPP]',
  whatsappMessage = 'Olá, Dra. Vanessa! Perdi o acesso ao meu perfil do Instagram/rede social e preciso de suporte jurídico especializado.',
}: AccountRecoveryProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone, whatsappMessage, 'CONTA')

  const defaultTypes = [
    {
      id: '1',
      title: 'Conta Invadida / Hackeada',
      description: 'Alteração repentina de senha, e-mail de segurança, telefone e ativação de autenticação em dois fatores pelos invasores.',
      icon: 'ShieldAlert',
    },
    {
      id: '2',
      title: 'Conta Desativada Indevidamente',
      description: 'Bloqueio repentino sob alegações genéricas de violação dos termos de uso da plataforma, sem aviso prévio.',
      icon: 'Ban',
    },
    {
      id: '3',
      title: 'Conta Suspensa sem Justificativa',
      description: 'Suspensão de atividades ou alcance sem canal de suporte humano efetivo para reverter a punição.',
      icon: 'AlertTriangle',
    },
    {
      id: '4',
      title: 'Perfil Clonado ou Falso',
      description: 'Criação de perfis fakes usando suas fotos, identidade ou marca comercial para aplicar golpes a terceiros.',
      icon: 'UserX',
    },
    {
      id: '5',
      title: 'Perda de Acesso ao E-mail / Celular',
      description: 'Falha dos métodos de reconhecimento facial e códigos de segurança convencionais da própria plataforma.',
      icon: 'MailWarning',
    },
    {
      id: '6',
      title: 'Conta Empresarial ou Verificada',
      description: 'Prejuízo financeiro direto por interrupção de vendas, comunicação com clientes e perda de autoridade de marca.',
      icon: 'Building',
    },
  ]

  const displayTypes = types ?? defaultTypes


  return <section id="recuperacao" className="section-space recovery-section"><div className="site-container">
    <div className="section-heading max-w-4xl"><h2 className="heading-serif section-title">{content?.title || 'Recuperação de contas do Instagram e redes sociais'}</h2><p>{content?.description || 'A perda de acesso pode afetar sua vida pessoal e sua atividade profissional. Cada caso poderá ser analisado para avaliar as medidas adequadas, sem garantia de resultado.'}</p></div>
    <div className="recovery-list">{displayTypes.map(item=><article key={item.id}><span className="recovery-icon">{recoveryIconMap[item.icon] || <ShieldAlert size={22}/>}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
    <div className="recovery-process"><div><h3 className="heading-serif">{content?.processTitle || 'Análise individual e preservação de provas'}</h3><p>{content?.processDescription || 'O atendimento começa pela compreensão dos fatos e dos registros disponíveis. Havendo viabilidade, poderão ser avaliadas medidas administrativas, extrajudiciais ou judiciais adequadas ao caso.'}</p></div>
      <div className="recovery-actions"><ButtonLink href={whatsappUrl} withArrow>{content?.ctaText || 'Solicitar análise do caso'}</ButtonLink><ButtonLink href="/recuperacao-de-instagram" variant="outline">Página completa &amp; FAQ</ButtonLink></div>
    </div>
    {faqItems.length>0 && <div className="recovery-faq"><h3 className="heading-serif">Dúvidas sobre recuperação de contas</h3><Accordion items={faqItems}/></div>}
  </div></section>
}
