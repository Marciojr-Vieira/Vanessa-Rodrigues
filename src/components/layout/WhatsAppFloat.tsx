'use client'
import {MessageCircle} from 'lucide-react'
import {buildWhatsAppUrl} from '@/lib/whatsapp'
interface WhatsAppFloatProps {phone?:string;message?:string}
export function WhatsAppFloat({phone='[WHATSAPP]',message='Olá, Dra. Vanessa! Gostaria de tirar uma dúvida sobre atendimento jurídico.'}:WhatsAppFloatProps){
 const href=buildWhatsAppUrl(phone,message)
 const external=href.startsWith('/api/whatsapp?')
 return <a href={href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} className="whatsapp-float" aria-label="Falar no WhatsApp"><MessageCircle size={26} aria-hidden="true"/></a>
}
