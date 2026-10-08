import { getBaseUrl } from './utils'

export function generateLegalServiceSchema(settings: {
  name: string
  oab: string
  city: string
  address: string
  phone: string
  email: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: settings.name,
    description:
      'Advogada especialista em Direito Trabalhista, Direito Digital e recuperação de contas em redes sociais.',
    url: settings.url || getBaseUrl(),
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city,
      streetAddress: settings.address,
      addressCountry: 'BR',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Áreas de Atuação',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Direito Trabalhista para Empresas',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Direito Trabalhista para Trabalhadores',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Direito Digital - Recuperação de Contas',
          },
        },
      ],
    },
  }
}

export function generateAttorneySchema(settings: {
  name: string
  oab: string
  city: string
  url: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: settings.name,
    jobTitle: 'Advogada',
    description:
      'Advogada especialista em Direito Trabalhista e Digital, com foco em recuperação de contas em redes sociais.',
    url: settings.url || getBaseUrl(),
    image: settings.imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city,
      addressCountry: 'BR',
    },
    knowsAbout: [
      'Direito Trabalhista',
      'Direito Digital',
      'Recuperação de contas do Instagram',
      'Recuperação de contas de redes sociais',
    ],
  }
}

export function generateBlogPostSchema(post: {
  title: string
  excerpt: string
  slug: string
  coverImage?: string
  publishedAt?: string
  authorName: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${getBaseUrl()}/blog/${post.slug}`,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vanessa Rodrigues Advogada',
    },
  }
}

export function generateFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

