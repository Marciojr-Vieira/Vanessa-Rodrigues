import { supabaseAdmin } from '../src/lib/supabase-admin'
import { storageConfig } from '../src/lib/supabase-config'

async function main() {
  const client = supabaseAdmin()
  const { bucket } = storageConfig()
  const { data: existing, error: lookupError } = await client.storage.getBucket(bucket)
  if (lookupError && !['404', '400'].includes(String(lookupError.status))) throw lookupError
  if (existing && !existing.public) throw new Error('O bucket existente é privado. Escolha um novo nome para as imagens públicas do site.')
  const options = {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'],
  }
  const result = existing
    ? await client.storage.updateBucket(bucket, options)
    : await client.storage.createBucket(bucket, options)
  if (result.error) throw result.error
  console.log('Bucket de imagens configurado: ' + bucket)
  console.log('Leitura pública de imagens; gravação apenas pelo servidor autenticado.')
}
main().catch(() => {
  console.error('Não foi possível configurar o Storage. Confira SUPABASE_URL e a chave secreta do servidor.')
  process.exitCode = 1
})
