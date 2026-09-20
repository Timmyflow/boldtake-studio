export function SocialLink({network,className='',label=false}:{network:'instagram'|'telegram';className?:string;label?:boolean}) {
 const instagram=network==='instagram';
 const title=instagram?'Instagram BOLDTAKE':'Написати в Telegram';
 return <a className={`studio-social ${className}`} href={instagram?'https://www.instagram.com/boldtake.studio/':'https://t.me/lmaze22'} target="_blank" rel="noopener noreferrer" aria-label={title} title={title}>
  {instagram?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>:<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.4 3.4 18.2 20c-.2 1-1 1.2-1.8.7l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.3L5.8 13.5l-4.8-1.5c-1-.3-1-1 .2-1.5L20 3.2c.9-.3 1.6.2 1.4.2Z"/></svg>}
  {label&&<span>{instagram?'Instagram':'Telegram'}</span>}
 </a>;
}
