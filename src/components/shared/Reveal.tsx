'use client'
import {motion,useReducedMotion} from 'framer-motion'
import type {ReactNode} from 'react'
export function Reveal({children}:{children:ReactNode}){
 const reduce=useReducedMotion()
 return <motion.div initial={{opacity:0,y:16}} animate={reduce?{opacity:1,y:0}:undefined} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:reduce?0:.5}}>{children}</motion.div>
}
