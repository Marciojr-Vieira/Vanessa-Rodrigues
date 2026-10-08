import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { apiError,assertSameOrigin } from '@/lib/security'
import { uploadFile,deleteFile } from '@/lib/upload'
import { logAudit } from '@/lib/audit'
export async function GET(){
 try{await requireAuth();return Response.json({records:await prisma.mediaFile.findMany({orderBy:{createdAt:'desc'}})})}catch(e){return apiError(e)}
}
export async function POST(request:Request){
 try{
  assertSameOrigin(request);const user=await requireAuth();const data=await request.formData()
  const file=data.get('file');const alt=z.string().trim().min(1).max(500).parse(data.get('alt'))
  if(!(file instanceof File))return Response.json({error:'Selecione uma imagem.'},{status:400})
  let record
  try{record=await uploadFile(file,alt)}catch{return Response.json({error:'Imagem inválida. Envie JPG, PNG, WebP, GIF ou ICO de até 5 MB.'},{status:400})}
  await logAudit({userId:user.id,action:'CREATE',entity:'MediaFile',entityId:record.id})
  return Response.json({record})
 }catch(e){return apiError(e)}
}
export async function PATCH(request:Request){
 try{assertSameOrigin(request);const user=await requireAuth();const {id,alt}=z.object({id:z.string().min(1),alt:z.string().trim().min(1).max(500)}).strict().parse(await request.json());await prisma.mediaFile.update({where:{id},data:{alt}});await logAudit({userId:user.id,action:'UPDATE',entity:'MediaFile',entityId:id});return Response.json({success:true})}catch(e){return apiError(e)}
}
export async function DELETE(request:Request){
 try{
  assertSameOrigin(request);const user=await requireAuth();const {id}=z.object({id:z.string().min(1)}).strict().parse(await request.json())
  const record=await prisma.mediaFile.findUnique({where:{id}});if(!record)throw new Error('NotFound')
  const references=await Promise.all([prisma.siteSettings.count({where:{OR:[{logoUrl:record.url},{faviconUrl:record.url}]}}),prisma.heroContent.count({where:{photoUrl:record.url}}),prisma.aboutContent.count({where:{photoUrl:record.url}}),prisma.practiceArea.count({where:{OR:[{imageUrl:record.url},{content:{contains:record.url}}]}}),prisma.blogPost.count({where:{OR:[{coverImage:record.url},{content:{contains:record.url}}]}}),prisma.seoSettings.count({where:{ogImage:record.url}}),prisma.legalPage.count({where:{content:{contains:record.url}}})])
  if(references.some(Boolean))return Response.json({error:'Esta imagem está em uso. Substitua-a no conteúdo antes de excluir.'},{status:409})
  await deleteFile(record.filename,record);await logAudit({userId:user.id,action:'DELETE',entity:'MediaFile',entityId:id});return Response.json({success:true})
 }catch(e){return apiError(e)}
}
