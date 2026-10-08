import { prisma } from './prisma'
interface RateLimitOptions {maxRequests:number;windowMs:number}
export async function checkRateLimit(key:string,options:RateLimitOptions={maxRequests:5,windowMs:60000}) {
 const now=new Date();
 if(Math.random()<.02)await prisma.rateLimitBucket.deleteMany({where:{resetAt:{lt:new Date(now.getTime()-86400000)}}})
 const resetAt=new Date(now.getTime()+options.windowMs)
 // The atomic upsert is shared by every application instance using this database.
 const rows=await prisma.$queryRawUnsafe<{count:number;resetAt:Date|number|string}[]>(
  'INSERT INTO "RateLimitBucket" ("key", "count", "resetAt") VALUES ($1, 1, $2) ON CONFLICT ("key") DO UPDATE SET "count" = CASE WHEN "RateLimitBucket"."resetAt" <= $3 THEN 1 ELSE "RateLimitBucket"."count" + 1 END, "resetAt" = CASE WHEN "RateLimitBucket"."resetAt" <= $3 THEN $2 ELSE "RateLimitBucket"."resetAt" END RETURNING "count", "resetAt"',
  key,resetAt,now)
 const entry=rows[0];const allowed=entry.count<=options.maxRequests
 return {allowed,remaining:Math.max(0,options.maxRequests-entry.count),retryAfterMs:allowed?0:Math.max(0,new Date(entry.resetAt).getTime()-now.getTime())}
}
export function loginRateLimit(key:string){return checkRateLimit('login:'+key,{maxRequests:5,windowMs:15*60000})}
export function contactRateLimit(ip:string){return checkRateLimit('contact:'+ip,{maxRequests:3,windowMs:60000})}
export function clientIp(request:Request){return (process.env.TRUST_PROXY==='true'?request.headers.get('x-forwarded-for')?.split(',')[0]?.trim():null) || 'local'}
