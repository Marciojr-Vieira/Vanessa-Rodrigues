import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { apiError,assertSameOrigin } from '@/lib/security'
type Context={params:Promise<{id:string}>}
export async function GET(_request:Request,{params}:Context){
 try{await requireAdmin();const {id}=await params;const lead=await prisma.lead.findUnique({where:{id}});if(!lead)throw new Error('NotFound');return Response.json({lead,success:true})}catch(e){return apiError(e)}
}
export async function PATCH(request:Request,{params}:Context){
 try{assertSameOrigin(request);const user=await requireAdmin();const {id}=await params;const data=z.object({status:z.enum(['NEW','CONTACTED','SERVED','ARCHIVED']).optional(),notes:z.string().max(10000).optional()}).strict().parse(await request.json());const lead=await prisma.lead.update({where:{id},data});await logAudit({userId:user.id,action:'UPDATE',entity:'Lead',entityId:id});return Response.json({lead,success:true})}catch(e){return apiError(e)}
}
export async function DELETE(request:Request,{params}:Context){
 try{assertSameOrigin(request);const user=await requireAdmin();const {id}=await params;await prisma.lead.delete({where:{id}});await logAudit({userId:user.id,action:'DELETE',entity:'Lead',entityId:id});return Response.json({success:true})}catch(e){return apiError(e)}
}
