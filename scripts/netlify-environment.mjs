export function netlifyEnvironment(input) {
  const env = {...input}
  for (const name of ['DATABASE_URL', 'JWT_SECRET', 'SUPABASE_URL']) {
    if (!env[name] || env[name].startsWith('CHANGE_ME')) throw new Error(`Configure ${name} nas variáveis da Netlify.`)
  }
  if (!/^postgres(ql)?:/.test(env.DATABASE_URL)) throw new Error('A Netlify exige DATABASE_URL PostgreSQL, não SQLite.')
  if (env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres.')
  if (!env.SUPABASE_SECRET_KEY && !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Configure a chave de servidor do Supabase para os uploads.')
  const origin = env.CONTEXT && env.CONTEXT !== 'production'
    ? env.DEPLOY_PRIME_URL
    : env.NEXT_PUBLIC_SITE_URL || env.URL
  if (!origin) throw new Error('Configure NEXT_PUBLIC_SITE_URL com o domínio HTTPS do site.')
  const url = new URL(origin)
  if (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname) || url.username || url.password) {
    throw new Error('A origem publicada precisa usar HTTPS e um domínio público.')
  }
  env.NEXT_PUBLIC_SITE_URL = url.origin
  env.DIRECT_URL ||= env.DATABASE_URL
  env.UPLOAD_PROVIDER = 'supabase'
  delete env.DOCKER_BUILD
  return env
}
