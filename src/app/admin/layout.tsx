import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
export const metadata = { robots: { index:false, follow:false } }
import { getAuthUser } from '@/lib/auth'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()
  const pathname = (await headers()).get('x-pathname')
  if (pathname === '/admin/login') return <>{children}</>
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#0B0A09] text-[#F4EFEA] flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <main className="flex-1 md:pl-64 min-h-screen pt-14 md:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

