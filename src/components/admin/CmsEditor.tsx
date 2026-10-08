'use client'
import { useEffect, useState, useCallback } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { cmsModules, slugify, type CmsField } from '@/lib/cms-config'
import { RichEditor } from './RichEditor'
type Row = Record<string,unknown> & {id:string}
type Media = {id:string;url:string;alt:string|null;originalName:string}
export function CmsEditor({module}:{module:string}) {
 const config=cmsModules[module]
 const [records,setRecords]=useState<Row[]>([])
 const [selected,setSelected]=useState<Row|null>(null)
 const [editing,setEditing]=useState(false)
 const [message,setMessage]=useState('')
 const [busy,setBusy]=useState(false)
 const [preview,setPreview]=useState(false)
 const [media,setMedia]=useState<Media[]>([])
 const {register,handleSubmit,control,reset,getValues,setValue}=useForm<Record<string,unknown>>()
 const load=useCallback(async()=>{
  const res=await fetch('/api/admin/cms/'+module);const data=await res.json()
  if(!res.ok) throw new Error(data.error)
  setRecords(data.records)
  if(config.singleton && data.records[0]) {setSelected(data.records[0]);reset(data.records[0]);setEditing(true)}
 },[module,config.singleton,reset])
 useEffect(()=>{let alive=true;const timer=setTimeout(()=>{Promise.all([load(),fetch('/api/admin/media').then(r=>r.json()).then(d=>{if(alive)setMedia(d.records || [])})]).catch(e=>{if(alive)setMessage(e.message)})},0);return()=>{alive=false;clearTimeout(timer)}},[load])
 function edit(row:Row|null) {
  setSelected(row);setPreview(false);setEditing(true);setMessage('')
  reset(row || Object.fromEntries(config.fields.map(f=>[f.key,f.kind==='boolean' ? f.key==='active' || f.key==='blogEnabled' : f.kind==='number' ? 1 : f.kind==='select' ? f.options?.[0] : f.kind==='json' ? '[]' : ''])))
 }
 async function save(values:Record<string,unknown>) {
  setBusy(true);setMessage('')
  try {
   const data=Object.fromEntries(config.fields.map(f=>[f.key,values[f.key] ?? (f.kind==='boolean' ? false : '')]))
   const res=await fetch('/api/admin/cms/'+module,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selected?.id,data})})
   const result=await res.json();if(!res.ok)throw new Error(result.error)
   await load();setSelected(result.record);reset(result.record);setMessage('Conteúdo salvo. O site já foi atualizado.');setPreview(false)
  }catch(e){setMessage(e instanceof Error ? e.message : 'Erro ao salvar.')}finally{setBusy(false)}
 }
 async function remove(id:string) {
  if(!window.confirm('Excluir este registro permanentemente?'))return
  setBusy(true)
  try{const res=await fetch('/api/admin/cms/'+module,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const data=await res.json();if(!res.ok)throw new Error(data.error);await load();setEditing(false);setMessage('Registro excluído.')}
  catch(e){setMessage(e instanceof Error?e.message:'Erro ao excluir.')}finally{setBusy(false)}
 }
 async function reorder(from:number,to:number) {
  if(busy || from===to || to<0 || to>=records.length)return
  const ordered=[...records];ordered.splice(to,0,ordered.splice(from,1)[0]);setBusy(true)
  try{
   const res=await fetch('/api/admin/cms/'+module+'/order',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({ids:ordered.map(r=>r.id)})})
   const result=await res.json();if(!res.ok)throw new Error(result.error);await load()
  }catch(e){setMessage(e instanceof Error?e.message:'Erro ao ordenar.')}finally{setBusy(false)}
 }
 function fieldInput(field:CmsField) {
  const id=module+'-'+field.key
  if(field.kind==='html')return <Controller name={field.key} control={control} rules={{required:field.required}} render={({field:f})=><RichEditor key={selected?.id || 'new'} id={id} value={String(f.value || '')} onChange={f.onChange}/>}/>
  if(field.kind==='json')return <Controller name={field.key} control={control} render={({field:f})=><JsonList value={String(f.value || '[]')} onChange={f.onChange} seals={field.key==='seals'}/>}/>
  if(field.kind==='boolean')return <input id={id} type="checkbox" {...register(field.key)} className="accent-[#E2C2A0] w-5 h-5"/>
  if(field.kind==='image')return <select id={id} {...register(field.key)}><option value="">Imagem padrão / nenhuma</option>{media.map(m=><option key={m.id} value={m.url}>{m.originalName} — {m.alt}</option>)}{Boolean(getValues(field.key)) && !media.some(m=>m.url===getValues(field.key)) && <option value={String(getValues(field.key))}>Imagem atual</option>}</select>
  if(field.kind==='select')return <select id={id} {...register(field.key)}>{field.options?.map(o=><option key={o} value={o}>{({DRAFT:'Rascunho',PUBLISHED:'Publicado',geral:'Geral',recuperacao:'Recuperação'} as Record<string,string>)[o] || o}</option>)}</select>
  if(field.kind==='textarea')return <textarea id={id} rows={4} {...register(field.key,{required:field.required})}/>
  return <input id={id} type={field.kind==='number'?'number':'text'} {...register(field.key,{required:field.required,valueAsNumber:field.kind==='number',onChange:e=>{if(field.key==='title' && !selected && config.fields.some(f=>f.key==='slug'))setValue('slug',slugify(e.target.value))}})}/>
 }
 const values=useWatch({control})
 return <div className="cms space-y-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Administração</p><h1 className="heading-serif text-3xl mt-2">{config.title}</h1></div>{!config.singleton && <button className="cms-primary" disabled={busy} onClick={()=>edit(null)}>Novo registro</button>}</div>
 {message && <p role="status" className="p-4 rounded-xl border border-accent/30 text-accent">{message}</p>}
 {module==='testimonials' && <p className="text-sm text-text-secondary">Depoimentos permanecem fora do site público. Revise as regras profissionais antes de qualquer divulgação.</p>}
 {!config.singleton && <div className="space-y-2">{records.length===0 && <p className="text-text-secondary">Nenhum registro cadastrado.</p>}{records.map((row,index)=><div key={row.id} draggable={config.ordered && !busy} onDragStart={e=>e.dataTransfer.setData('text/plain',String(index))} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void reorder(Number(e.dataTransfer.getData('text/plain')),index)}} className="cms-panel flex flex-wrap justify-between items-center gap-3"><div><strong>{String(row.title || row.question || row.label || row.page || row.name)}</strong><p className="text-xs text-text-secondary mt-1">{row.status=== 'DRAFT'?'Rascunho':row.status==='PUBLISHED'?'Publicado':row.active===false?'Inativo':''}</p></div><div className="flex gap-2">{config.ordered && <><button aria-label="Mover para cima" disabled={busy || index===0} onClick={()=>reorder(index,index-1)}>↑</button><button aria-label="Mover para baixo" disabled={busy || index===records.length-1} onClick={()=>reorder(index,index+1)}>↓</button></>}<button disabled={busy} onClick={()=>edit(row)}>Editar</button>{module!=='pages' && <button disabled={busy} onClick={()=>remove(row.id)}>Excluir</button>}</div></div>)}</div>}
 {editing && <form onSubmit={handleSubmit(save)} className="cms-panel space-y-6"><h2 className="heading-serif text-2xl">{selected?'Editar conteúdo':'Novo conteúdo'}</h2>{config.fields.map(field=><div key={field.key} className="space-y-2"><label id={module+'-'+field.key+'-label'} htmlFor={module+'-'+field.key} className="block text-sm text-text-secondary">{field.label}{field.required?' *':''}</label>{fieldInput(field)}</div>)}
 <div className="flex flex-wrap gap-3"><button type="button" onClick={()=>setPreview(!preview)}>Pré-visualizar</button><button className="cms-primary" disabled={busy} type="submit">{busy?'Salvando…':module==='blog' && values.status==='PUBLISHED'?'Publicar artigo':'Salvar alterações'}</button>{!config.singleton && <button type="button" onClick={()=>setEditing(false)}>Fechar</button>}</div>
 {preview && <section aria-label="Pré-visualização" className="cms-panel space-y-4 border-accent/40"><p className="eyebrow">Pré-visualização · alterações ainda não salvas</p>{config.fields.filter(f=>!['boolean','select','image','json'].includes(f.kind)).map(f=><div key={f.key}><p className="text-xs text-accent mb-2">{f.label}</p>{f.kind==='html'?<iframe title="Pré-visualização do conteúdo" sandbox="" srcDoc={'<html lang="pt-BR"><body style="background:#161413;color:#f4efea;font:16px Georgia;line-height:1.8">'+String(values[f.key] || '')+'</body></html>'} className="w-full min-h-80"/>:<p className={f.key==='title'?'heading-serif text-3xl':'whitespace-pre-wrap'}>{String(values[f.key] || '')}</p>}</div>)}</section>}
 </form>}</div>
}
function JsonList({value,onChange,seals}:{value:string;onChange:(value:string)=>void;seals:boolean}) {
 let items:Record<string,string>[]=[];try{items=JSON.parse(value)}catch{}
 const key=seals?'text':'title'
 return <div className="space-y-3">{items.map((item,i)=><div key={i} className="flex flex-wrap gap-2"><input aria-label="Ícone" value={item.icon} onChange={e=>onChange(JSON.stringify(items.map((r,n)=>n===i?{...r,icon:e.target.value}:r)))} className="max-w-40"/><input aria-label="Texto" value={item[key]} onChange={e=>onChange(JSON.stringify(items.map((r,n)=>n===i?{...r,[key]:e.target.value}:r)))} className="flex-1"/><button type="button" onClick={()=>onChange(JSON.stringify(items.filter((_,n)=>n!==i)))}>Remover</button></div>)}<button type="button" onClick={()=>onChange(JSON.stringify([...items,{icon:'Shield',[key]:''}]))}>Adicionar item</button></div>
}
