import sharp from 'sharp'
import { prisma } from './prisma'
import { selectedImageStorage, storageFor, type StorageLocation } from './image-storage'
export async function uploadFile(file:File,alt:string) {
 if(!['image/jpeg','image/png','image/webp','image/gif','image/x-icon','image/vnd.microsoft.icon'].includes(file.type) || file.size===0 || file.size>5*1024*1024)throw new Error('Envie JPG, PNG, WebP, GIF ou ICO de até 5 MB.')
 const input=Buffer.from(await file.arrayBuffer())
 let buffer:Buffer;let filename:string;let mimeType:string
 if(['image/x-icon','image/vnd.microsoft.icon'].includes(file.type)){
  if(input.readUInt32LE(0)!==65536)throw new Error('Ícone inválido.')
  buffer=input;filename=crypto.randomUUID()+'.ico';mimeType='image/x-icon'
 }else{
  const image=sharp(input,{limitInputPixels:40000000})
  await image.metadata()
  buffer=await image.rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toBuffer()
  filename=crypto.randomUUID()+'.webp';mimeType='image/webp'
 }
 const storage=selectedImageStorage()
 const location=await storage.save(filename,buffer,mimeType)
 try{return await prisma.mediaFile.create({data:{filename,...location,originalName:file.name,mimeType,size:buffer.length,alt}})}
 catch(error){await storage.remove(filename,location);throw error}
}
export async function deleteFile(filename:string,location:StorageLocation){
 await storageFor(location).remove(filename,location)
 await prisma.mediaFile.deleteMany({where:{filename}})
}
