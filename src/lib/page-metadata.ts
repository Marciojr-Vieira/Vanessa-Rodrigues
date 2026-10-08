import type { Metadata } from 'next'
import { prisma } from './prisma'
import { getBaseUrl } from './utils'
export async function pageMetadata(page:string,title:string,description:string,image?:string|null):Promise<Metadata>{
 const seo=await prisma.seoSettings.findUnique({where:{page}}).catch(()=>null)
 const url=seo?.canonical || getBaseUrl()+page
 const images=[seo?.ogImage || image || '/images/article-placeholder.svg']
 return {title:seo?.title || title,description:seo?.description || description,alternates:{canonical:url},openGraph:{title:seo?.title || title,description:seo?.description || description,url,images,locale:'pt_BR'},twitter:{card:'summary_large_image',title:seo?.title || title,description:seo?.description || description,images}}
}
