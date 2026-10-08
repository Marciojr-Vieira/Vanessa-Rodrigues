import pg from 'pg'
import {supabaseCa} from './supabase-ca.mjs'

export function heartbeatQuery(schema = 'vanessa') {
  if (!/^[A-Za-z_][A-Za-z0-9_]{0,62}$/.test(schema)) throw new Error('Schema inválido para o heartbeat.')
  return `INSERT INTO "${schema}"."ServiceHeartbeat" ("id", "lastSentAt", "source", "runs")
    VALUES ($1, timezone('UTC', now()), 'netlify', 1)
    ON CONFLICT ("id") DO UPDATE
    SET "lastSentAt" = EXCLUDED."lastSentAt", "source" = 'netlify',
        "runs" = "ServiceHeartbeat"."runs" + 1
    WHERE "ServiceHeartbeat"."lastSentAt" IS NULL
       OR "ServiceHeartbeat"."lastSentAt" <= EXCLUDED."lastSentAt" - interval '6 days'
    RETURNING "lastSentAt", "runs"`
}

export async function sendHeartbeat({databaseUrl = process.env.DATABASE_URL} = {}) {
  if (!databaseUrl || !/^postgres(ql)?:/.test(databaseUrl)) throw new Error('Configure DATABASE_URL PostgreSQL para a rotina.')
  const connection = new URL(databaseUrl)
  const schema = connection.searchParams.get('schema') || 'vanessa'
  const query = heartbeatQuery(schema)
  // pg URL SSL options override the explicit certificate config. Keep strict TLS below.
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat']) connection.searchParams.delete(key)
  const supabaseHost = /(^|\.)supabase\.(com|co)$/.test(connection.hostname)
  const pool = new pg.Pool({
    connectionString: connection.toString(),
    ssl: {
      rejectUnauthorized: true,
      ...(supabaseHost ? {ca: supabaseCa} : {}),
    },
    max: 1,
    connectionTimeoutMillis: 10000,
    statement_timeout: 10000,
    query_timeout: 15000,
  })
  try {
    const result = await pool.query(query, ['netlify-supabase'])
    return result.rowCount ? {status: 'sent', ...result.rows[0]} : {status: 'skipped'}
  } finally {
    await pool.end()
  }
}
