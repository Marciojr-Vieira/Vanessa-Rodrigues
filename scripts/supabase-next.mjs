import { loadEnvFile } from 'node:process'
import { spawnSync } from 'node:child_process'

// Load credentials into the environment without forwarding --env-file to Next workers.
loadEnvFile('.env.supabase')
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', ...process.argv.slice(2)], {
  stdio: 'inherit', env: process.env,
})
process.exit(result.status ?? 1)
