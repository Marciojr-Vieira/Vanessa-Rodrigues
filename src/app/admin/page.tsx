import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { CmsEditor } from '@/components/admin/CmsEditor'
import { Users, UserCheck, ShieldAlert, FileText, Settings, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDateShort } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const user=await requireAuth()
  if(user.role!=='ADMIN')return <CmsEditor module="hero"/>
  const clicks=await prisma.whatsAppClick.groupBy({by:['type'],_count:{id:true}})
  const [
    leadGroups,
    recentLeads,
    settings,
  ] = await Promise.all([
    prisma.lead.groupBy({ by: ['status', 'type'], _count: { id: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ])
  // One aggregate replaces five concurrent counts in the small Supabase pool.
  const countLeads = (matches: (group: typeof leadGroups[number]) => boolean) =>
    leadGroups.reduce((total, group) => total + (matches(group) ? group._count.id : 0), 0)
  const totalLeads = countLeads(() => true)
  const newLeads = countLeads(group => group.status === 'NEW')
  const contaLeads = countLeads(group => group.type === 'CONTA')
  const empresaLeads = countLeads(group => group.type === 'EMPRESA')
  const trabalhadorLeads = countLeads(group => group.type === 'TRABALHADOR')

  const statusLabels: Record<string, { label: string; color: string }> = {
    NEW: { label: 'Novo', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    CONTACTED: { label: 'Em Contato', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    SERVED: { label: 'Atendido', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    ARCHIVED: { label: 'Arquivado', color: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30' },
  }

  const typeLabels: Record<string, string> = {
    CONTA: 'Recuperação de Conta',
    EMPRESA: 'Direito Trabalhista Empresa',
    TRABALHADOR: 'Direito Trabalhador',
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <h1 className="heading-serif text-3xl text-[#F4EFEA]">
            Visão Geral
          </h1>
          <p className="text-xs text-[#A8A19A] mt-1">
            Métricas de atendimento, triagens recebidas e atalhos rápidos de administração
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E2C2A0] text-[#0B0A09] text-xs font-semibold hover:bg-[#EDD5BE] transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Ver Todos os Leads</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A8A19A]">
            <span>Total de Leads</span>
            <Users className="w-4 h-4 text-[#E2C2A0]" />
          </div>
          <p className="heading-serif text-3xl text-[#F4EFEA]">{totalLeads}</p>
          <p className="text-[11px] text-[#A8A19A]">Contatos cadastrados no sistema</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#161413] border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Leads Novos (Pendentes)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="heading-serif text-3xl text-emerald-300">{newLeads}</p>
          <p className="text-[11px] text-[#A8A19A]">Aguardando primeiro contato</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#161413] border border-[#E2C2A0]/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#E2C2A0]">
            <span>Recuperação de Contas</span>
            <ShieldAlert className="w-4 h-4 text-[#E2C2A0]" />
          </div>
          <p className="heading-serif text-3xl text-[#F4EFEA]">{contaLeads}</p>
          <p className="text-[11px] text-[#A8A19A]">Demandas de Direito Digital</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A8A19A]">
            <span>Demandas Trabalhistas</span>
            <UserCheck className="w-4 h-4 text-[#E2C2A0]" />
          </div>
          <p className="heading-serif text-3xl text-[#F4EFEA]">{empresaLeads + trabalhadorLeads}</p>
          <p className="text-[11px] text-[#A8A19A]">
            {empresaLeads} empresas • {trabalhadorLeads} trabalhadores
          </p>
        </div>
      </div>

      <section className="p-6 rounded-2xl bg-[#161413] border border-white/10"><h2 className="heading-serif text-xl mb-4">Cliques no WhatsApp por atendimento</h2><div className="flex flex-wrap gap-8">{['EMPRESA','TRABALHADOR','CONTA','GERAL'].map(type=><p key={type} className="text-sm text-[#A8A19A]">{typeLabels[type] || 'Geral'}: <strong className="text-[#E2C2A0]">{clicks.find(c=>c.type===type)?._count.id || 0}</strong></p>)}</div></section>

      {/* Grid de Seções: Últimos Contatos e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabela de Últimos Leads */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-serif text-xl text-[#F4EFEA]">
              Últimos Contatos Recebidos
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs text-[#E2C2A0] hover:underline inline-flex items-center gap-1"
            >
              <span>Gerenciar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A8A19A]">
              Nenhum contato recebido até o momento.
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {recentLeads.map((lead) => {
                const statusInfo = statusLabels[lead.status] || {
                  label: lead.status,
                  color: 'bg-neutral-500/10 text-neutral-400',
                }

                return (
                  <div
                    key={lead.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F4EFEA]">
                          {lead.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#A8A19A]">
                        <span>WhatsApp: {lead.whatsapp}</span>
                        <span>•</span>
                        <span>{typeLabels[lead.type] || lead.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-[#A8A19A]">
                        {formatDateShort(lead.createdAt)}
                      </span>
                      <Link
                        href={`/admin/leads?id=${lead.id}`}
                        className="text-xs text-[#E2C2A0] hover:underline"
                      >
                        Detalhes
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Atalhos Rápidos e Configurações */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-4">
            <h2 className="heading-serif text-xl text-[#F4EFEA]">
              Atalhos Rápidos
            </h2>

            <div className="space-y-2">
              <Link
                href="/admin/content"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-[#F4EFEA]"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#E2C2A0]" />
                  <span>Editar Textos da Home</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A8A19A]" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-[#F4EFEA]"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#E2C2A0]" />
                  <span>Configurar WhatsApp e OAB</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A8A19A]" />
              </Link>

              <Link
                href="/admin/blog"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs text-[#F4EFEA]"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#E2C2A0]" />
                  <span>Novo Artigo no Blog</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#A8A19A]" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] space-y-3">
            <h3 className="font-serif text-sm text-[#F4EFEA]">
              Informações Atuais da Cliente
            </h3>
            <div className="space-y-1.5 text-xs text-[#A8A19A]">
              <p>OAB: <span className="text-[#E2C2A0]">{settings?.oab || '[Não definido]'}</span></p>
              <p>WhatsApp: <span className="text-[#E2C2A0]">{settings?.whatsapp || '[Não definido]'}</span></p>
              <p>Instagram: <span className="text-[#E2C2A0]">{settings?.instagram || '[Não definido]'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
