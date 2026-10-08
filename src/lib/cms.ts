import { z } from 'zod'
import { prisma } from './prisma'
import { cmsModules } from './cms-config'
import { sanitizeHtml } from './sanitize'
import { isSiteImageUrl } from './supabase-config'
type Row = Record<string, unknown> & { id: string }
interface Delegate {
 findMany(args?: object): Promise<Row[]>
 findUnique(args: object): Promise<Row | null>
 create(args: object): Promise<Row>
 update(args: object): Promise<Row>
 upsert(args: object): Promise<Row>
 delete(args: object): Promise<Row>
}
const models = { settings: prisma.siteSettings, hero: prisma.heroContent, about: prisma.aboutContent, final: prisma.ctaFinalContent, services: prisma.serviceCard, areas: prisma.practiceArea, recovery: prisma.accountRecoveryType, recoveryContent: prisma.recoveryContent, authority: prisma.authorityStat, steps: prisma.howItWorksStep, faq: prisma.faqItem, blog: prisma.blogPost, pages: prisma.legalPage, seo: prisma.seoSettings, testimonials: prisma.testimonial }
export function cmsModel(module: string): Delegate {
 if (!Object.hasOwn(cmsModules,module)) throw new Error('NotFound')
 return models[module as keyof typeof models] as unknown as Delegate
}
export function cmsSchema(module: string) {
 const config = cmsModules[module]
 if (!Object.hasOwn(cmsModules,module)) throw new Error('NotFound')
 const fields: Record<string, z.ZodType> = {}
 for (const field of config.fields) {
  let schema: z.ZodType
  if (field.kind === 'boolean') schema = z.boolean()
  else if (field.kind === 'number') schema = z.number().int().min(0).max(10000)
  else if (field.kind === 'select') schema = z.enum(field.options as [string,...string[]])
  else if (field.kind === 'json') schema = z.string().max(20000).transform((value,ctx) => {
    try { const items = JSON.parse(value); z.array(z.object({icon: z.string().max(80), text: z.string().min(1).max(500).optional(), title: z.string().min(1).max(500).optional()})).max(20).parse(items); return JSON.stringify(items) }
    catch { ctx.addIssue({code:'custom',message:'Informe uma lista válida.'}); return z.NEVER }
  })
  else {
    let stringSchema = z.string().trim().max(field.kind === 'html' ? 100000 : field.kind === 'textarea' ? 10000 : 1000)
    if (field.required) stringSchema = stringSchema.min(1)
    if (field.key === 'slug') stringSchema = stringSchema.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    if (field.kind === 'image') stringSchema = stringSchema.refine(isSiteImageUrl, 'Selecione uma imagem da biblioteca.')
    if (field.key === 'canonical') stringSchema = stringSchema.refine(v => !v || /^https?:\/\//.test(v), 'Informe uma URL http(s).')
    if (field.key === 'ctaLink') stringSchema = stringSchema.refine(v => !v || /^(?:#[\w-]+|\/(?!\/)|https:\/\/)/.test(v), 'Destino inválido.')
    if (field.key === 'whatsapp') stringSchema=stringSchema.refine(v=>!v || v.startsWith('[') || /^\d{10,15}$/.test(v.replace(/\D/g,'')),'Informe país, DDD e número.')
    if (field.key === 'email') stringSchema=stringSchema.refine(v=>!v || v.startsWith('[') || z.email().safeParse(v).success,'E-mail inválido.')
    if (field.key === 'linktree') stringSchema=stringSchema.refine(v=>!v || v.startsWith('[') || /^https:\/\//.test(v),'Informe uma URL https.')
    schema = field.kind === 'html' ? stringSchema.transform(sanitizeHtml) : field.kind === 'image' ? z.preprocess(value => value === null ? '' : value, stringSchema) : stringSchema
  }
  fields[field.key] = field.required ? schema : schema.optional()
 }
 if (config.ordered) fields.order = z.number().int().min(0).max(10000).optional()
 return z.object(fields).strict()
}
