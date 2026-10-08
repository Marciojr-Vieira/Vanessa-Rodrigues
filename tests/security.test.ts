import {describe,it,expect} from 'vitest'
import {sanitizeHtml} from '../src/lib/sanitize'
import {contactSchema,assertSameOrigin,csvCell} from '../src/lib/security'
import {buildWhatsAppUrl} from '../src/lib/whatsapp'
describe('Proteções de entrada',()=>{
 it('remove scripts, handlers e URLs perigosas',()=>{const result=sanitizeHtml('<p onclick=alert(1)>Texto</p><img src=x onerror=alert(1)><a href="javascript:alert(1)">link</a><script>alert(1)</script>');expect(result).not.toMatch(/onerror|onclick|javascript:|<script/);expect(result).toContain('Texto')})
 it('preserva formatação segura',()=>expect(sanitizeHtml('<h2>Título</h2><p><strong>Texto</strong></p>')).toContain('<strong>Texto</strong>'))
 it('exige consentimento verdadeiro e tipo válido',()=>{const input={name:'Maria',whatsapp:'11999999999',type:'CONTA',consent:true};expect(contactSchema.safeParse(input).success).toBe(true);expect(contactSchema.safeParse({...input,consent:'true'}).success).toBe(false);expect(contactSchema.safeParse({...input,type:'OUTRO'}).success).toBe(false)})
 it('bloqueia origem externa e ausência de origem',()=>{expect(()=>assertSameOrigin(new Request('http://localhost/api',{headers:{origin:'https://evil.test'}}))).toThrow('CSRF');expect(()=>assertSameOrigin(new Request('http://localhost/api'))).toThrow('CSRF')})
 it('neutraliza fórmulas no CSV',()=>{expect(csvCell('=HYPERLINK("url")')).toContain("'=HYPERLINK");expect(csvCell('Maria;Silva')).toBe('"Maria;Silva"')})
 it('direciona para formulário enquanto WhatsApp não foi informado',()=>expect(buildWhatsAppUrl('[WHATSAPP]','Olá')).toBe('/#contato'))
 it('preserva o tipo de atendimento na triagem alternativa',()=>{
  for(const type of ['EMPRESA','TRABALHADOR','CONTA'] as const)expect(buildWhatsAppUrl('[WHATSAPP]','Olá',type)).toBe('/?atendimento='+type+'#contato')
 })
})
