import { useEffect,useRef,type ReactNode,type MouseEvent } from 'react';
import gsap from 'gsap';
export function BrandAction({children,href,onClick,enabled=true,secondary=false,label}:{children:ReactNode;href?:string;onClick?:(e:MouseEvent<HTMLButtonElement>)=>void;enabled?:boolean;secondary?:boolean;label?:string}){
 const surface=useRef<HTMLSpanElement>(null);
 useEffect(()=>{if(!enabled)gsap.set(surface.current,{x:0,y:0});return()=>{gsap.killTweensOf(surface.current)}},[enabled]);
 const props={className:'magnetic-cta brand-action'+(secondary?' brand-action-secondary':''),'aria-label':label,onPointerMove:(e:React.PointerEvent<HTMLElement>)=>{if(!enabled||e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();gsap.to(surface.current,{x:gsap.utils.clamp(-7,7,(e.clientX-r.left-r.width/2)*.09),y:gsap.utils.clamp(-5,5,(e.clientY-r.top-r.height/2)*.16),duration:.28,ease:'power3.out',overwrite:'auto'})},onPointerLeave:()=>{gsap.to(surface.current,{x:0,y:0,duration:enabled?.45:0,ease:'power3.out',overwrite:'auto'})}};
 const body=<span ref={surface} className="magnetic-surface">{children}</span>;
 return href?<a {...props} href={href}>{body}</a>:<button {...props} type="button" onClick={onClick}>{body}</button>;
}
