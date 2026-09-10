import type { ReactNode } from 'react'
import { RouteLink } from './RouteLink'
type P={href:string;children:ReactNode;variant?:'light'|'dark'|'ghost';className?:string}
export function ArrowLink({href,children,variant='light',className=''}:P){const v=variant==='dark'?'button--dark':variant==='ghost'?'button--ghost':'';const classes=`button ${v} ${className}`.trim();const content=<><span>{children}</span><span aria-hidden="true">→</span></>;return href.startsWith('/')?<RouteLink className={classes} to={href}>{content}</RouteLink>:<a className={classes} href={href}>{content}</a>}
