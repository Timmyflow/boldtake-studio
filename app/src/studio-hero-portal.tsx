import { useRef, useState, type PointerEvent } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, MoveHorizontal, Pause, Play } from 'lucide-react';
import { BrandAction } from './studio-action';

type Props={enabled:boolean;onToggle:()=>void;onFilm:(index:number,target:HTMLElement)=>void};
export function StudioOpening({enabled,onToggle,onFilm}:Props){
 const root=useRef<HTMLElement>(null);
 const stage=useRef<HTMLDivElement>(null);
 const [cut,setCut]=useState(54);
 const played=useRef(false);
 useGSAP(()=>{
  if(!enabled||!root.current)return;
  gsap.registerPlugin(ScrollTrigger);
  const q=gsap.utils.selector(root);
  if(!played.current){
   played.current=true;
   const intro=gsap.timeline({defaults:{ease:'power3.out'}});
   intro.fromTo(q('.portal-title-line>span'),{yPercent:105},{yPercent:0,duration:.9,stagger:.09},.1);
   intro.fromTo(q('.portal-eyebrow,.portal-description,.portal-actions,.portal-console'),{opacity:0,y:12},{opacity:1,y:0,duration:.6,stagger:.065},.35);
   intro.fromTo(q('.portal-canvas'),{scale:1.045,opacity:.35},{scale:1,opacity:1,duration:1.2},0);
  }
  gsap.to(q('.portal-scroll-layer'),{scale:.94,y:28,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:.7}});
  gsap.to(q('.portal-copy'),{y:-25,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:.7}});
 },{scope:root,dependencies:[enabled],revertOnUpdate:true});
 const move=(e:PointerEvent<HTMLElement>)=>{
  if(!enabled||e.pointerType!=='mouse'||!stage.current)return;
  const r=e.currentTarget.getBoundingClientRect();
  gsap.to(stage.current,{x:(e.clientX-r.left-r.width/2)*.018,y:(e.clientY-r.top-r.height/2)*.012,duration:.55,ease:'power3.out',overwrite:'auto'});
 };
 const reset=()=>{if(stage.current)gsap.to(stage.current,{x:0,y:0,duration:.4,overwrite:'auto'});};
 const edgeTop=Math.min(100,cut+6),edgeBottom=Math.max(0,cut-6);
 return <section className="portal-hero" ref={root} aria-labelledby="hero-title" onPointerMove={move} onPointerLeave={reset}>
  <div className="portal-scroll-layer" aria-hidden="true"><div className="portal-canvas" ref={stage}>
   <img className="portal-still" src="/assets/opening-perfume.webp" alt="" width="1600" height="900" fetchPriority="high"/>
   <div className="portal-live" style={{clipPath:`polygon(${edgeTop}% 0,100% 0,100% 100%,${edgeBottom}% 100%)`}}>
    <img src="/assets/opening-perfume.webp" alt="" width="1600" height="900"/>
    {enabled&&<video data-preview data-src="/assets/opening-perfume.mp4" poster="/assets/opening-perfume.webp" muted playsInline loop preload="none"/>}
   </div>
   <svg className="portal-seam" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={`M ${edgeTop} 0 L ${edgeBottom} 100`} vectorEffect="non-scaling-stroke"/></svg>
  </div></div>
  <div className="portal-shade" aria-hidden="true"/>
  <div className="portal-copy wrap">
   <p className="portal-eyebrow">BOLDTAKE / Студія AI-відеореклами</p>
   <h1 id="hero-title"><span className="portal-title-line"><span>Зі звичного.</span></span><span className="portal-title-line"><span>У неможливе.</span></span></h1>
   <div className="portal-copy-bottom"><p className="portal-description">Рекламні відеоролики для брендів,<br/>продуктів і просторів.<br/><span>Ідея, що змінює ваш кадр.</span></p>
    <div className="portal-actions"><BrandAction enabled={enabled} href="#contact"><span>Обговорити проєкт</span><ArrowUpRight aria-hidden="true"/></BrandAction><BrandAction enabled={enabled} secondary onClick={e=>onFilm(1,e.currentTarget)}><Play aria-hidden="true"/><span>Дивитися ролик</span></BrandAction></div>
   </div>
  </div>
  <div className="portal-console wrap">
   <div className="portal-interaction"><label htmlFor="portal-reveal"><span>Кадр</span><span><MoveHorizontal aria-hidden="true"/>Рухайте межу<span className="portal-control-state">{enabled?'Рух':'Колір'}</span></span></label><input id="portal-reveal" type="range" min="12" max="88" value={cut} onChange={e=>setCut(Number(e.target.value))} aria-label="Межа між статичним кадром і відео" aria-valuetext={`${100-cut}% рухомого кадру`}/></div>
   <div className="portal-console-right"><button className="portal-pause" onClick={onToggle}>{enabled?<Pause aria-hidden="true"/>:<Play aria-hidden="true"/>}<span>{enabled?'Пауза':'Увімкнути рух'}</span></button><a className="portal-to-work" href="#work">Наші роботи<ArrowDown aria-hidden="true"/></a></div>
  </div>
 </section>;
}
