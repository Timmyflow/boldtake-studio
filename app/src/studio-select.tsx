import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as m } from "motion/react";
import { ArrowUpRight, Play, Pause, ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./studio-content";
import { BrandAction } from "./studio-action";
import { Words } from "./studio-motion";

type OpenFilm = (index: number, target: HTMLElement) => void;
const sequence = [1, 4, 5, 2, 3, 0];
const filters = ["Усі", "Продукти", "Простори", "Історії"];
const matches = (index: number, filter: string) => filter === "Усі" || (filter === "Простори" ? index === 2 : filter === "Історії" ? [1, 4, 5].includes(index) : index !== 2);

export function StudioOpening({enabled, onToggle, onFilm}: {enabled:boolean; onToggle:()=>void; onFilm:OpenFilm}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!enabled || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = gsap.utils.selector(root);
    gsap.fromTo(q('.select-hero-copy > *'), {y:22, opacity:0}, {y:0, opacity:1, duration:.8, stagger:.09, ease:'power3.out'});
    gsap.fromTo(q('.select-hero-image'), {clipPath:'polygon(15% 0,100% 0,100% 100%,0 100%)'}, {clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)', duration:1.1, ease:'power3.inOut'});
    gsap.to(q('.select-hero-image'), {scale:.94, y:24, ease:'none', scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:.6}});
  }, {scope:root, dependencies:[enabled], revertOnUpdate:true});
  return <section ref={root} className="select-hero wrap" aria-labelledby="hero-title">
    <div className="select-hero-copy">
      <p className="select-eyebrow">Студія AI-відеореклами / Україна</p>
      <h1 id="hero-title">Ваш продукт.<br/>Інша історія.</h1>
      <p className="select-hero-description">Рекламні відеоролики, у яких продукт стає головним героєм. Від першої ідеї до монтажу зі звуком.</p>
      <div className="select-actions"><BrandAction enabled={enabled} href="#contact"><span>Обговорити проєкт</span><ArrowUpRight/></BrandAction><a className="select-work-link" href="#work">Дивитися роботи<ArrowDown/></a></div>
      <p className="select-hero-foot">Продукти. Простори. Історії, які рухаються.</p>
    </div>
    <div className="select-hero-visual">
      <button className="select-hero-image" onClick={e=>onFilm(1,e.currentTarget)} aria-label="Дивитися ролик Після дощу">
        <img src="/assets/opening-perfume.webp" width="1600" height="900" alt="Героїня парфумерного ролика на нічній вулиці" fetchPriority="high"/>
        {enabled && <video data-preview data-src="/assets/opening-perfume.mp4" muted loop playsInline preload="none" poster="/assets/opening-perfume.webp" aria-hidden="true"/>}
        <span className="select-hero-play"><Play/>Дивитися ролик</span><span className="select-film-slash" aria-hidden="true"/>
      </button>
      <div className="select-hero-caption"><span>Після дощу <span>Парфумерія / Концепт</span></span><button onClick={onToggle} aria-label={enabled?'Призупинити анімацію':'Увімкнути анімацію'}>{enabled?<Pause/>:<Play/>}<span>{enabled?'Пауза':'Рух'}</span></button></div>
    </div>
  </section>;
}

function Preview({index, active}: {index:number; active:boolean}) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el=video.current;
    if (!el) return;
    if (!active) {el.pause();setReady(false);return;}
    if (!el.getAttribute('src')) el.src=projects[index].preview;
    void el.play().catch(()=>setReady(false));
    const visibility=()=>{if(document.hidden)el.pause();else void el.play().catch(()=>{});};
    document.addEventListener('visibilitychange',visibility);
    return()=>{el.pause();document.removeEventListener('visibilitychange',visibility);};
  },[active,index]);
  return <video ref={video} className={active&&ready?'is-playing':''} onPlaying={()=>setReady(true)} muted loop playsInline preload="none" aria-hidden="true"/>;
}

