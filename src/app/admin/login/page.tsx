'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.')
      }

      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na autenticação.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0A09] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glow decorativo de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E2C2A0]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
        {/* Logo e cabeçalho */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo href="/" />
          </div>
          <div className="space-y-1">
            <h1 className="heading-serif text-2xl text-[#F4EFEA]">
              Painel Administrativo
            </h1>
            <p className="text-xs text-[#A8A19A]">
              Acesso restrito para gestão do site e leads
            </p>
          </div>
        </div>

        {/* Card de Login */}
        <div className="rounded-[24px] bg-[#161413] border border-[rgba(255,255,255,0.08)] p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail de Acesso"
              type="email"
              name="email"
              placeholder="admin@vanessarodrigues.adv.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Input
              label="Senha"
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={<Lock className="w-4 h-4" />}
            >
              Entrar no Painel
            </Button>
          </form>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[#A8A19A]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E2C2A0]" />
              <span>Sessão segura e criptografada</span>
            </div>

            <Link href="/" className="hover:text-[#E2C2A0] transition-colors">
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

