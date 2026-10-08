import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/sections/Hero'
import { ServiceCards } from '@/components/sections/ServiceCards'
import { PracticeAreas } from '@/components/sections/PracticeAreas'
import { AccountRecovery } from '@/components/sections/AccountRecovery'
import { About } from '@/components/sections/About'
import { Authority } from '@/components/sections/Authority'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { CtaFinal } from '@/components/sections/CtaFinal'
import { ContactForm } from '@/components/sections/ContactForm'
import { Reveal } from '@/components/shared/Reveal'
import { FaqSection } from '@/components/sections/FaqSection'

export const dynamic = 'force-dynamic'

export default async function HomePage({searchParams}:{searchParams:Promise<{atendimento?:string}>}) {
  const query=await searchParams
  const contactType=['EMPRESA','TRABALHADOR','CONTA'].includes(query.atendimento || '') ? query.atendimento! : 'CONTA'
  // Busca todos os dados dinâmicos do banco de dados
  const [
    settings,
    heroContent,
    serviceCards,
    practiceAreas,
    recoveryTypes,
    recoveryContent,
    aboutContent,
    authorityStats,
    howItWorksSteps,
    ctaFinalContent,
    faqItems,
    recentPosts,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null),
    prisma.heroContent.findUnique({ where: { id: 'singleton' } }).catch(() => null),
    prisma.serviceCard.findMany({ where: { active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.practiceArea.findMany({ where: { active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.accountRecoveryType.findMany({ where: { active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.recoveryContent.findUnique({where:{id:'singleton'}}).catch(()=>null),
    prisma.aboutContent.findUnique({ where: { id: 'singleton' } }).catch(() => null),
    prisma.authorityStat.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.howItWorksStep.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.ctaFinalContent.findUnique({ where: { id: 'singleton' } }).catch(() => null),
    prisma.faqItem.findMany({ where: { active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' }, take: 3 }).catch(() => []),
  ])

  return (
    <div className="flex flex-col">
      {/* 2. Hero */}
      <Hero
        content={heroContent || undefined}
        whatsappPhone={settings?.whatsapp || '[WHATSAPP]'}
        whatsappMessage={settings?.whatsappMsgEmpresa}
      />

      {/* 3. Como posso te ajudar? */}
      <ServiceCards
        cards={serviceCards}
        whatsappPhone={settings?.whatsapp || '[WHATSAPP]'}
      />

      {/* 4. Áreas de atuação */}
      <Reveal><PracticeAreas areas={practiceAreas} /></Reveal>

      {/* 5. Destaque "Recuperação de contas" */}
      <AccountRecovery
        types={recoveryTypes}
        faqItems={faqItems.filter(item=>item.category==='recuperacao')}
        content={recoveryContent || undefined}
        whatsappPhone={settings?.whatsapp || '[WHATSAPP]'}
        whatsappMessage={settings?.whatsappMsgConta}
      />

      {/* 6. Sobre a advogada */}
      <About
        content={aboutContent || undefined}
        oab={settings?.oab}
        whatsappPhone={settings?.whatsapp || '[WHATSAPP]'}
      />

      {/* 7. Autoridade (Instagram e Prova Social) */}
      <Authority
        stats={authorityStats}
        instagramHandle={settings?.instagram || '[INSTAGRAM]'}
      />

      {/* 8. Como funciona */}
      <Reveal><HowItWorks steps={howItWorksSteps} /></Reveal>

      {/* 9. Perguntas Frequentes (FAQ) */}
      <FaqSection
        items={faqItems.filter(item=>item.category!=='recuperacao')}
        title="Perguntas Frequentes"
        eyebrow="Tire suas dúvidas"
      />

      {/* 10. Conteúdo / Blog (se houver artigos) */}
      {settings?.blogEnabled !== false && recentPosts.length > 0 && <BlogPreview posts={recentPosts} />}

      {/* 11. CTA final */}
      <CtaFinal
        content={ctaFinalContent || undefined}
        whatsappPhone={settings?.whatsapp || '[WHATSAPP]'}
      />

      {/* 12. Formulário de contato/triagem */}
      <ContactForm key={contactType} initialType={contactType} whatsappPhone={settings?.whatsapp || '[WHATSAPP]'} />
    </div>
  )
}
