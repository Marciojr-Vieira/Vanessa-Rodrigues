import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import { ArrowLeft, Calendar, User, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { formatDateShort } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { generateBlogPostSchema } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post || post.status !== 'PUBLISHED') return { title: 'Artigo não encontrado', robots: {index:false, follow:false} }

  return {
    ...await pageMetadata('/blog/'+slug,post.seoTitle || post.title,post.seoDesc || post.excerpt,post.coverImage)
  }
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params
  const [post, settings] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ])

  if (!post || post.status !== 'PUBLISHED' || settings?.blogEnabled===false) {
    notFound()
  }

  const cleanContent = sanitizeHtml(post.content)
  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsapp || '[WHATSAPP]',
    `Olá, Dra. Vanessa! Li o artigo "${post.title}" e gostaria de tirar uma dúvida sobre o assunto.`
  )

  const articleJsonLd = generateBlogPostSchema({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImage: post.coverImage || undefined,
    publishedAt: (post.publishedAt || post.createdAt).toISOString(),
    authorName: 'Vanessa Rodrigues',
  })

  return (
    <article className="pt-32 pb-24 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\u003c') }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Voltar */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E2C2A0] hover:text-[#EDD5BE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para artigos</span>
        </Link>

        {/* Título & Metadados */}
        <div className="space-y-4 border-b border-[rgba(255,255,255,0.08)] pb-8">
          <p className="eyebrow">Artigo Informativo</p>
          <h1 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-[#F4EFEA] leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-[#A8A19A] pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E2C2A0]" />
              <span>Publicado em {formatDateShort(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#E2C2A0]" />
              <span>Vanessa Rodrigues</span>
            </div>
          </div>
        </div>

        {/* Imagem de Capa */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#141211]">
            <Image
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              fill
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        )}

        {/* Conteúdo do Artigo */}
        <div
          className="prose-dark max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Box de Contato no final do artigo */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#161413] border border-[#E2C2A0]/30 shadow-xl space-y-6 mt-16">
          <div className="space-y-2">
            <h3 className="heading-serif text-2xl text-[#F4EFEA]">
              Precisa de orientação jurídica sobre este tema?
            </h3>
            <p className="text-sm text-[#A8A19A]">
              Entre em contato para entender como as leis aplicam-se ao seu caso específico.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
              <ButtonLink href={whatsappUrl}
                variant="primary"
                size="md"
                icon={<MessageCircle className="w-4 h-4 fill-current" />}
              >
                Falar com a advogada
              </ButtonLink>
              <ButtonLink href="/#contato" variant="secondary" size="md">
                Formulário de triagem
              </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  )
}
