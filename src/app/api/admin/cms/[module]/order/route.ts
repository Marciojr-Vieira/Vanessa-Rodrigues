import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { cmsModules } from '@/lib/cms-config'
import { cmsModel } from '@/lib/cms'
import { requireAuth } from '@/lib/auth'
import { apiError,assertSameOrigin } from '@/lib/security'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'
export async function PUT(request:Request,{params}:{params:Promise<{module:string}>}) {
 try {
  assertSameOrigin(request);const user=await requireAuth();const {module}=await params
  if(!cmsModules[module]?.ordered)throw new Error('NotFound')
  const {ids}=z.object({ids:z.array(z.string().min(1)).max(500).refine(ids=>new Set(ids).size===ids.length)}).strict().parse(await request.json())
  const rows=await cmsModel(module).findMany()
  if(rows.length!==ids.length || rows.some(r=>!ids.includes(r.id)))return Response.json({error:'A lista mudou. Recarregue antes de ordenar.'},{status:409})
  const names={services:'ServiceCard',areas:'PracticeArea',recovery:'AccountRecoveryType',authority:'AuthorityStat',steps:'HowItWorksStep',faq:'FaqItem'} as const
  const table=names[module as keyof typeof names]
  await prisma.$transaction(async tx=>{for(let i=0;i<ids.length;i++)await tx.$executeRawUnsafe('UPDATE "'+table+'" SET "order" = $1 WHERE "id" = $2',i,ids[i])})
  await logAudit({userId:user.id,action:'UPDATE',entity:module,details:{order:ids}})
  revalidatePath('/','layout');return Response.json({success:true})
 }catch(error){return apiError(error)}
}
