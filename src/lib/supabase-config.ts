export const DEFAULT_SUPABASE_URL = 'https://xhuaolnvuijeyruonkmg.supabase.co'
export const DEFAULT_STORAGE_BUCKET = 'site-media'

export function storageConfig() {
  const url = new URL(process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL)
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SUPABASE_URL deve ser a origem HTTPS do projeto.')
  }
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(bucket)) throw new Error('SUPABASE_STORAGE_BUCKET inválido.')
  return { url: url.origin, bucket }
}

export function isSiteImageUrl(value: string) {
  if (!value) return true
  if (/^\/(?:uploads|images)\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes('..')) return true
  try {
    const config = storageConfig()
    const url = new URL(value)
    const prefix = '/storage/v1/object/public/' + config.bucket + '/media/'
    return url.origin === config.url && !url.search && !url.hash &&
      url.pathname.startsWith(prefix) &&
      /^[a-zA-Z0-9_-]+\.(webp|ico|png|jpg|jpeg)$/.test(url.pathname.slice(prefix.length))
  } catch { return false }
}
