import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import { ShieldAlert, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Accordion } from '@/components/ui/Accordion'
import { ContactForm } from '@/components/sections/ContactForm'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { generateFaqSchema } from '@/lib/seo'

const defaults: Metadata = {
  title: 'Recuperação de Contas do Instagram | Dra. Vanessa Rodrigues',
  description:
    'Especialista em recuperação de contas invadidas, desativadas ou suspensas no Instagram e redes sociais. Medidas judiciais com pedido de liminar e notificação extrajudicial.',
  keywords: [
    'recuperar conta instagram',
    'instagram hackeado',
    'conta desativada instagram',
    'perfil clonado golpe',
    'advogado especialista em instagram',
    'liminar recuperação instagram',
    'Vanessa Rodrigues advogada',
  ],
}
export async function generateMetadata(): Promise<Metadata> {return pageMetadata("/recuperacao-de-instagram", String(defaults.title), String(defaults.description))}


export default async function InstagramRecoveryLandingPage() {
  const [settings, recoveryTypes, faqItems, recoveryContent] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.accountRecoveryType.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
    prisma.faqItem.findMany({ where: { active: true, category: 'recuperacao' }, orderBy: { order: 'asc' } }),
    prisma.recoveryContent.findUnique({where:{id:'singleton'}}),
  ])

  const whatsappPhone = settings?.whatsapp || '[WHATSAPP]'
  const whatsappUrl = buildWhatsAppUrl(
    whatsappPhone,
    settings?.whatsappMsgConta || 'Olá, Dra. Vanessa! Gostaria de apresentar minha situação para análise.', 'CONTA'
  )

  const faqSchema = generateFaqSchema(
    faqItems.map((f) => ({ question: f.question, answer: f.answer }))
  )

  return (
    <div className="pt-28 pb-16 min-h-screen">
      {/* Script FAQ Schema */}
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\u003c') }}
        />
      )}

      {/* Hero da Landing Page */}
      <section className="relative py-16 md:py-24 border-b border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#E2C2A0]/[0.04] rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161413] border border-[#E2C2A0]/40">
            <ShieldAlert className="w-4 h-4 text-[#E2C2A0]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#E2C2A0]">
              Direito Digital &amp; Redes Sociais
            </span>
          </div>

          <h1 className="heading-serif text-3xl sm:text-5xl md:text-6xl text-[#F4EFEA] font-normal leading-tight">
            {recoveryContent?.title || 'Perdeu o acesso à sua conta do Instagram?'}
          </h1>

          <p className="text-base sm:text-lg text-[#A8A19A] max-w-2xl mx-auto font-light leading-relaxed">
            {recoveryContent?.description || 'Análise individual de contas invadidas, desativadas ou perfis clonados.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonLink href={whatsappUrl}
                variant="primary"
                size="lg"
                icon={<MessageCircle className="w-5 h-5" />}
              >
                {recoveryContent?.ctaText || 'Solicitar análise do caso'}
              </ButtonLink>

            <ButtonLink href="#como-agir" variant="secondary" size="lg">
                Entender as etapas do processo
              </ButtonLink>
          </div>

          <p className="text-[11px] text-[#A8A19A] pt-2">
            * Atendimento em estrita observância ao Código de Ética da OAB. Sem promessa mercantilista de resultado infalível.
          </p>
        </div>
      </section>

      {/* Cenários Atendidos */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <p className="eyebrow">Cenários Recorrentes</p>
          <h2 className="heading-serif text-3xl sm:text-4xl text-[#F4EFEA]">
            Situações em que atuamos juridicamente
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recoveryTypes.map((type) => (
            <div
              key={type.id}
              className="p-7 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] hover:border-[#E2C2A0]/40 transition-all duration-300"
            >
              <h3 className="font-serif text-xl text-[#F4EFEA] mb-2">{type.title}</h3>
              <p className="text-xs text-[#A8A19A] leading-relaxed">{type.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como Funciona o Processo */}
      <section id="como-agir" className="py-20 bg-[#0E0D0C] border-t border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3">
            <p className="eyebrow">Etapas do Procedimento</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#F4EFEA]">
              {recoveryContent?.processTitle || 'Análise individual e preservação de provas'}
            </h2>
          </div>

          <p className="text-center text-[#A8A19A] max-w-3xl mx-auto">{recoveryContent?.processDescription}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B0A09] text-[#E2C2A0] flex items-center justify-center font-serif text-xl">
                1
              </div>
              <h3 className="font-serif text-lg text-[#F4EFEA]">Preservação de Provas</h3>
              <p className="text-xs text-[#A8A19A] leading-relaxed">
                Coleta imediata de prints, registros de e-mail de alerta da plataforma, dados cadastrais originais e evidências de titularidade.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B0A09] text-[#E2C2A0] flex items-center justify-center font-serif text-xl">
                2
              </div>
              <h3 className="font-serif text-lg text-[#F4EFEA]">Notificação Extrajudicial</h3>
              <p className="text-xs text-[#A8A19A] leading-relaxed">
                Envio de notificação técnica fundamentada nos termos do Marco Civil da Internet para formalizar a inércia do provedor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B0A09] text-[#E2C2A0] flex items-center justify-center font-serif text-xl">
                3
              </div>
              <h3 className="font-serif text-lg text-[#F4EFEA]">Ação com Pedido de Liminar</h3>
              <p className="text-xs text-[#A8A19A] leading-relaxed">
                Ajuizamento de ação judicial de obrigação de fazer com pedido de tutela de urgência (liminar) para restabelecimento sob pena de multa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Específico de Recuperação */}
      {faqItems.length > 0 && (
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <p className="eyebrow">Perguntas Frequentes</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#F4EFEA]">
              Dúvidas sobre o processo de recuperação
            </h2>
          </div>
          <Accordion items={faqItems} defaultOpenIndex={0} />
        </section>
      )}

      {/* Formulário de Triagem Integrado */}
      <ContactForm whatsappPhone={whatsappPhone} />
    </div>
  )
}
