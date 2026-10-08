import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { apiError } from '@/lib/security'
export async function GET(request:Request){
 try{
  await requireAdmin()
  const query=z.object({search:z.string().max(200).optional(),type:z.enum(['EMPRESA','TRABALHADOR','CONTA','']).optional(),status:z.enum(['NEW','CONTACTED','SERVED','ARCHIVED','']).optional()}).parse(Object.fromEntries(new URL(request.url).searchParams))
  const leads=await prisma.lead.findMany({where:{...(query.search?{OR:[{name:{contains:query.search}},{whatsapp:{contains:query.search}},{message:{contains:query.search}}]}:{}),...(query.type?{type:query.type}:{}),...(query.status?{status:query.status}:{})},orderBy:{createdAt:'desc'},take:1000})
  return Response.json({success:true,leads})
 }catch(e){return apiError(e)}
}
