import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import { Calendar, ArrowRight, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { formatDateShort } from '@/lib/utils'

const defaults: Metadata = {
  title: 'Artigos & Atualizações Jurídicas | Vanessa Rodrigues Advogada',
  description:
    'Artigos, notícias e esclarecimentos sobre Direito Trabalhista, Direito Digital e recuperação de contas de redes sociais.',
}
export async function generateMetadata(): Promise<Metadata> {return pageMetadata("/blog", String(defaults.title), String(defaults.description))}


export const dynamic = 'force-dynamic'


import { Button } from '@/components/ui/Button'

export default async function BlogListPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
 const settings=await prisma.siteSettings.findUnique({where:{id:'singleton'}})
 if(settings?.blogEnabled===false)notFound()
 const query=((await searchParams).q || '').trim().slice(0,120)
 const allPosts=await prisma.blogPost.findMany({where:{status:'PUBLISHED'},orderBy:{publishedAt:'desc'}})
 const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 const posts=allPosts.filter(post=>normalize(post.title+' '+post.excerpt).includes(normalize(query)))
 return <div className="blog-header min-h-screen"><div className="site-container">
  <div className="section-heading"><h1 className="heading-serif section-title">Blog e artigos</h1><p>Informações sobre Direito Trabalhista e Digital.</p></div>
  <form action="/blog" method="get" className="blog-search" role="search"><label className="sr-only" htmlFor="blog-search">Buscar artigos</label><input id="blog-search" name="q" type="search" placeholder="Buscar artigos" defaultValue={query} maxLength={120}/><Button type="submit" size="md" icon={<Search size={18}/>}>Buscar</Button></form>
  {query && <p className="text-sm text-text-secondary mb-8">{posts.length} {posts.length===1?'artigo encontrado':'artigos encontrados'} <Link href="/blog" className="text-accent underline ml-4">Limpar busca</Link></p>}
  {posts.length===0 ? <div className="blog-empty"><h2 className="heading-serif">{query?'Nenhum artigo encontrado':'Novos conteúdos em breve'}</h2><p>{query?'Tente buscar por outro termo.':'Os artigos publicados estarão disponíveis aqui.'}</p><Link href={query?'/blog':'/#areas'} className="text-link">{query?'Ver todos os artigos':'Conheça as áreas de atuação'}<ArrowRight size={18}/></Link></div>:
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{posts.map(post=><Card key={post.id} className="p-0 overflow-hidden flex flex-col">
    <Link href={'/blog/'+post.slug} className="relative aspect-[16/9] block"><Image src={post.coverImage || '/images/article-placeholder.svg'} alt={post.coverAlt || post.title} fill sizes="(max-width:767px) 90vw, (max-width:1023px) 45vw, 400px" className="object-cover"/></Link>
    <div className="p-6 flex flex-col gap-4 flex-1"><p className="flex items-center gap-2 text-xs text-text-secondary"><Calendar size={14}/>{formatDateShort(post.publishedAt || post.createdAt)}</p><h2 className="heading-serif text-2xl"><Link href={'/blog/'+post.slug}>{post.title}</Link></h2><p className="text-sm text-text-secondary leading-relaxed">{post.excerpt}</p><Link href={'/blog/'+post.slug} className="text-link mt-auto">Ler artigo completo<ArrowRight size={18}/></Link></div>
   </Card>)}</div>}
 </div></div>
}
