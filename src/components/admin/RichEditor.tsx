'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
export function RichEditor({value,onChange,id}:{value:string;onChange:(value:string)=>void;id:string}) {
 const editor = useEditor({extensions:[StarterKit],content:value,immediatelyRender:false,editorProps:{attributes:{id,role:'textbox','aria-labelledby':id+'-label','aria-multiline':'true'}},onUpdate:({editor})=>onChange(editor.getHTML())})
 if(!editor) return <p>Carregando editor…</p>
 return <div className="cms-rich"><div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
  <button type="button" aria-pressed={editor.isActive('bold')} onClick={()=>editor.chain().focus().toggleBold().run()}>Negrito</button>
  <button type="button" aria-pressed={editor.isActive('italic')} onClick={()=>editor.chain().focus().toggleItalic().run()}>Itálico</button>
  <button type="button" onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()}>Título</button>
  <button type="button" onClick={()=>editor.chain().focus().toggleBulletList().run()}>Lista</button>
  <button type="button" onClick={()=>{const href=window.prompt('URL do link (https://)');if(href && /^https:\/\//.test(href))editor.chain().focus().setLink({href}).run()}}>Link</button>
  <button type="button" onClick={()=>editor.chain().focus().unsetLink().run()}>Remover link</button>
  <button type="button" onClick={()=>editor.chain().focus().undo().run()}>Desfazer</button>
 </div><EditorContent editor={editor} className="prose-dark p-4 min-h-60"/></div>
}
