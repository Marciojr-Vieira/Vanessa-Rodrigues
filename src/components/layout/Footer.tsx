import Link from 'next/link'
import {Lock,ArrowUpRight} from 'lucide-react'
import {Logo} from '@/components/shared/Logo'
import {buildWhatsAppUrl} from '@/lib/whatsapp'
interface FooterProps {settings?:{siteName?:string;logoUrl?:string|null;linktree?:string;name?:string;oab?:string;whatsapp?:string;email?:string;city?:string;address?:string;instagram?:string;blogEnabled?:boolean}}
function configured(value?:string){return Boolean(value && !value.startsWith('['))}
export function Footer({settings}:FooterProps){
 const name=(settings?.siteName || settings?.name || 'Vanessa Rodrigues').replace(/\s*\|.*$/,'')
 const whatsapp=buildWhatsAppUrl(settings?.whatsapp || '[WHATSAPP]','Olá, Dra. Vanessa! Gostaria de falar com você.')
 return <footer className="site-footer"><div className="site-container">
  <div className="footer-grid">
   <div className="footer-identity"><Logo href="/" logoUrl={settings?.logoUrl} siteName={settings?.siteName}/><p>Direito Trabalhista e Digital.<br/>Atuação ética, estratégica e humanizada.</p>{configured(settings?.oab) && <p>OAB {settings?.oab}</p>}{configured(settings?.address) && <p>{settings?.address}</p>}{configured(settings?.city) && <p>{settings?.city}</p>}</div>
   <div><h2>Navegação</h2><ul><li><Link href="/#inicio">Início</Link></li><li><Link href="/#sobre">Sobre</Link></li><li><Link href="/#areas">Áreas de atuação</Link></li><li><Link href="/#como-funciona">Como funciona</Link></li>{settings?.blogEnabled!==false && <li><Link href="/blog">Blog</Link></li>}</ul></div>
   <div><h2>Atendimento</h2><ul><li><Link href="/#contato">Iniciar triagem</Link></li><li><Link href="/recuperacao-de-instagram">Recuperação de contas</Link></li>{whatsapp.startsWith('/api/whatsapp?') && <li><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={12} className="inline"/></a></li>}{configured(settings?.email) && <li><a href={'mailto:'+settings?.email}>{settings?.email}</a></li>}{configured(settings?.instagram) && <li><a href={'https://instagram.com/'+settings?.instagram?.replace('@','')} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={12} className="inline"/></a></li>}{/^https:\/\//.test(settings?.linktree || '') && <li><a href={settings?.linktree} target="_blank" rel="noopener noreferrer">Outros canais oficiais</a></li>}</ul></div>
   <div><h2>Informações</h2><ul><li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li><li><Link href="/termos-de-uso">Termos de Uso</Link></li></ul></div>
  </div>
  <p className="footer-legal">As informações deste site têm caráter informativo e não constituem aconselhamento jurídico. Não há garantia de resultados. Cada situação deve ser avaliada individualmente.</p>
  <div className="footer-bottom"><span>© {new Date().getFullYear()} {name}. Todos os direitos reservados.</span><Link href="/admin/login"><Lock size={12} aria-hidden="true"/>Área restrita</Link></div>
 </div></footer>
}
