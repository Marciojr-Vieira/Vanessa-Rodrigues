'use client'
import {useState,useId} from 'react'
import {Plus,Minus} from 'lucide-react'
export interface AccordionItem {id:string;question:string;answer:string}
interface AccordionProps {items:AccordionItem[];defaultOpenIndex?:number;className?:string}
export function Accordion({items,defaultOpenIndex=-1,className=''}:AccordionProps){
 const [openIndex,setOpenIndex]=useState(defaultOpenIndex)
 const prefix=useId()
 return <div className={className}>{items.map((item,index)=>{
  const open=openIndex===index,id=prefix+'-'+index
  return <div key={item.id} className="accordion-item">
   <h3><button type="button" id={id+'-trigger'} className="accordion-trigger" onClick={()=>setOpenIndex(open?-1:index)} aria-expanded={open} aria-controls={id+'-answer'}><span>{item.question}</span>{open?<Minus size={20} aria-hidden="true"/>:<Plus size={20} aria-hidden="true"/>}</button></h3>
   <div id={id+'-answer'} hidden={!open} role="region" aria-labelledby={id+'-trigger'} className="accordion-answer">{item.answer}</div>
  </div>
 })}</div>
}
