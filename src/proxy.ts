import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { signingKey } from '@/lib/signing-key'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && pathname.startsWith('/api/')) {
    const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin
    if (request.headers.get('origin') !== expected) return NextResponse.json({ error: 'Origem não permitida.' }, { status: 403 })
  }
  if ((pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')) && pathname !== '/admin/login') {
    try {
      await jwtVerify(request.cookies.get('vr-session')?.value || '', signingKey(), { algorithms: ['HS256'] })
    } catch {
      return pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
        : NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '') + "; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'" + (process.env.NODE_ENV === 'development' ? ' ws: wss:' : '') + "; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'")
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Cache-Control', 'no-store')
  }
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads|images).*)'] }
