import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth,verifySession } from '@/lib/auth'
import { apiError,assertSameOrigin } from '@/lib/security'
import { logAudit } from '@/lib/audit'
const actions=z.discriminatedUnion('action',[
 z.object({action:z.literal('profile'),name:z.string().trim().min(2).max(120),email:z.email().max(200),currentPassword:z.string().max(200),password:z.string().min(12).max(128).optional()}),
 z.object({action:z.literal('create-user'),name:z.string().trim().min(2).max(120),email:z.email().max(200),password:z.string().min(12).max(128),role:z.enum(['ADMIN','EDITOR'])}),
 z.object({action:z.literal('revoke'),id:z.string().min(1).max(100)}),
 z.object({action:z.literal('role'),id:z.string().min(1).max(100),role:z.enum(['ADMIN','EDITOR'])}),
])
export async function GET(){
 try{const user=await requireAuth();const current=await verifySession();const [sessions,users,logs]=await Promise.all([prisma.session.findMany({where:{userId:user.id,expiresAt:{gt:new Date()}},select:{id:true,createdAt:true,expiresAt:true,ip:true,userAgent:true}}),user.role==='ADMIN'?prisma.user.findMany({select:{id:true,name:true,email:true,role:true}}):[],user.role==='ADMIN'?prisma.auditLog.findMany({orderBy:{createdAt:'desc'},take:50,include:{user:{select:{name:true}}}}):[]]);return Response.json({user,sessions,users,logs,currentSession:current?.sessionId})}catch(e){return apiError(e)}
}
export async function POST(request:Request){
 try{
  assertSameOrigin(request);const user=await requireAuth();const input=actions.parse(await request.json())
  if(input.action==='profile'){
   const stored=await prisma.user.findUniqueOrThrow({where:{id:user.id}})
   if(!await bcrypt.compare(input.currentPassword,stored.password))return Response.json({error:'Senha atual incorreta.'},{status:400})
   const current=await verifySession()
   await prisma.$transaction(async tx=>{
    await tx.user.update({where:{id:user.id},data:{name:input.name,email:input.email.toLowerCase(),...(input.password?{password:await bcrypt.hash(input.password,12)}:{})}})
    if(input.password)await tx.session.deleteMany({where:{userId:user.id,id:{not:current?.sessionId}}})
   })
  }else if(input.action==='revoke'){
   await prisma.session.deleteMany({where:{id:input.id,userId:user.id}})
  }else{
   if(user.role!=='ADMIN')throw new Error('Forbidden')
   if(input.action==='create-user')await prisma.user.create({data:{name:input.name,email:input.email.toLowerCase(),role:input.role,password:await bcrypt.hash(input.password,12)}})
   else {
    if(input.id===user.id)throw new Error('Forbidden')
    await prisma.$transaction([prisma.user.update({where:{id:input.id},data:{role:input.role}}),prisma.session.deleteMany({where:{userId:input.id}})])
   }
  }
  await logAudit({userId:user.id,action:'UPDATE',entity:'Security',details:{action:input.action}})
  return Response.json({success:true})
 }catch(e){return apiError(e)}
}
