import { requireAuth } from '@/lib/auth'
import { cmsModel, cmsSchema } from '@/lib/cms'
import { cmsModules } from '@/lib/cms-config'
import { apiError, assertSameOrigin } from '@/lib/security'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
type Context = { params: Promise<{module: string}> }
async function access(module: string) {
 const user = await requireAuth()
 if (!Object.hasOwn(cmsModules,module)) throw new Error('NotFound')
 if (cmsModules[module].adminOnly && user.role !== 'ADMIN') throw new Error('Forbidden')
 return user
}
export async function GET(_request: Request, context: Context) {
 try {
  const {module} = await context.params; await access(module)
  const config = cmsModules[module]; const model = cmsModel(module)
  const records = config.singleton ? [await model.findUnique({where:{id:'singleton'}})].filter(Boolean) : await model.findMany({orderBy: config.ordered ? {order:'asc'} : {updatedAt:'desc'}})
  return Response.json({records})
 } catch(error) { return apiError(error) }
}
export async function POST(request: Request, context: Context) {
 try {
  assertSameOrigin(request)
  const {module} = await context.params; const user = await access(module)
  const envelope = z.object({id:z.string().max(100).optional(),data:z.unknown()}).strict().parse(await request.json())
  const data: Record<string,unknown> = cmsSchema(module).parse(envelope.data)
  if (module === 'blog') {
    const previous=envelope.id ? await cmsModel(module).findUnique({where:{id:envelope.id}}) : null
    data.authorId=previous?.authorId || user.id
    data.publishedAt=data.status==='PUBLISHED' ? previous?.publishedAt || new Date() : null
  }
  if(cmsModules[module].ordered && !envelope.id)data.order=(await cmsModel(module).findMany()).length
  const config = cmsModules[module]; const model = cmsModel(module)
  const record = config.singleton
   ? await model.upsert({where:{id:'singleton'},create:{...data,id:'singleton'},update:data})
   : envelope.id ? await model.update({where:{id:envelope.id},data}) : await model.create({data})
  await logAudit({userId:user.id,action:envelope.id || config.singleton ? 'UPDATE':'CREATE',entity:module,entityId:record.id})
  revalidatePath('/','layout')
  return Response.json({record,success:true})
 } catch(error) { return apiError(error) }
}
export async function DELETE(request: Request, context: Context) {
 try {
  assertSameOrigin(request)
  const {module} = await context.params; const user = await access(module)
  if(cmsModules[module].singleton || module === 'pages') throw new Error('Forbidden')
  const {id} = z.object({id:z.string().min(1).max(100)}).strict().parse(await request.json())
  await cmsModel(module).delete({where:{id}})
  await logAudit({userId:user.id,action:'DELETE',entity:module,entityId:id})
  revalidatePath('/','layout')
  return Response.json({success:true})
 } catch(error) { return apiError(error) }
}

