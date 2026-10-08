export function buildWhatsAppUrl(phone:string,message:string,type?:'EMPRESA'|'TRABALHADOR'|'CONTA'):string {
 const cleanPhone=phone.replace(/\D/g,'')
 if(!/^\d{10,15}$/.test(cleanPhone))return type ? '/?atendimento='+type+'#contato' : '/#contato'
 return '/api/whatsapp?'+new URLSearchParams({phone:cleanPhone,message,...(type?{type}:{})}).toString()
}
export function buildWhatsAppUrlByType(phone:string,type:'EMPRESA'|'TRABALHADOR'|'CONTA',messages:{empresa:string;trabalhador:string;conta:string}){
 return buildWhatsAppUrl(phone,{EMPRESA:messages.empresa,TRABALHADOR:messages.trabalhador,CONTA:messages.conta}[type],type)
}
