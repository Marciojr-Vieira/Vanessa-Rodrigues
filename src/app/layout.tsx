import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { pageMetadata } from '@/lib/page-metadata'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { prisma } from '@/lib/prisma'
import { generateLegalServiceSchema } from '@/lib/seo'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  let settings = null
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
  } catch {
    // Fallback if db is connecting
  }

  const name = settings?.siteName || 'Vanessa Rodrigues | Advogada'
  const title = `${name} - Direito Trabalhista e Digital | Recuperação de Contas`
  const description =
    'Assessoria jurídica especializada para empresas, trabalhadores e recuperação de contas de redes sociais (Instagram invadido, desativado ou suspenso). Atendimento humanizado e estratégico.'

  const homeSeo = await pageMetadata('/', title, description)
  return {
    ...homeSeo,
    icons: settings?.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    title: {
      default: homeSeo.title as string || title,
      template: `%s | ${name}`,
    },
    description: homeSeo.description || description,
    keywords: [
      'advogada trabalhista',
      'direito digital',
      'recuperação de conta instagram',
      'conta hackeada',
      'conta desativada instagram',
      'assessoria jurídica empresarial',
      'direito do trabalho',
      'Vanessa Rodrigues advogada',
    ],
    authors: [{ name: 'Vanessa Rodrigues' }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: '/',
      title: homeSeo.title as string || title,
      description: homeSeo.description || description,
      siteName: name,
      images: [
        {
          url: homeSeo.openGraph?.images ? String((homeSeo.openGraph.images as string[])[0]) : '/images/vanessa-portrait.svg',
          width: 800,
          height: 1000,
          alt: 'Vanessa Rodrigues Advogada',
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let settings = null
  try {
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
  } catch {
    // fallback
  }

  const pathname = (await headers()).get('x-pathname') || '/'
  const admin = pathname.startsWith('/admin')
  const Main = admin ? 'div' : 'main'
  const jsonLd = generateLegalServiceSchema({
    name: settings?.siteName || 'Vanessa Rodrigues Advogada',
    oab: settings?.oab || '[OAB/UF]',
    city: settings?.city || 'Brasil',
    address: settings?.address || '',
    phone: settings?.whatsapp || '',
    email: settings?.email || '',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  })

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }}
        />
      </head>
      <body className={`${admin ? 'admin-site' : 'public-site'} min-h-screen bg-[#0B0A09] text-[#F4EFEA] flex flex-col font-sans antialiased selection:bg-[#E2C2A0] selection:text-[#0B0A09]`}>
        {!admin && <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#E2C2A0] focus:text-black focus:p-3">Ir para o conteúdo</a>}
        {!admin && <Header
          blogEnabled={settings?.blogEnabled}
          logoUrl={settings?.logoUrl}
          siteName={settings?.siteName}
          whatsappPhone={settings?.whatsapp || '[WHATSAPP]'}
          whatsappMessage={settings?.whatsappMsgEmpresa}
        />}
        <Main className="flex-grow" id="conteudo">{children}</Main>
        {!admin && <Footer settings={settings || undefined} />}
        {!admin && <WhatsAppFloat
          phone={settings?.whatsapp || '[WHATSAPP]'}
          message={settings?.whatsappMsgConta}
        />}
        {!admin && <CookieBanner />}
      </body>
    </html>
  )
}
