import sanitize from 'sanitize-html'
export function sanitizeHtml(html: string): string {
 return sanitize(html, {
  allowedTags: ['p','br','h2','h3','h4','strong','em','s','ul','ol','li','blockquote','a','img'],
  allowedAttributes: { a:['href','title','target','rel'], img:['src','alt','width','height'] },
  allowedSchemes: ['https','http','mailto'], allowProtocolRelative:false,
  transformTags:{a:sanitize.simpleTransform('a',{rel:'noopener noreferrer'})}
 })
}
