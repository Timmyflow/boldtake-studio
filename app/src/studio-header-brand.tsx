import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Transparent first-screen signature. The header keeps its normal layout and hit targets. */
export function HeaderBrand({enabled}:{enabled:boolean}) {
 const root=useRef<HTMLSpanElement>(null),played=useRef(false);
 useEffect(()=>{
  const el=root.current;
  if(!el||!enabled||played.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let disposed=false,ctx:gsap.Context|undefined,timeline:gsap.core.Timeline|undefined;
  const settle=()=>{timeline?.progress(1);el.classList.remove('is-brand-intro')};
  const start=async()=>{
   await document.fonts.ready;
   const poster=document.querySelector<HTMLImageElement>('.opening-film>img');
   if(poster)await poster.decode().catch(()=>{});
   if(disposed||played.current)return;
   played.current=true;
   if(window.scrollY>60||document.hidden)return;
   const base=el.getBoundingClientRect();
   const header=el.closest('header');
   const neighbour=Array.from(header?.querySelectorAll<HTMLElement>('nav,.nav-contact,.cut-menu-trigger')||[]).find(n=>n.getBoundingClientRect().width>0);
   const available=(neighbour?.getBoundingClientRect().left??innerWidth-24)-base.left-24;
   const scale=Math.max(1,Math.min(innerWidth<768?1.45:2.6,available/base.width));
   ctx=gsap.context(()=>{
    el.classList.add('is-brand-intro');
    const bold=el.querySelector('.brand-word-first'),slash=el.querySelector('.brand-splice');
    const letters=el.querySelectorAll('.intro-letter');
    timeline=gsap.timeline({defaults:{ease:'power3.out'},onComplete:()=>el.classList.remove('is-brand-intro')});
    timeline.set(el,{scale,transformOrigin:'left top',perspective:600});
    timeline.fromTo(bold,{opacity:0,y:3},{opacity:1,y:0,duration:.38},0);
    timeline.fromTo(slash,{opacity:0,x:-26,scaleY:.55,rotationY:65},{opacity:1,x:0,scaleY:1,rotationY:0,duration:.65},.22);
    timeline.fromTo(slash,{filter:'drop-shadow(0 0 0px rgba(210,255,70,0))'},{filter:'drop-shadow(0 0 9px rgba(210,255,70,.6))',duration:.3,yoyo:true,repeat:1},.48);
    timeline.fromTo(letters,{opacity:0,x:-8,y:5,z:28,rotationY:-68,rotationZ:-4,filter:'brightness(2)',textShadow:'-1px 1px 0 rgba(120,140,95,.7)'},{opacity:1,x:0,y:0,z:0,rotationY:0,rotationZ:0,filter:'brightness(1)',textShadow:'0px 0px 0 rgba(120,140,95,0)',duration:.72,stagger:.09},.68);
    timeline.to(letters,{keyframes:[{filter:'brightness(1.8)',duration:.12},{filter:'brightness(1)',duration:.32}],stagger:.075},1.36);
    timeline.to(el,{scale:1,duration:.9,ease:'power3.inOut'},2.02);
   },el);
   window.addEventListener('scroll',settle,{once:true,passive:true});
   window.addEventListener('resize',settle,{once:true});
  };
  if(document.readyState==='complete')void start();else window.addEventListener('load',start,{once:true});
  return()=>{disposed=true;window.removeEventListener('load',start);window.removeEventListener('scroll',settle);window.removeEventListener('resize',settle);ctx?.revert();el.classList.remove('is-brand-intro')};
 },[enabled]);
 return <span ref={root} className="brand-lockup header-brand-intro" aria-hidden="true">
  <span className="brand-word brand-word-first">BOLD</span>
  <svg className="brand-splice" viewBox="0 0 18 36" fill="none"><path d="M10 0H18L8 36H0L10 0Z" fill="currentColor"/></svg>
  <span className="brand-word brand-word-last">{'TAKE'.split('').map((letter,i)=><span className="intro-letter" key={i}>{letter}</span>)}</span>
 </span>;
}
