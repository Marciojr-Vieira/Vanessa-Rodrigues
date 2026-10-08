import {describe, expect, it, vi, beforeEach} from 'vitest'
import {netlifyEnvironment} from '../scripts/netlify-environment.mjs'

const {query, end, Pool} = vi.hoisted(() => {
 const query=vi.fn(), end=vi.fn()
 const Pool=vi.fn(function(config:unknown){return {query,end,config}})
 return {query,end,Pool}
})
vi.mock('pg',()=>({default:{Pool}}))
import {sendHeartbeat} from '../netlify/lib/heartbeat.mjs'

const env={DATABASE_URL:'postgresql://test:test@localhost:5432/test?schema=vanessa',JWT_SECRET:'test-only-secret-at-least-32-characters',SUPABASE_URL:'https://example.supabase.co',SUPABASE_SECRET_KEY:'test-only-server-key',URL:'https://site.netlify.app',CONTEXT:'production'}

describe('Configuração Netlify',()=>{
 it('usa a origem da Netlify e força uploads persistentes',()=>{
  const result=netlifyEnvironment({...env,UPLOAD_PROVIDER:'local',DOCKER_BUILD:'true',NODE_ENV:'development'})
  expect(result.NODE_ENV).toBe('production')
  expect(result.NEXT_PUBLIC_SITE_URL).toBe('https://site.netlify.app')
  expect(result.UPLOAD_PROVIDER).toBe('supabase');expect(result.DOCKER_BUILD).toBeUndefined()
 })
 it('preview utiliza sua própria origem, sem herdar o domínio de produção',()=>{
  expect(netlifyEnvironment({...env,CONTEXT:'deploy-preview',DEPLOY_PRIME_URL:'https://deploy-preview-1--site.netlify.app',NEXT_PUBLIC_SITE_URL:'https://advogada.example'}).NEXT_PUBLIC_SITE_URL).toBe('https://deploy-preview-1--site.netlify.app')
 })
 it('ignora NEXT_PUBLIC_SITE_URL local e usa a origem da Netlify',()=>{
  expect(netlifyEnvironment({...env,NEXT_PUBLIC_SITE_URL:'http://localhost:3000'}).NEXT_PUBLIC_SITE_URL).toBe('https://site.netlify.app')
 })
 it('recusa SQLite, origem local e JWT fraco antes de compilar',()=>{
  expect(()=>netlifyEnvironment({...env,DATABASE_URL:'file:./dev.db'})).toThrow('PostgreSQL')
  expect(()=>netlifyEnvironment({...env,NEXT_PUBLIC_SITE_URL:'http://advogada.example'})).toThrow('HTTPS')
  expect(()=>netlifyEnvironment({...env,URL:undefined,NEXT_PUBLIC_SITE_URL:'http://localhost:3001'})).toThrow('NEXT_PUBLIC_SITE_URL')
  expect(()=>netlifyEnvironment({...env,JWT_SECRET:'weak'})).toThrow('32')
 })
})

describe('Rotina de atividade',()=>{
 beforeEach(()=>{vi.clearAllMocks();end.mockResolvedValue(undefined)})
 it('informa envio confirmado e fecha a conexão',async()=>{
  query.mockResolvedValue({rowCount:1,rows:[{lastSentAt:'2026-10-08T12:00:00Z',runs:1}]})
  expect(await sendHeartbeat({databaseUrl:env.DATABASE_URL})).toMatchObject({status:'sent',runs:1})
  expect(end).toHaveBeenCalledOnce()
 })
 it('não informa um envio quando o intervalo ainda não passou',async()=>{
  query.mockResolvedValue({rowCount:0,rows:[]})
  expect(await sendHeartbeat({databaseUrl:env.DATABASE_URL})).toEqual({status:'skipped'})
 })
 it('valida TLS com a CA pública do Supabase mesmo com sslmode na URL',async()=>{
  query.mockResolvedValue({rowCount:0,rows:[]})
  await sendHeartbeat({databaseUrl:'postgresql://test:test@aws-0-us-east-2.pooler.supabase.com:5432/test?sslmode=require&schema=vanessa'})
  const config=Pool.mock.calls[0][0] as unknown as {ssl:{rejectUnauthorized:boolean,ca:string},connectionString:string}
  expect(config.ssl.rejectUnauthorized).toBe(true)
  expect(config.ssl.ca).toContain('BEGIN CERTIFICATE')
  expect(config.connectionString).not.toContain('sslmode')
 })
 it('propaga falhas e encerra a conexão para uma nova tentativa',async()=>{
  query.mockRejectedValue(new Error('connection unavailable'))
  await expect(sendHeartbeat({databaseUrl:env.DATABASE_URL})).rejects.toThrow('unavailable')
  expect(end).toHaveBeenCalledOnce()
 })
 it('bloqueia um identificador de schema inválido antes de abrir o banco',async()=>{
  await expect(sendHeartbeat({databaseUrl:env.DATABASE_URL.replace('schema=vanessa','schema=vanessa%22%3B')})).rejects.toThrow('Schema inválido')
  expect(Pool).not.toHaveBeenCalled()
 })
})
