import {spawnSync,spawn} from 'node:child_process'
import {randomBytes} from 'node:crypto'
import {mkdirSync,rmSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const root=resolve('.test-data');mkdirSync(root,{recursive:true})
const env={...process.env,DATABASE_URL:'file:../.test-data/e2e.db',UPLOAD_PROVIDER:'local',JWT_SECRET:randomBytes(48).toString('hex'),ADMIN_EMAIL:'test@example.com',ADMIN_PASSWORD:'Test-only-password-42!',NEXT_PUBLIC_SITE_URL:'http://localhost:3100',TRUST_PROXY:'false'}
rmSync(resolve(root,'e2e.db'),{force:true})
writeFileSync(resolve(root,'e2e.db'),Buffer.alloc(0))
for(const args of [['scripts/database.mjs','generate'],['node_modules/prisma/build/index.js','db','push','--schema','prisma/schema.prisma','--skip-generate'],['--import','tsx','prisma/seed.ts']]){const r=spawnSync(process.execPath,args,{stdio:'inherit',env});if(r.status)process.exit(r.status)}
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--port','3100'],{stdio:'inherit',env})
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{child.kill(signal);process.exit()})
child.on('exit',code=>process.exit(code || 0))
