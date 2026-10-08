import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Erro em /api/auth/me:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

