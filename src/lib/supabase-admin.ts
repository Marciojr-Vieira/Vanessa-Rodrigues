import { createClient } from '@supabase/supabase-js'
import { storageConfig } from './supabase-config'

// This module is consumed exclusively by server routes and maintenance scripts.
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key || key.startsWith('CHANGE_ME')) throw new Error('Configure SUPABASE_SECRET_KEY no servidor.')
  return createClient(storageConfig().url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
