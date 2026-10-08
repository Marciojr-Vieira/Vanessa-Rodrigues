import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/sanitize'

const defaults: Metadata = {
  title: 'Política de Privacidade | Vanessa Rodrigues Advogada',
  description: 'Política de Privacidade e Proteção de Dados Pessoais (LGPD) do escritório Vanessa Rodrigues Advogada.',
}
export async function generateMetadata(): Promise<Metadata> {return pageMetadata("/politica-de-privacidade", String(defaults.title), String(defaults.description))}


export default async function PrivacyPolicyPage() {
  const page = await prisma.legalPage.findUnique({
    where: { slug: 'politica-de-privacidade' },
  })

  const content = page?.content || '<p>Conteúdo em atualização.</p>'

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E2C2A0] hover:text-[#EDD5BE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao início</span>
        </Link>

        <div className="space-y-4 border-b border-[rgba(255,255,255,0.08)] pb-8">
          <p className="eyebrow">Conformidade Legal &amp; LGPD</p>
          <h1 className="heading-serif text-3xl sm:text-4xl text-[#F4EFEA]">
            {page?.title || 'Política de Privacidade'}
          </h1>
        </div>

        <div
          className="prose-dark max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </div>
    </div>
  )
}

