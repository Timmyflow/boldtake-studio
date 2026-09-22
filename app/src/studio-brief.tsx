import { useState, useRef, useEffect, useId } from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import gsap from "gsap";
import { motion as m, LayoutGroup } from "motion/react";
import { animateDisclosure } from "./studio-identity";

export function StudioBrief({ service, chosenOffer, chosenProject, clearOffer, clearProject, enabled }: { service:string; chosenOffer:string; chosenProject:string; clearOffer:()=>void; clearProject:()=>void; enabled:boolean }) {
  const [subject,setSubject]=useState("Продукт"),[brief,setBrief]=useState(""),[budget,setBudget]=useState(""),[timing,setTiming]=useState("");
  const selectionId=useId();
  const visual=useRef<HTMLSpanElement>(null);
  useEffect(()=>{if(!enabled && visual.current) gsap.set(visual.current,{x:0,y:0});return()=>{if(visual.current)gsap.killTweensOf(visual.current)}},[enabled]);
  const text=`Вітаю! Цікавить ${service.toLowerCase()}.\nРекламуємо: ${subject.toLowerCase()}.\n${chosenOffer ? chosenOffer+"\n":""}${chosenProject ? "Орієнтир: "+chosenProject+"\n":""}${brief.trim() || "Хочу обговорити ідею та вартість."}${budget ? "\nБюджет: "+budget : ""}${timing.trim() ? "\nТерміни: "+timing.trim():""}`;
  return <div className="brief-panel brief-composer">
    {chosenProject && <div className="selected-offer"><p>Орієнтир: {chosenProject}</p><button onClick={clearProject} aria-label="Прибрати обрану роботу"><X/></button></div>}
    {chosenOffer && <div className="selected-offer"><p>{chosenOffer}</p><button onClick={clearOffer} aria-label="Прибрати обраний пакет"><X/></button></div>}
    <fieldset className="brief-subject"><legend>Що рекламуємо?</legend><LayoutGroup id={selectionId}><div>{["Продукт","Послуга","Простір","Інше"].map(v=><label key={v}><input type="radio" name="subject" value={v} checked={subject===v} onChange={()=>setSubject(v)}/><span>{subject===v && <m.i aria-hidden="true" className="selection-surface" layoutId={enabled ? "brief-selection" : undefined} transition={{type:"spring",stiffness:400,damping:36}}/>}<b>{v}</b></span></label>)}</div></LayoutGroup></fieldset>
    <label htmlFor="brief">Кілька слів про проєкт</label>
    <textarea id="brief" rows={3} maxLength={1500} value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Що потрібно рекламувати? Можна додати посилання." aria-describedby="brief-hint"/>
    <p id="brief-hint" className="brief-hint">Можна без готового сценарію. Почнемо з вашого продукту.</p>
    <details className="brief-extra"><summary onClick={e=>animateDisclosure(e,enabled)}>Додати бюджет і терміни <Plus aria-hidden="true"/></summary><div className="brief-extra-fields"><label htmlFor="brief-budget">Бюджет, грн<select id="brief-budget" value={budget} onChange={e=>setBudget(e.target.value)}><option value="">Ще визначаюсь</option><option>5 000–10 000</option><option>10 000–15 000</option><option>15 000–25 000</option><option>Понад 25 000</option></select></label><label htmlFor="brief-timing">Коли потрібен ролик?<input id="brief-timing" maxLength={120} value={timing} onChange={e=>setTiming(e.target.value)} placeholder="Дата або орієнтовний термін"/></label></div></details>
    <a className="magnetic-cta" href={"https://t.me/lmaze22?text="+encodeURIComponent(text)} target="_blank" rel="noopener noreferrer" onPointerMove={e=>{if(!enabled || e.pointerType!=="mouse")return;const r=e.currentTarget.getBoundingClientRect();gsap.to(visual.current,{x:gsap.utils.clamp(-8,8,(e.clientX-r.left-r.width/2)*.06),y:gsap.utils.clamp(-6,6,(e.clientY-r.top-r.height/2)*.18),duration:.3,ease:"power3.out",overwrite:"auto"})}} onPointerLeave={()=>gsap.to(visual.current,{x:0,y:0,duration:enabled?.45:0,ease:"power3.out",overwrite:"auto"})}><span ref={visual} className="magnetic-surface"><span>Обговорити в Telegram</span><ArrowUpRight aria-hidden="true"/></span></a>
    <small>Відкриється Telegram із вашим текстом. Повідомлення надішлете ви.</small>
  </div>
}
