export type UserRole = 'ADMIN' | 'EDITOR'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'SERVED' | 'ARCHIVED'
export type LeadType = 'EMPRESA' | 'TRABALHADOR' | 'CONTA'
export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface Seal {
  icon: string
  text: string
}

export interface Pillar {
  icon: string
  title: string
}

export interface SiteSettingsData {
  siteName: string
  oab: string
  whatsapp: string
  email: string
  address: string
  city: string
  instagram: string
  linktree: string
  logoUrl: string | null
  faviconUrl: string | null
  whatsappMsgEmpresa: string
  whatsappMsgTrabalhador: string
  whatsappMsgConta: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

