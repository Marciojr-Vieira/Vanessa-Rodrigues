'use client'
import {useEffect,useRef,useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Menu,X,MessageCircle,ArrowUpRight} from 'lucide-react'
import {Logo} from '@/components/shared/Logo'
import {ButtonLink} from '@/components/ui/ButtonLink'
import {buildWhatsAppUrl} from '@/lib/whatsapp'
interface HeaderProps {blogEnabled?:boolean;logoUrl?:string|null;siteName?:string;whatsappPhone?:string;whatsappMessage?:string}
export function Header({blogEnabled=true,logoUrl,siteName,whatsappPhone='[WHATSAPP]',whatsappMessage='Olá, Dra. Vanessa! Gostaria de falar com você.'}:HeaderProps){
 const [open,setOpen]=useState(false)
 const trigger=useRef<HTMLButtonElement>(null)
 const nav=useRef<HTMLElement>(null)
 const pathname=usePathname()
 const links=[{name:'Início',href:'/#inicio'},{name:'Sobre',href:'/#sobre'},{name:'Áreas de atuação',href:'/#areas'},{name:'Recuperação de contas',href:'/recuperacao-de-instagram'},{name:'Como funciona',href:'/#como-funciona'},{name:'Blog',href:'/blog'},{name:'Contato',href:'/#contato'}].filter(link=>blogEnabled || link.href!=='/blog')
 const whatsapp=buildWhatsAppUrl(whatsappPhone,whatsappMessage)
 useEffect(()=>{
  if(!open)return
  const previous=document.body.style.overflow
  document.body.style.overflow='hidden'
  nav.current?.querySelector<HTMLAnchorElement>('a')?.focus()
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){setOpen(false);trigger.current?.focus()}
   if(event.key==='Tab'){
    const items=[trigger.current,...Array.from(nav.current?.querySelectorAll<HTMLAnchorElement>('a') || [])].filter(Boolean) as HTMLElement[]
    const first=items[0],last=items.at(-1)
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus()}
   }
  }
  const onResize=()=>{if(window.innerWidth>=1280)setOpen(false)}
  window.addEventListener('keydown',onKey);window.addEventListener('resize',onResize)
  return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey);window.removeEventListener('resize',onResize)}
 },[open])
 return <header className="site-header">
  <div className="site-container header-inner">
   <Logo href="/" logoUrl={logoUrl} siteName={siteName}/>
   <nav className="desktop-nav" aria-label="Navegação principal">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href || (pathname==='/' && link.href==='/#inicio') ? 'page':undefined}>{link.name}</Link>)}</nav>
   <div className="header-action"><ButtonLink href={whatsapp} size="sm" icon={<MessageCircle size={17} aria-hidden="true"/>}>Falar no WhatsApp</ButtonLink></div>
   <button ref={trigger} type="button" className="menu-trigger" onClick={()=>setOpen(!open)} aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation">{open?<X size={24}/>:<Menu size={24}/>}</button>
  </div>
  {open && <nav ref={nav} id="mobile-navigation" className="mobile-navigation" aria-label="Navegação no celular">{links.map((link,index)=><Link href={link.href} key={link.href} onClick={()=>setOpen(false)}><span className="nav-number">{String(index+1).padStart(2,'0')}</span><span>{link.name}</span><ArrowUpRight size={18}/></Link>)}<ButtonLink href={whatsapp} onClick={()=>setOpen(false)} icon={<MessageCircle size={20}/>}>Falar no WhatsApp</ButtonLink></nav>}
 </header>
}
