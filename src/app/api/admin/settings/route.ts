import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cmsSchema } from '@/lib/cms'
import { apiError,assertSameOrigin } from '@/lib/security'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'
export async function GET(){try{await requireAdmin();return Response.json({settings:await prisma.siteSettings.findUnique({where:{id:'singleton'}})})}catch(e){return apiError(e)}}
export async function PUT(request:Request){
 try{assertSameOrigin(request);const user=await requireAdmin();const data=cmsSchema('settings').parse(await request.json());const settings=await prisma.siteSettings.update({where:{id:'singleton'},data});await logAudit({userId:user.id,action:'UPDATE',entity:'SiteSettings',entityId:'singleton'});revalidatePath('/','layout');return Response.json({settings,success:true})}catch(e){return apiError(e)}
}
