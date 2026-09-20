import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Play, Pause, ArrowDown } from "lucide-react";
import { BrandAction } from "./studio-action";
import { projects } from "./studio-content";
import "./studio-opening.css";

export function StudioOpening({enabled,onToggle,onFilm}:{enabled:boolean;onToggle:()=>void;onFilm:(index:number,el:HTMLElement)=>void}) {
 const root=useRef<HTMLElement>(null);
 useGSAP(()=>{
  if(!enabled || !root.current)return;
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add({desktop:"(min-width: 768px)",mobile:"(max-width: 767px)",allowed:"(prefers-reduced-motion: no-preference)"},ctx=>{
   if(!ctx.conditions?.allowed)return;
   const mobile=!!ctx.conditions.mobile;
   const q=(s:string)=>root.current!.querySelector(s);
   const g=()=>mobile?24:Math.max(0,(innerWidth-1600)/2)+Math.min(88,Math.max(32,innerWidth*.05));
   const w=()=>innerWidth-2*g();
   const top=()=>mobile?Math.max(154,innerHeight*.18):Math.max(168,innerHeight*.19);
   const fh=()=>mobile?innerHeight*.27:Math.min(innerHeight*.49,w()*.58/1.6);
   const opening=gsap.timeline({scrollTrigger:{trigger:root.current,start:"top top",end:"bottom bottom",scrub:.5,invalidateOnRefresh:true}});
   opening.fromTo(q(".opening-film"),{left:16,top:16,width:()=>innerWidth-32,height:()=>innerHeight-32,clipPath:"polygon(0 0,96% 0,100% 100%,0 100%)"},
    {left:0,top:0,width:()=>innerWidth,height:()=>innerHeight,clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)",duration:.18,ease:"none"},0);
   opening.to(q(".opening-copy"),{y:-35,autoAlpha:0,duration:.25,ease:"power2.in"},.06);
   opening.to(q(".opening-shade"),{opacity:0,duration:.35},.15);
   opening.to(q(".opening-film"),{left:g,top,width:()=>mobile?w():w()*.58,height:fh,clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)",duration:.6,ease:"power2.inOut"},.18);
   opening.fromTo(q(".opening-work-title"),{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.22},.53);
   opening.fromTo(q(".opening-case"),{autoAlpha:0,left:g,top:()=>top()+fh()+16},{autoAlpha:1,left:g,top:()=>top()+fh()+16,duration:.2},.65);
   opening.fromTo(q(".opening-film-action"),{autoAlpha:0},{autoAlpha:1,duration:.2},.65);
   opening.fromTo(q(".opening-next"),{autoAlpha:0,x:18},{autoAlpha:1,x:0,duration:.25,ease:"power2.out"},.56);
   opening.fromTo(q(".opening-next-picture"),{clipPath:"polygon(0 0,0 0,0 100%,0 100%)"},{clipPath:"polygon(0 0,112% 0,100% 100%,0 100%)",duration:.24,ease:"power3.out"},.56);
   opening.fromTo(root.current!.querySelectorAll(".opening-next h3,.opening-next>p"),{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.16,stagger:.04},.79);
   opening.fromTo(root.current!.querySelectorAll(".opening-next-picture>img,.opening-next-picture>video"),{scale:1.12},{scale:1,duration:.3,ease:"power3.out"},.56);
   opening.to({}, {duration:.1});
   const intro=gsap.timeline({defaults:{ease:"power3.out"}});
   intro.fromTo(q(".opening-eyebrow"),{y:12,opacity:0},{y:0,opacity:1,duration:.55},.1);
   intro.fromTo(q(".opening-copy h1"),{y:30,opacity:0,clipPath:"inset(0 0 100% 0)"},{y:0,opacity:1,clipPath:"inset(0 0 -12% 0)",duration:.85},.16);
   intro.fromTo(q(".opening-description"),{y:18,opacity:0},{y:0,opacity:1,duration:.7},.32);
   intro.fromTo(root.current!.querySelectorAll(".opening-actions>.brand-action,.opening-scroll"),{y:18,opacity:0},{y:0,opacity:1,duration:.65,stagger:.08},.44);
  });
  return()=>media.revert();
 },{scope:root,dependencies:[enabled],revertOnUpdate:true});
 return <section ref={root} className="film-opening" aria-labelledby="hero-title">
  <div id="work" className="opening-work-anchor" aria-hidden="true"/>
  <div className="opening-stage">
   <div className="opening-film">
    <img src="/assets/opening-perfume.webp" alt="Кадр рекламного ролика Після дощу" width="1600" height="900" fetchPriority="high"/>
    {enabled && <video data-preview data-src="/assets/opening-perfume.mp4" muted loop playsInline preload="none" poster="/assets/opening-perfume.webp" aria-hidden="true"/>}
    <div className="opening-shade"/>
    <button className="opening-film-action" aria-label="Дивитися Після дощу" onClick={e=>onFilm(1,e.currentTarget)}><Play aria-hidden="true"/>Дивитися ролик</button>
   </div>
   <div className="opening-copy">
    <p className="opening-eyebrow">Студія AI-відеореклами</p>
    <h1 id="hero-title">Рекламні<br/>відеоролики<span>.</span></h1>
    <p className="opening-description">Для брендів, продуктів і просторів.<br/>Створюємо за допомогою ШІ — від сценарію до монтажу зі звуком.</p>
    <div className="opening-actions"><BrandAction enabled={enabled} href="#contact"><span>Обговорити проєкт</span><ArrowUpRight aria-hidden="true"/></BrandAction><BrandAction enabled={enabled} secondary onClick={e=>onFilm(1,e.currentTarget)}><span>Дивитися ролик</span><Play aria-hidden="true"/></BrandAction></div>
    <a href="#work" className="opening-scroll">До робіт<ArrowDown aria-hidden="true"/></a>
   </div>
   <h2 className="opening-work-title">Наші роботи<span>.</span></h2>
   <div className="opening-case"><h3><button onClick={e=>onFilm(1,e.currentTarget)}>Після дощу<ArrowUpRight aria-hidden="true"/></button></h3><p>Парфумерія · Концепт</p></div>
   <article className="opening-next">
    <button className="opening-next-picture" aria-label="Дивитися Лимонний удар" onClick={e=>onFilm(3,e.currentTarget)}>
     <img src={projects[3].poster} alt={projects[3].alt} width="1280" height="720" loading="lazy"/>
     {enabled && <video data-preview data-src={projects[3].preview} muted loop playsInline preload="none" poster={projects[3].poster} aria-hidden="true"/>}
     <span><Play aria-hidden="true"/>Дивитися ролик</span>
    </button><h3><button onClick={e=>onFilm(3,e.currentTarget)}>Лимонний удар<ArrowUpRight aria-hidden="true"/></button></h3><p>Реклама напоїв · Концепт</p>
   </article>
   <button className="opening-motion" onClick={onToggle} aria-label={enabled?"Призупинити анімацію":"Увімкнути анімацію"}>{enabled?<Pause aria-hidden="true"/>:<Play aria-hidden="true"/>}<span>{enabled?"Пауза":"Відтворити"}</span></button>
  </div>
 </section>;
}
