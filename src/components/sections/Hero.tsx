import Image from 'next/image'
import { MessageCircle, ShieldCheck, Lock, Target } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
interface HeroProps {
  content?: {eyebrow?:string;title?:string;subtitle?:string;ctaText?:string;ctaLink?:string;secondaryCta?:string;photoUrl?:string|null;verticalPhrase?:string;seals?:string}
  whatsappPhone?:string
  whatsappMessage?:string
}
const icons={ShieldCheck,Shield:ShieldCheck,Lock,Target}
export function Hero({content,whatsappPhone='[WHATSAPP]',whatsappMessage='Olá, Dra. Vanessa! Gostaria de falar sobre orientações jurídicas.'}:HeroProps) {
  const title=content?.title || 'Orientação jurídica para empresas, trabalhadores e questões digitais.'
  const titleParts=title.match(/^(.*?)(questões digitais\.?)$/iu)
  const subtitle=content?.subtitle || 'Atuação estratégica, atendimento humanizado e foco na segurança jurídica de cada caso.'
  const photo=content?.photoUrl || '/images/architecture.webp'
  let seals:{icon:string;text:string}[]=[{icon:'ShieldCheck',text:'Atendimento personalizado'},{icon:'Lock',text:'Sigilo e ética profissional'},{icon:'Target',text:'Atuação estratégica'}]
  if(content?.seals){try{seals=JSON.parse(content.seals)}catch{}}
  const href=content?.ctaLink && content.ctaLink!=='#contato' ? content.ctaLink : buildWhatsAppUrl(whatsappPhone,whatsappMessage)
  return <section id="inicio" className="hero-section">
    <div className="site-container hero-grid">
      <div className="hero-copy">
        <h1 className="heading-serif">{titleParts?<>{titleParts[1]}<em>{titleParts[2]}</em></>:title}</h1>
        <p className="hero-description">{subtitle}</p>
        <div className="hero-actions">
          <ButtonLink href={href} size="lg" icon={<MessageCircle size={20} aria-hidden="true"/>}>{content?.ctaText || 'Falar no WhatsApp'}</ButtonLink>
          <ButtonLink href="/#como-ajudar" variant="link" size="lg" withArrow>{(content?.secondaryCta || 'Conheça minha atuação').replace(/\s*→$/u,'')}</ButtonLink>
        </div>
        <div className="hero-seals">{seals.map((seal,index)=>{const Icon=icons[seal.icon as keyof typeof icons] || ShieldCheck;return <div key={index}><Icon size={22} aria-hidden="true"/><span>{seal.text}</span></div>})}</div>
      </div>
      <figure className="hero-figure">
        <div className="hero-image"><Image src={photo} alt={content?.photoUrl ? 'Vanessa Rodrigues, advogada' : ''} fill priority quality={85} sizes="(max-width: 767px) 90vw, (max-width: 1199px) 42vw, 600px" className="object-cover"/></div>
        <figcaption><div className="hero-caption-copy"><span className="heading-serif">Vanessa Rodrigues</span><span>Direito Trabalhista &amp; Digital</span></div></figcaption>
      </figure>
    </div>
  </section>
}
