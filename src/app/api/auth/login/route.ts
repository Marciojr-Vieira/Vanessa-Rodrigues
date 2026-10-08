import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'
import { loginRateLimit,clientIp } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'
import { apiError,assertSameOrigin } from '@/lib/security'
const schema=z.object({email:z.email().max(200).transform(v=>v.trim().toLowerCase()),password:z.string().min(1).max(128)}).strict()
export async function POST(request:Request) {
 try{
  assertSameOrigin(request)
  const input=schema.parse(await request.json());const ip=clientIp(request)
  const checks=await Promise.all([loginRateLimit('ip:'+ip),loginRateLimit('email:'+input.email)])
  if(checks.some(c=>!c.allowed))return Response.json({error:'Muitas tentativas. Aguarde 15 minutos.'},{status:429,headers:{'Retry-After':String(Math.ceil(Math.max(...checks.map(c=>c.retryAfterMs))/1000))}})
  const user=await prisma.user.findUnique({where:{email:input.email}})
  const valid=await bcrypt.compare(input.password,user?.password || '$2b$12$4L9xgC0oJhCbRpYPdjRw4OG/DiIiLX.jNNmbTlwnyoSIAYBe2Sy/u')
  if(!user || !valid)return Response.json({error:'Credenciais inválidas.'},{status:401})
  const {session}=await createSession(user.id,user.role,ip,request.headers.get('user-agent') || undefined)
  await logAudit({userId:user.id,action:'LOGIN',entity:'Session',entityId:session.id})
  return Response.json({success:true,user:{id:user.id,name:user.name,email:user.email,role:user.role}})
 }catch(error){return apiError(error)}
}
