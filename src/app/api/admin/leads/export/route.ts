import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { apiError,csvCell } from '@/lib/security'
export async function GET(){
 try{
  await requireAdmin();const leads=await prisma.lead.findMany({orderBy:{createdAt:'desc'}})
  const headers=['ID','Data/Hora','Nome','WhatsApp','Tipo','Status','Mensagem','Anotações']
  const rows=leads.map(l=>[l.id,l.createdAt.toISOString(),l.name,l.whatsapp,l.type,l.status,l.message,l.notes].map(csvCell).join(';'))
  return new Response('\uFEFF'+[headers.map(csvCell).join(';'),...rows].join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="contatos.csv"','Cache-Control':'no-store'}})
 }catch(e){return apiError(e)}
}
