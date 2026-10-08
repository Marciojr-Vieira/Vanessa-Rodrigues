import { afterEach, describe, expect, it, vi } from 'vitest'

const upload = vi.hoisted(() => vi.fn())
const remove = vi.hoisted(() => vi.fn())
vi.mock('../src/lib/supabase-admin', () => ({
  supabaseAdmin: () => ({storage: {from: () => ({
    upload, remove,
    getPublicUrl: (key: string) => ({data: {publicUrl: 'https://xhuaolnvuijeyruonkmg.supabase.co/storage/v1/object/public/site-media/' + key}}),
  })}}),
}))

import { isSiteImageUrl } from '../src/lib/supabase-config'
import { selectedImageStorage, storageFor, localImageStorage, supabaseImageStorage } from '../src/lib/image-storage'

afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })

describe('Supabase Storage', () => {
  it('aceita apenas imagens locais ou do projeto e bucket configurados', () => {
    expect(isSiteImageUrl('/images/vanessa-portrait.svg')).toBe(true)
    expect(isSiteImageUrl('https://xhuaolnvuijeyruonkmg.supabase.co/storage/v1/object/public/site-media/media/foto.webp')).toBe(true)
    expect(isSiteImageUrl('https://evil.example/foto.webp')).toBe(false)
    expect(isSiteImageUrl('https://xhuaolnvuijeyruonkmg.supabase.co/storage/v1/object/public/other/media/foto.webp')).toBe(false)
    expect(isSiteImageUrl('/uploads/../../secret')).toBe(false)
  })
  it('envia a imagem otimizada e registra o provedor e a chave do objeto', async () => {
    upload.mockResolvedValue({error: null})
    const buffer = Buffer.from('image')
    const result = await supabaseImageStorage.save('foto.webp', buffer, 'image/webp')
    expect(upload).toHaveBeenCalledWith('media/foto.webp', buffer, expect.objectContaining({contentType: 'image/webp', upsert: false}))
    expect(result).toMatchObject({storageProvider: 'supabase', storageBucket: 'site-media', objectKey: 'media/foto.webp'})
  })
  it('não registra sucesso quando o upload remoto falha', async () => {
    upload.mockResolvedValue({error: {message: 'failed'}})
    await expect(supabaseImageStorage.save('foto.webp', Buffer.alloc(1), 'image/webp')).rejects.toThrow('Falha ao enviar')
  })
  it('exclui pelo provedor registrado mesmo após trocar o provedor ativo', async () => {
    vi.stubEnv('UPLOAD_PROVIDER', 'supabase')
    expect(selectedImageStorage()).toBe(supabaseImageStorage)
    expect(storageFor({url:'/uploads/foto.webp',storageProvider:'local',storageBucket:null,objectKey:null})).toBe(localImageStorage)
    remove.mockResolvedValue({error: null})
    await supabaseImageStorage.remove('foto.webp', {url:'unused',storageProvider:'supabase',storageBucket:'site-media',objectKey:'media/foto.webp'})
    expect(remove).toHaveBeenCalledWith(['media/foto.webp'])
  })
  it('impede exclusão fora do bucket e caminho previstos', async () => {
    await expect(supabaseImageStorage.remove('foto.webp', {url:'unused',storageProvider:'supabase',storageBucket:'site-media',objectKey:'private/secret'})).rejects.toThrow('Localização')
    expect(remove).not.toHaveBeenCalled()
  })
})
