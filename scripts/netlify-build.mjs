import {spawnSync} from 'node:child_process'
import {createRequire} from 'node:module'
import {netlifyEnvironment} from './netlify-environment.mjs'

// Netlify supplies credentials through its environment. No local env file is required.
const env = netlifyEnvironment(process.env)

// NODE_ENV=production makes npm skip devDependencies, but the build needs them (Tailwind loader).
const require = createRequire(import.meta.url)
try {
  require.resolve('@tailwindcss/turbopack')
} catch {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npm, ['install', '--include=dev', '--no-audit', '--no-fund'], {stdio: 'inherit', env: {...process.env, NODE_ENV: 'development'}})
  if (result.error || result.status !== 0) process.exit(result.status || 1)
}

for (const args of [
  ['scripts/database.mjs', 'generate'],
  ['node_modules/next/dist/bin/next', 'build'],
]) {
  const result = spawnSync(process.execPath, args, {stdio: 'inherit', env})
  if (result.error || result.status !== 0) process.exit(result.status || 1)
}
