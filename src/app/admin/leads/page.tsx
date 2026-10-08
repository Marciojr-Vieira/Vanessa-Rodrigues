'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Download, Trash2, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Textarea } from '@/components/ui/Textarea'
import { formatDateShort } from '@/lib/utils'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface LeadItem {
  id: string
  name: string
  whatsapp: string
  type: string
  message: string | null
  status: string
  notes: string | null
  createdAt: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editNotes, setEditNotes] = useState('')
  const [editStatus, setEditStatus] = useState('NEW')
  const [saving, setSaving] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (typeFilter) params.set('type', typeFilter)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/admin/leads?${params.toString()}`)
      const data = await res.json()
      if (data.leads) setLeads(data.leads)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, statusFilter])

  useEffect(() => {
    const timer = setTimeout(() => { void fetchLeads() }, 200)
    return () => clearTimeout(timer)
  }, [fetchLeads])

  const handleOpenLead = (lead: LeadItem) => {
    setSelectedLead(lead)
    setEditNotes(lead.notes || '')
    setEditStatus(lead.status)
    setModalOpen(true)
  }

  const handleSaveLead = async () => {
    if (!selectedLead) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      })
      const data = await res.json()
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, status: editStatus, notes: editNotes } : l))
        )
        setModalOpen(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Deseja realmente excluir este lead permanentemente?')) return
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id))
        if (selectedLead?.id === id) setModalOpen(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const statusMap: Record<string, { label: string; color: string }> = {
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <h1 className="heading-serif text-3xl text-[#F4EFEA]">
            Leads &amp; Contatos
          </h1>
          <p className="text-xs text-[#A8A19A] mt-1">
            Gerenciamento de solicitações de atendimento e triagem jurídica
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ButtonLink href="/api/admin/leads/export" download variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
              Exportar CSV
            </ButtonLink>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="p-5 rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-5 flex items-center gap-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#A8A19A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, WhatsApp ou mensagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
              className="w-full bg-[#0B0A09] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4EFEA] border border-[rgba(255,255,255,0.08)] focus:border-[#E2C2A0] focus:outline-none"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={fetchLeads}>
            Buscar
          </Button>
        </div>

        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#0B0A09] rounded-xl px-3 py-2.5 text-xs text-[#F4EFEA] border border-[rgba(255,255,255,0.08)] focus:border-[#E2C2A0] focus:outline-none"
          >
            <option value="">Todos os tipos de atendimento</option>
            <option value="CONTA">Recuperação de Conta</option>
            <option value="EMPRESA">Direito Empresarial</option>
            <option value="TRABALHADOR">Direito Trabalhador</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0B0A09] rounded-xl px-3 py-2.5 text-xs text-[#F4EFEA] border border-[rgba(255,255,255,0.08)] focus:border-[#E2C2A0] focus:outline-none"
          >
            <option value="">Todos os status</option>
            <option value="NEW">Novo (Pendente)</option>
            <option value="CONTACTED">Em Contato</option>
            <option value="SERVED">Atendido</option>
            <option value="ARCHIVED">Arquivado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="rounded-2xl bg-[#161413] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#A8A19A]">Carregando leads...</div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#A8A19A]">Nenhum lead encontrado com os filtros atuais.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0A09]/80 text-[#A8A19A] uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-3.5 px-5">Data</th>
                  <th className="py-3.5 px-5">Nome</th>
                  <th className="py-3.5 px-5">WhatsApp</th>
                  <th className="py-3.5 px-5">Tipo</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#A8A19A]">
                {leads.map((lead) => {
                  const statusInfo = statusMap[lead.status] || { label: lead.status, color: '' }
                  const whatsappUrl = buildWhatsAppUrl(
                    lead.whatsapp,
                    `Olá, ${lead.name}! Sou da equipe jurídica da Dra. Vanessa Rodrigues. Recebemos sua solicitação em nosso site.`
                  )

                  return (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5 text-[#A8A19A]">
                        {formatDateShort(lead.createdAt)}
                      </td>
                      <td className="py-4 px-5 font-medium text-[#F4EFEA]">
                        {lead.name}
                      </td>
                      <td className="py-4 px-5">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E2C2A0] hover:underline inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>{lead.whatsapp}</span>
                        </a>
                      </td>
                      <td className="py-4 px-5">
                        {typeLabels[lead.type] || lead.type}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#F4EFEA] hover:text-[#E2C2A0] transition-colors"
                        >
                          Ver &amp; Anotar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes e Anotações Internas */}
      {modalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161413] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
              <div>
                <h3 className="heading-serif text-xl text-[#F4EFEA]">
                  Detalhes do Lead
                </h3>
                <span className="text-[11px] text-[#A8A19A]">ID: {selectedLead.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#A8A19A] hover:text-[#F4EFEA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0A09]">
                <div>
                  <span className="text-[#A8A19A] block">Nome:</span>
                  <span className="text-[#F4EFEA] font-medium">{selectedLead.name}</span>
                </div>
                <div>
                  <span className="text-[#A8A19A] block">WhatsApp:</span>
                  <span className="text-[#E2C2A0] font-medium">{selectedLead.whatsapp}</span>
                </div>
                <div>
                  <span className="text-[#A8A19A] block">Tipo de Demanda:</span>
                  <span className="text-[#F4EFEA]">{typeLabels[selectedLead.type] || selectedLead.type}</span>
                </div>
                <div>
                  <span className="text-[#A8A19A] block">Data do Envio:</span>
                  <span className="text-[#F4EFEA]">{new Date(selectedLead.createdAt).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              {selectedLead.message && (
                <div>
                  <span className="text-[#A8A19A] block mb-1">Mensagem do Cliente:</span>
                  <p className="p-3.5 rounded-xl bg-[#0B0A09] text-[#A8A19A] whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div className="space-y-1.5">
                <label className="text-[#A8A19A] block font-medium">Status do Atendimento:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#0B0A09] rounded-xl px-3 py-2.5 text-xs text-[#F4EFEA] border border-[rgba(255,255,255,0.08)] focus:border-[#E2C2A0] focus:outline-none"
                >
                  <option value="NEW">Novo (Pendente)</option>
                  <option value="CONTACTED">Em Contato</option>
                  <option value="SERVED">Atendido / Contrato Formalizado</option>
                  <option value="ARCHIVED">Arquivado / Não Viável</option>
                </select>
              </div>

              {/* Anotações Internas */}
              <div className="space-y-1.5">
                <label className="text-[#A8A19A] block font-medium">Anotações Internas do Escritório:</label>
                <Textarea
                  rows={4}
                  placeholder="Ex: Entramos em contato via WhatsApp dia 07/10. Solicitamos os prints do e-mail de segurança da Meta. Aguardando documentos."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" isLoading={saving} onClick={handleSaveLead}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
