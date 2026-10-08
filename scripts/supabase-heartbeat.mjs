import {sendHeartbeat} from '../netlify/lib/heartbeat.mjs'

try {
  console.log(JSON.stringify(await sendHeartbeat()))
} catch {
  console.error('Heartbeat falhou. Confira DATABASE_URL e aplique as migrações antes de executar.')
  process.exitCode = 1
}
