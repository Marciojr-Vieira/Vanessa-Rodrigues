import { prisma } from '@/lib/prisma'
import { contactRateLimit,clientIp } from '@/lib/rate-limit'
import { apiError,assertSameOrigin,contactSchema } from '@/lib/security'
export async function POST(request:Request){
 try{
  assertSameOrigin(request)
  const ip=clientIp(request);const rate=await contactRateLimit(ip)
  if(!rate.allowed)return Response.json({error:'Aguarde um minuto antes de enviar novamente.'},{status:429})
  const input=contactSchema.parse(await request.json())
  if(input.website_url)return Response.json({success:true})
  const lead=await prisma.lead.create({data:{name:input.name,whatsapp:input.whatsapp,type:input.type,message:input.message,consent:true,ip}})
  return Response.json({success:true,leadId:lead.id})
 }catch(error){return apiError(error)}
}
