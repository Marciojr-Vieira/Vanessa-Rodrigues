import {sendHeartbeat} from '../lib/heartbeat.mjs'

export default async function handler() {
  try {
    const result = await sendHeartbeat()
    console.log(JSON.stringify({job: 'supabase-heartbeat', ...result}))
  } catch (error) {
    // Never include connection strings or database errors containing credentials in logs.
    console.error(JSON.stringify({job: 'supabase-heartbeat', status: 'failed', code: error.code || 'HEARTBEAT_ERROR'}))
    throw new Error('Heartbeat do Supabase falhou. Confira as variáveis e a conectividade do banco.')
  }
}
