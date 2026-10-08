'use client'
import {useState} from 'react'
import type {ChangeEvent,FormEvent} from 'react'
import {CheckCircle2,ShieldCheck,MessageCircle} from 'lucide-react'
import {Input} from '@/components/ui/Input'
import {Textarea} from '@/components/ui/Textarea'
import {Button} from '@/components/ui/Button'
import {ButtonLink} from '@/components/ui/ButtonLink'
import {buildWhatsAppUrl} from '@/lib/whatsapp'
interface ContactFormProps {whatsappPhone?:string;initialType?:string}
export function ContactForm({whatsappPhone='[WHATSAPP]',initialType='CONTA'}:ContactFormProps){
 const [formData,setFormData]=useState({name:'',whatsapp:'',type:initialType,message:'',consent:false,website_url:''})
 const [loading,setLoading]=useState(false)
 const [success,setSuccess]=useState(false)
 const [error,setError]=useState('')
 const whatsapp=buildWhatsAppUrl(whatsappPhone,'Olá, Dra. Vanessa! Sou '+formData.name+' e acabei de enviar meus dados no formulário.')
 const configured=whatsapp.startsWith('/api/whatsapp?')
 function handleChange(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>){
  const {name,value,type}=event.target
  setFormData(previous=>({...previous,[name]:type==='checkbox'?(event.target as HTMLInputElement).checked:value}))
 }
 async function handleSubmit(event:FormEvent){
  event.preventDefault()
  if(loading)return
  setError('');setLoading(true)
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(formData)})
   const result=await response.json()
   if(!response.ok)throw new Error(result.error || 'Não foi possível enviar. Tente novamente.')
   setSuccess(true)
  }catch(cause){setError(cause instanceof Error?cause.message:'Falha na comunicação. Tente novamente.')}
  finally{setLoading(false)}
 }
 return <section id="contato" className="section-space"><div className="site-container contact-grid">
  <div className="contact-copy"><div className="section-heading"><p className="eyebrow">Triagem e atendimento</p><h2 className="heading-serif section-title">Inicie a triagem do seu caso</h2><p>Preencha os campos abaixo para que possamos realizar a triagem inicial e encaminhar seu atendimento de forma segura.</p><div className="contact-note"><ShieldCheck size={22} aria-hidden="true"/><span>Sigilo profissional e segurança das informações</span></div></div></div>
  {success?<div className="contact-success" role="status">
   <CheckCircle2 size={36} className="text-accent" aria-hidden="true"/><h3 className="heading-serif">Informações enviadas com sucesso!</h3>
   <p>{configured?'Seus dados foram enviados para a triagem. Você pode continuar a conversa pelo WhatsApp.':'Seus dados foram enviados para a triagem. Não é necessário reenviar o formulário.'}</p>
   {configured && <ButtonLink href={whatsapp} icon={<MessageCircle size={20}/>}>Abrir conversa no WhatsApp</ButtonLink>}
   <Button type="button" variant="ghost" className="mt-4" onClick={()=>{setSuccess(false);setFormData({name:'',whatsapp:'',type:initialType,message:'',consent:false,website_url:''})}}>Enviar outro contato</Button>
  </div>:<form onSubmit={handleSubmit} className="contact-form" aria-busy={loading}>
   {error && <div className="contact-error" role="alert">{error}</div>}
   <input type="text" name="website_url" value={formData.website_url} onChange={handleChange} hidden tabIndex={-1} autoComplete="off" aria-hidden="true"/>
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    <Input label="Seu Nome Completo" name="name" autoComplete="name" maxLength={200} placeholder="Como podemos chamar você?" value={formData.name} onChange={handleChange} required/>
    <Input label="Número do WhatsApp (com DDD)" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="(11) 98765-4321" value={formData.whatsapp} onChange={handleChange} required/>
   </div>
   <div className="space-y-2"><label htmlFor="contact-type">Tipo de Atendimento <span className="text-accent">*</span></label>
    <select id="contact-type" name="type" value={formData.type} onChange={handleChange} required className="w-full rounded-xl px-4 py-3 border">
     <option value="CONTA">Recuperação de conta de rede social</option><option value="EMPRESA">Assessoria trabalhista para empresa</option><option value="TRABALHADOR">Direitos do trabalhador</option>
    </select>
   </div>
   <Textarea label="Resumo do seu caso (opcional)" name="message" placeholder="Conte brevemente o que aconteceu." rows={5} maxLength={5000} value={formData.message} onChange={handleChange}/>
   <div className="contact-consent"><input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleChange} required/><label htmlFor="consent">Concordo com o tratamento dos meus dados para contato inicial e triagem jurídica, conforme a <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</label></div>
   <Button type="submit" size="lg" isLoading={loading} withArrow>{loading?'Enviando informações…':'Enviar e Iniciar Atendimento'}</Button>
  </form>}
 </div></section>
}
