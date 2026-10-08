import { writeFile, mkdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import { supabaseAdmin } from './supabase-admin'
import { storageConfig } from './supabase-config'

export type StorageLocation = {
  url: string
  storageProvider: string
  storageBucket: string | null
  objectKey: string | null
}
export interface ImageStorage {
  save(filename: string, buffer: Buffer, mimeType: string): Promise<StorageLocation>
  remove(filename: string, location: StorageLocation): Promise<void>
}
function assertFilename(filename: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.includes('..')) throw new Error('Nome de arquivo inválido.')
}
const directory = path.join(process.cwd(), 'public', 'uploads')
export const localImageStorage: ImageStorage = {
  async save(filename, buffer) {
    assertFilename(filename)
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), buffer)
    return { url: '/uploads/' + filename, storageProvider: 'local', storageBucket: null, objectKey: null }
  },
  async remove(filename) {
    assertFilename(filename)
    await unlink(path.join(directory, filename)).catch(error => { if (error.code !== 'ENOENT') throw error })
  },
}
export const supabaseImageStorage: ImageStorage = {
  async save(filename, buffer, mimeType) {
    assertFilename(filename)
    const { bucket } = storageConfig()
    const objectKey = 'media/' + filename
    const client = supabaseAdmin()
    const { error } = await client.storage.from(bucket).upload(objectKey, buffer, {
      contentType: mimeType, cacheControl: '31536000', upsert: false,
    })
    if (error) throw new Error('Falha ao enviar a imagem para o Supabase Storage.')
    return {
      url: client.storage.from(bucket).getPublicUrl(objectKey).data.publicUrl,
      storageProvider: 'supabase', storageBucket: bucket, objectKey,
    }
  },
  async remove(filename, location) {
    assertFilename(filename)
    if (location.storageBucket !== storageConfig().bucket || location.objectKey !== 'media/' + filename) {
      throw new Error('Localização de armazenamento inválida.')
    }
    const { error } = await supabaseAdmin().storage.from(location.storageBucket).remove([location.objectKey])
    if (error) throw new Error('Falha ao excluir a imagem do Supabase Storage.')
  },
}
export function selectedImageStorage(): ImageStorage {
  const provider = process.env.UPLOAD_PROVIDER || 'local'
  if (provider === 'supabase') return supabaseImageStorage
  if (provider === 'local') {
    if (process.env.VERCEL) throw new Error('Configure UPLOAD_PROVIDER=supabase para uploads na Vercel.')
    return localImageStorage
  }
  throw new Error('UPLOAD_PROVIDER deve ser local ou supabase.')
}
export function storageFor(location: StorageLocation): ImageStorage {
  if (location.storageProvider === 'local') return localImageStorage
  if (location.storageProvider === 'supabase') return supabaseImageStorage
  throw new Error('Provedor de armazenamento desconhecido.')
}
