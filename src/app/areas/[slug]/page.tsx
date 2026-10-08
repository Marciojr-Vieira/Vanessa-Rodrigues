import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { sanitizeHtml } from '@/lib/sanitize'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await prisma.practiceArea.findUnique({ where: { slug } })
  if (!area || !area.active) return { title: 'Área não encontrada', robots: {index:false, follow:false} }

  return {
    ...await pageMetadata('/areas/'+slug,area.seoTitle || area.title,area.seoDesc || area.summary,area.imageUrl)
  }
}

export default async function PracticeAreaDetailPage({ params }: Props) {
  const { slug } = await params
  const [area, settings] = await Promise.all([
    prisma.practiceArea.findUnique({ where: { slug } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ])

  if (!area || !area.active) {
    notFound()
  }

  const cleanContent = sanitizeHtml(area.content)
  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsapp || '[WHATSAPP]',
    `Olá, Dra. Vanessa! Gostaria de falar sobre a área de ${area.title}.`
  )

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Voltar */}
        <Link
          href="/#areas"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E2C2A0] hover:text-[#EDD5BE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para todas as áreas</span>
        </Link>

        {/* Cabeçalho */}
        <div className="space-y-4 border-b border-[rgba(255,255,255,0.08)] pb-8">
          <p className="eyebrow">Área de Atuação</p>
          <h1 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-[#F4EFEA]">
            {area.title}
          </h1>
          <p className="text-base text-[#A8A19A] leading-relaxed">
            {area.summary}
          </p>
        </div>

        {/* Conteúdo Rico */}
        <div
          className="prose-dark leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Box de Contato / Próximo Passo */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#161413] border border-[#E2C2A0]/30 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="heading-serif text-2xl text-[#F4EFEA]">
              Deseja orientação jurídica especializada nesta área?
            </h3>
            <p className="text-sm text-[#A8A19A]">
              Entre em contato diretamente para apresentar seu caso e verificar a viabilidade de atendimento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
              <ButtonLink href={whatsappUrl}
                variant="primary"
                size="md"
                icon={<MessageCircle className="w-4 h-4 fill-current" />}
              >
                Falar sobre {area.title}
              </ButtonLink>
              <ButtonLink href="/#contato" variant="secondary" size="md">
                Preencher formulário de triagem
              </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}
