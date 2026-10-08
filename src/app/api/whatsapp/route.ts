import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit,clientIp } from '@/lib/rate-limit'
export async function GET(request:Request){
 const input=z.object({phone:z.string().regex(/^\d{10,15}$/),message:z.string().max(7000),type:z.enum(['EMPRESA','TRABALHADOR','CONTA','GERAL']).default('GERAL')}).safeParse(Object.fromEntries(new URL(request.url).searchParams))
 if(!input.success)return Response.redirect(new URL('/#contato',request.url))
 const settings=await prisma.siteSettings.findUnique({where:{id:'singleton'}})
 if(input.data.phone!==settings?.whatsapp.replace(/\D/g,''))return Response.redirect(new URL('/#contato',request.url))
 if((await checkRateLimit('click:'+clientIp(request),{maxRequests:30,windowMs:60000})).allowed)await prisma.whatsAppClick.create({data:{type:input.data.type}})
 return new Response(null,{status:302,headers:{Location:'https://wa.me/'+input.data.phone+'?text='+encodeURIComponent(input.data.message),'Cache-Control':'no-store'}})
}
