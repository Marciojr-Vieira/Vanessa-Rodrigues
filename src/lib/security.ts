import { z } from 'zod'
import { Prisma } from '@prisma/client'

export { signingKey } from './signing-key'

export function assertSameOrigin(request: Request) {
  const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin
  if (request.headers.get('origin') !== expected) throw new Error('CSRF')
}

export function apiError(error: unknown) {
  if (error instanceof z.ZodError || error instanceof SyntaxError) return Response.json({ error: 'Dados inválidos. Confira os campos.', issues: error instanceof z.ZodError ? error.flatten() : undefined }, { status: 400 })
  if (error instanceof Error) {
    const status = ({ Unauthorized: 401, Forbidden: 403, CSRF: 403, NotFound: 404 } as Record<string, number>)[error.message]
    if (status) return Response.json({ error: status === 401 ? 'Sessão expirada. Entre novamente.' : 'Operação não permitida.' }, { status })
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return Response.json({ error: 'Este endereço ou e-mail já está em uso.' }, { status: 409 })
    if (error.code === 'P2025') return Response.json({ error: 'Registro não encontrado.' }, { status: 404 })
  }
  console.error('Erro na operação administrativa', error)
  return Response.json({ error: 'Não foi possível concluir a operação.' }, { status: 500 })
}

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().max(25).refine(value => /^\d{10,15}$/.test(value.replace(/\D/g, ''))),
  type: z.enum(['EMPRESA', 'TRABALHADOR', 'CONTA']),
  message: z.string().trim().max(5000).optional().default(''),
  consent: z.literal(true),
  website_url: z.string().max(200).optional().default(''),
})

export function csvCell(value: unknown) {
  const text = String(value ?? '')
  return '"' + (/^[\s]*[=+\-@]/.test(text) ? "'" : '') + text.replace(/"/g, '""') + '"'
}
