import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs'
import {resolve,dirname} from 'node:path'
import {spawnSync} from 'node:child_process'
import {loadEnvFile} from 'node:process'
try{loadEnvFile('.env')}catch{}
const provider=(process.env.DATABASE_URL || '').startsWith('postgres')?'postgresql':'sqlite'
if(provider==='postgresql' && !process.env.DIRECT_URL)process.env.DIRECT_URL=process.env.DATABASE_URL
let schema=readFileSync('prisma/schema.prisma','utf8').replace('provider = "sqlite"','provider = "'+provider+'"')
if(provider==='postgresql')schema=schema.replace('url      = env("DATABASE_URL")','url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")')
const schemaPath=provider==='sqlite'?'prisma/schema.prisma':'prisma/postgresql/schema.prisma'
if(provider!=='sqlite')mkdirSync('prisma/postgresql',{recursive:true})
if(provider!=='sqlite')writeFileSync(schemaPath,schema)
const operation=process.argv[2] || 'generate'
const run=args=>{const result=spawnSync(process.execPath,['node_modules/prisma/build/index.js',...args,'--schema',schemaPath],{stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status || 1)}
if(operation==='generate')run(['generate'])
else if(operation==='migrate') {
 if(provider==='sqlite'){
  const url=process.env.DATABASE_URL || 'file:./dev.db'
  const file=resolve('prisma',url.slice(5))
  if(!existsSync(file)){mkdirSync(dirname(file),{recursive:true});writeFileSync(file,Buffer.alloc(0))}
  run(['db','push'])
 }
 else {
  const direct=new URL(process.env.DIRECT_URL)
  if(direct.port==='6543' || direct.searchParams.get('pgbouncer')==='true')throw new Error('Migrações exigem DIRECT_URL direta ou pooler session (5432).')
  if(process.env.DIRECT_URL.includes('CHANGE_ME'))throw new Error('Preencha DIRECT_URL antes de executar as migrações.')
  const base='prisma/postgresql/migrations'
  // PostgreSQL migrations are tracked separately from the SQLite development schema.
  mkdirSync(base,{recursive:true})
  run(['migrate','deploy'])
 }
}else throw new Error('Comando inválido.')
