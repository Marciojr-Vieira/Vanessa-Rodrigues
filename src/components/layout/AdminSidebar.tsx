'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Settings, FileText, Briefcase, ShieldAlert, HelpCircle, BookOpen, Image as ImageIcon, FileCode, UserCheck, ExternalLink, LogOut, Menu, X } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

interface AdminSidebarProps {
  user?: {
    name: string
    email: string
    role: string
  } | null
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!user || pathname === '/admin/login') return
    const renew = () => { if (document.visibilityState === 'visible') void fetch('/api/auth/renew', {method:'POST'}) }
    const timer = setInterval(renew, 15 * 60 * 1000)
    renew()
    return () => clearInterval(timer)
  }, [pathname, user])

  // Don't render sidebar on login page
  if (pathname === '/admin/login') {
    return null
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Leads & Contatos', href: '/admin/leads', icon: Users },
    { label: 'Configurações Gerais', href: '/admin/settings', icon: Settings },
    { label: 'Conteúdo da Home', href: '/admin/content', icon: FileText },
    { label: 'Áreas de Atuação', href: '/admin/areas', icon: Briefcase },
    { label: 'Recuperação de Contas', href: '/admin/recovery', icon: ShieldAlert },
    { label: 'Perguntas Frequentes', href: '/admin/faq', icon: HelpCircle },
    { label: 'Blog & Artigos', href: '/admin/blog', icon: BookOpen },
    { label: 'Biblioteca de Mídia', href: '/admin/media', icon: ImageIcon },
    { label: 'Páginas Legais (LGPD)', href: '/admin/pages', icon: FileCode },
    { label: 'SEO por página', href: '/admin/seo', icon: FileCode },
    { label: 'Depoimentos (opcional)', href: '/admin/testimonials', icon: FileText },
    { label: 'Usuários & Segurança', href: '/admin/users', icon: UserCheck },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      router.push('/admin/login')
    }
  }

  const content = (
    <div className="h-full flex flex-col justify-between p-5 bg-[#121010] border-r border-[rgba(255,255,255,0.08)] select-none">
      <div className="space-y-6">
        {/* Top Logo */}
        <div className="pt-2 px-2 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <Logo href="/admin" showText={true} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#A8A19A] hover:text-[#F4EFEA] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {menuItems.filter(item=>user?.role==='ADMIN' || !['/admin/leads','/admin/settings'].includes(item.href)).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[#E2C2A0] text-[#0B0A09] font-semibold shadow-md'
                      : 'text-[#A8A19A] hover:text-[#F4EFEA] hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B0A09]' : 'text-[#E2C2A0]'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Perfil & Ações de rodapé */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
        <div className="px-3 py-2 rounded-xl bg-[#161413] border border-[rgba(255,255,255,0.05)]">
          <p className="text-xs text-[#F4EFEA] font-medium truncate">
            {user?.name || 'Administrador'}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-[#A8A19A] truncate">{user?.email}</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#E2C2A0]/15 text-[#E2C2A0]">
              {user?.role || 'ADMIN'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs text-[#A8A19A] hover:text-[#F4EFEA] bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver site</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 transition-colors"
            title="Encerrar sessão"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Botão de abrir menu mobile no topo */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#121010] border-b border-[rgba(255,255,255,0.08)] px-4 py-3 flex items-center justify-between">
        <Logo href="/admin" showText={false} />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-[#F4EFEA] hover:bg-white/5"
          aria-label="Abrir menu administrativo"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="w-72 h-full bg-[#121010]">
            {content}
          </div>
        </div>
      )}

      {/* Desktop Sidebar fixo */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 z-30 flex-shrink-0">
        {content}
      </aside>
    </>
  )
}
