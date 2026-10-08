import { notFound, redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { cmsModules } from '@/lib/cms-config'
import { CmsEditor } from '@/components/admin/CmsEditor'
import { MediaLibrary } from '@/components/admin/MediaLibrary'
import { SecurityPanel } from '@/components/admin/SecurityPanel'
export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
 const user=await getAuthUser();if(!user)redirect('/admin/login')
 const {module}=await params
 if(module==='media')return <MediaLibrary/>
 if(module==='users')return <SecurityPanel admin={user.role==='ADMIN'}/>
 if(module==='content')return <div className="space-y-12">{['hero','services','about','authority','steps','final'].map(key=><CmsEditor key={key} module={key}/>)}</div>
 if(!Object.hasOwn(cmsModules,module))notFound()
 if(cmsModules[module].adminOnly && user.role!=='ADMIN')return <p>Este módulo é exclusivo para administradores.</p>
 if(module==='recovery')return <div className="space-y-12"><CmsEditor module="recoveryContent"/><CmsEditor module="recovery"/></div>
 return <CmsEditor module={module}/>
}
