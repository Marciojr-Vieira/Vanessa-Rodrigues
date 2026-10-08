import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBaseUrl } from '@/lib/utils'
export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = getBaseUrl()

  const [areas, posts, settings] = await Promise.all([
    prisma.practiceArea.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.siteSettings.findUnique({where:{id:'singleton'}}),
  ])

  const staticRoutes = [
    '',
    '/recuperacao-de-instagram',
    '/blog',
    '/politica-de-privacidade',
    '/termos-de-uso',
  ].filter(route=>settings?.blogEnabled!==false || route!=='/blog')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>${route === '' ? 'weekly' : 'monthly'}</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>
  `
    )
    .join('')}
  ${areas
    .map(
      (area) => `
    <url>
      <loc>${baseUrl}/areas/${area.slug}</loc>
      <lastmod>${area.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>
  `
    )
    .join('')}
  ${(settings?.blogEnabled===false ? [] : posts)
    .map(
      (post) => `
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `
    )
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
