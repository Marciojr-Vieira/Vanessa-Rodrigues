import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { signingKey } from './security'

const COOKIE_NAME = 'vr-session'
const EXPIRATION = '7d'
const EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000

export interface SessionPayload extends JWTPayload {
  userId: string
  sessionId: string
  role: string
}

export async function createSession(userId: string, role: string, ip?: string, userAgent?: string) {
  const expiresAt = new Date(Date.now() + EXPIRATION_MS)

  const session = await prisma.session.create({
    data: {
      userId,
      token: crypto.randomUUID(),
      expiresAt,
      ip: ip || null,
      userAgent: userAgent || null,
    },
  })

  const token = await new SignJWT({ userId, sessionId: session.id, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(EXPIRATION)
    .setIssuedAt()
    .sign(signingKey())

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return { token, session }
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ['HS256'] }) as { payload: SessionPayload }

    // Verify session still exists in DB
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
    })

    if (!session || session.userId !== payload.userId || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }
      return null
    }

    const user=await prisma.user.findUnique({where:{id:session.userId},select:{role:true}})
    if(!user)return null
    return {...payload,role:user.role}
  } catch {
    return null
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return

    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ['HS256'] }) as { payload: SessionPayload }
    await prisma.session.delete({ where: { id: payload.sessionId } }).catch(() => {})

    cookieStore.delete(COOKIE_NAME)
  } catch {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  }
}

export async function getAuthUser() {
  const session = await verifySession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  return user
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }
  return user
}

export async function renewSession() {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')
  const expiresAt = new Date(Date.now() + EXPIRATION_MS)
  await prisma.session.update({ where: { id: session.sessionId }, data: { expiresAt } })
  const token = await new SignJWT({userId:session.userId,sessionId:session.sessionId,role:session.role})
    .setProtectedHeader({alg:'HS256'}).setExpirationTime(EXPIRATION).setIssuedAt().sign(signingKey())
  ;(await cookies()).set(COOKIE_NAME,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',expires:expiresAt,path:'/'})
}
