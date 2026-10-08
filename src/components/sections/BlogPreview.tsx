'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDateShort } from '@/lib/utils'

interface BlogPostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string | null
  createdAt: Date | string
}

interface BlogPreviewProps {
  posts?: BlogPostItem[]
}

export function BlogPreview({ posts = [] }: BlogPreviewProps) {
  if (posts.length === 0) return null

  return (
    <section id="artigos" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <p className="eyebrow">Artigos &amp; Atualizações</p>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#F4EFEA]">
              Conteúdo informativo e orientações
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#E2C2A0] hover:text-[#EDD5BE] font-medium"
          >
            <span>Ver todos os artigos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.id} className="p-0 overflow-hidden flex flex-col group">
              <div className="relative aspect-[16/9] w-full bg-[#1A1816]">
                <Image
                  src={post.coverImage || '/images/article-placeholder.svg'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#A8A19A]">
                    <Calendar className="w-3.5 h-3.5 text-[#E2C2A0]" />
                    <span>{formatDateShort(post.createdAt)}</span>
                  </div>

                  <h3 className="font-serif text-lg text-[#F4EFEA] group-hover:text-[#E2C2A0] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#A8A19A] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#E2C2A0] font-medium hover:text-[#EDD5BE]"
                  >
                    <span>Ler artigo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

