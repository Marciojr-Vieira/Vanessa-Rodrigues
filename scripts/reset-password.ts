import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
const prisma=new PrismaClient()
async function main(){
 const email=z.email().parse(process.env.ADMIN_EMAIL).toLowerCase()
 const password=z.string().min(12).max(128).refine(p=>!p.startsWith('CHANGE_ME')).parse(process.env.RESET_PASSWORD)
 const user=await prisma.user.findUniqueOrThrow({where:{email}})
 await prisma.$transaction([prisma.user.update({where:{id:user.id},data:{password:await bcrypt.hash(password,12)}}),prisma.session.deleteMany({where:{userId:user.id}}),prisma.auditLog.create({data:{userId:user.id,action:'UPDATE',entity:'PasswordResetCLI'}})])
 console.log('Senha redefinida e sessões encerradas.')
}
main().catch(()=>{console.error('Confira ADMIN_EMAIL e RESET_PASSWORD (mínimo 12 caracteres).');process.exitCode=1}).finally(()=>prisma.$disconnect())
