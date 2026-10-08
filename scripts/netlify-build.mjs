import {spawnSync} from 'node:child_process'
import {netlifyEnvironment} from './netlify-environment.mjs'

// Netlify supplies credentials through its environment. No local env file is required.
const env = netlifyEnvironment(process.env)
for (const args of [
  ['scripts/database.mjs', 'generate'],
  ['node_modules/next/dist/bin/next', 'build'],
]) {
  const result = spawnSync(process.execPath, args, {stdio: 'inherit', env})
  if (result.error || result.status !== 0) process.exit(result.status || 1)
}