export function StudioGallery({enabled, blocked, onFilm}: {enabled:boolean; blocked:boolean; onFilm:OpenFilm}) {
  const [filter,setFilter]=useState('Усі');
  const [active,setActive]=useState<number|null>(null);
  const root=useRef<HTMLElement>(null);
  const visible=sequence.filter(i=>matches(i,filter));
  useEffect(()=>{
    const timer=setTimeout(()=>root.current?.dispatchEvent(new Event('studio:layout',{bubbles:true})),450);
    return()=>clearTimeout(timer);
  },[filter]);
  useGSAP(()=>{
    if(!enabled || !root.current)return;
    gsap.registerPlugin(ScrollTrigger);
    root.current.querySelectorAll('.select-card-media').forEach(el=>{
      gsap.fromTo(el,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'},{clipPath:'polygon(0 0,115% 0,100% 100%,0 100%)',duration:.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 96%',once:true}});
    });
    root.current.querySelectorAll('.select-card-caption,.select-card-meta').forEach(el=>{
      gsap.fromTo(el,{y:10,opacity:0},{y:0,opacity:1,duration:.45,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 98%',once:true}});
    });
  },{scope:root,dependencies:[enabled,filter],revertOnUpdate:true});
  return <section id="work" className="select-work wrap" ref={root} aria-labelledby="work-title">
    <div className="select-work-heading"><div><p className="select-eyebrow">Портфоліо</p><h2 id="work-title">Різні продукти.<br/>Різні характери.</h2></div><p>Від кінематографічного настрою<br/>до несподіваного гумору.</p></div>
    <div className="select-work-tools"><div className="select-filters" role="group" aria-label="Фільтр робіт">{filters.map(f=><button key={f} aria-pressed={filter===f} onClick={()=>{setFilter(f);setActive(null);}}>{f}{filter===f&&<m.span layoutId="selected-filter" transition={{duration:enabled?.3:0}} aria-hidden="true"/>}</button>)}</div><span className="select-work-count" aria-live="polite">{visible.length} {visible.length===1?'робота':visible.length<5?'роботи':'робіт'}</span></div>
    <m.div layout={enabled} className={'select-grid'+(filter==='Усі'?' is-all':'')}>
      <AnimatePresence initial={false} mode="popLayout">
      {visible.map(i=>{const p=projects[i];const portrait=i>=4;return <m.article layout={enabled} initial={enabled?{opacity:0,y:16}:false} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.96}} transition={{duration:enabled?.35:0}} className={'select-card'+(portrait?' is-portrait':'')} key={p.id} id={p.id}>
        <button className="select-card-media" aria-label={`Дивитися ${p.title}`} onPointerEnter={e=>{if(e.pointerType==='mouse')setActive(i);}} onPointerLeave={()=>setActive(null)} onFocus={()=>setActive(i)} onBlur={()=>setActive(null)} onClick={e=>onFilm(i,e.currentTarget)}>
          <img src={p.poster} alt={p.alt} width={portrait?432:1280} height={portrait?768:720} loading="lazy"/>
          <Preview index={i} active={enabled&&!blocked&&active===i}/>
          <span className="select-card-open"><Play/><span>Дивитися</span></span><span className="select-card-cut" aria-hidden="true"/>
          <span className="select-format">{portrait?'9:16':'16:9'}</span>
        </button>
        <div className="select-card-caption"><h3><button onClick={e=>onFilm(i,e.currentTarget)}>{p.title}</button></h3><ArrowUpRight aria-hidden="true"/></div>
        <p className="select-card-meta">{p.category}<span>Концепт</span></p>
      </m.article>;})}
      </AnimatePresence>
    </m.div>
    <p className="select-disclosure">Роботи в цій добірці — концепти для портфоліо. Lay’s і Non Stop не є замовниками цих роликів.</p>
  </section>;
}

const benefits=[
  {name:'Показати продукт інакше',copy:'Створити ситуацію, яку складно зняти: зупинити дощ, змінити масштаб або додати несподіваного героя.',result:'Продукт отримує власну історію.',project:4},
  {name:'Дати відчути простір',copy:'Оживити ваші рендери: додати рух камери, світло й атмосферу ще до завершення будівництва.',result:'Архітектуру можна не лише роздивитися, а й відчути.',project:2},
  {name:'Спробувати різні акценти',copy:'Підготувати кілька початків або коротку серію для однієї кампанії. Формати й кількість погоджуємо до старту.',result:'У вас є матеріали для порівняння в рекламі.',project:5},
];
export function StudioBenefits({onFilm}:{onFilm:OpenFilm}) {
 const [active,setActive]=useState(0);
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{root.current?.dispatchEvent(new Event('studio:layout',{bubbles:true}));},[active]);
 return <section ref={root} id="services" className="select-benefits wrap" aria-labelledby="benefits-title">
  <div className="section-heading"><div><p className="select-eyebrow">Для вашого бізнесу</p><h2 id="benefits-title"><Words text="Більше, ніж показати товар."/></h2></div></div>
  <div className="select-benefit-layout"><div className="select-benefit-list">{benefits.map((b,i)=><article className={active===i?'is-active':''} key={b.name}><h3><button aria-expanded={active===i} aria-controls={'benefit-'+i} onClick={()=>setActive(i)}><span>{b.name}</span><ArrowUpRight/></button></h3><div id={'benefit-'+i} hidden={active!==i}><p>{b.copy}</p><strong>{b.result}</strong></div></article>)}</div>
   <button className="select-benefit-image" onClick={e=>onFilm(benefits[active].project,e.currentTarget)} aria-label={'Дивитися приклад: '+benefits[active].name}><img key={active} src={projects[benefits[active].project].poster} alt={projects[benefits[active].project].alt} loading="lazy"/><span><Play/>Дивитися приклад</span></button>
  </div>
 </section>;
}

export function StudioSteps() {
 return <section className="select-process wrap" aria-labelledby="process-title"><div className="section-heading"><div><p className="select-eyebrow">Як працюємо</p><h2 id="process-title"><Words text="Ви знаєте, що буде далі."/></h2></div></div><div className="select-steps">{[
 ['Знайомимось із задачею','Що рекламуємо, для кого й де. Ви надсилаєте матеріали продукту та приклади настрою.'],
 ['Погоджуємо ідею','Сценарій, ключові кадри, формат і вартість. Виробництво починається після узгодження напряму.'],
 ['Створюємо ролик','Генерації, монтаж і звук. Ви переглядаєте готову версію та збираєте коментарі в один список.'],
 ['Передаємо готове','Одна хвиля правок входить у вартість. Віддаємо відео в погодженому форматі для публікації.'],
 ].map(([title,copy])=><article className="process-step" key={title}><span className="step-slash" aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>;
}
