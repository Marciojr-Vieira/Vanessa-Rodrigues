import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  withArrow?: boolean
}

export function ButtonLink({href, children, variant='primary', size='md', icon, withArrow, className='', target, ...props}:ButtonLinkProps) {
  const external = /^https?:\/\//.test(href) || href.startsWith('/api/whatsapp?')
  const styles = `site-button button-${variant} button-${size} ${className}`
  const content = <>{icon}<span>{children}</span>{withArrow && <ArrowRight size={18} aria-hidden="true"/>}</>
  if (external || props.download) return <a {...props} href={href} className={styles} target={external ? target || '_blank' : target} rel="noopener noreferrer">{content}</a>
  return <Link {...props} href={href} className={styles}>{content}</Link>
}
