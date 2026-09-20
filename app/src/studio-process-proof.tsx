import { useState } from "react";
import { projects } from "./studio-content";
const stages = [
  { label: "Образ", src: "/assets/lemon-process-reference.webp", copy: "«Лимонний удар»: реальний референс героїні, одягу й корту для нового дубля.", alt: "Референс тенісистки на синьому корті" },
  { label: "Перехід", src: "/assets/lemon-process-key.webp", copy: "Кадр-орієнтир: положення лимона перед переходом у вибух соку.", alt: "Ключовий кадр лимона перед переходом" },
  { label: "Ролик", src: "", copy: "Два дублі, склейка на ударі та готовий фінал продукту. Реальні матеріали «Лимонного удару».", alt: "" }
];
export function StudioProcessProof({ enabled }: { enabled: boolean }) {
  const [active,setActive] = useState(0);
  const [previous,setPrevious] = useState(0);
  const choose = (i:number) => { if(i!==active){setPrevious(active);setActive(i);} };
  return <section id="approach" className="process-proof wrap chapter" aria-labelledby="approach-title">
    <div className="proof-intro"><span className="kicker">Від задуму до ролика</span><h2 id="approach-title">Спочатку бачите ідею.<br/><em>Потім — ролик.</em></h2><p>Узгоджуємо сценарій і ключові кадри до виробництва. Ви можете оцінити напрям, поки його ще легко змінити.</p><div className="proof-promise"><span>Ви приносите продукт.</span><span>Ми — ідею, сценарій, монтаж і звук.</span></div></div>
    <div className="proof-workbench">
      <div className="proof-controls" aria-label="Матеріали проєкту">{stages.map((s,i)=><button key={s.label} type="button" aria-pressed={active===i} onClick={()=>choose(i)}>{s.label}</button>)}</div>
      <div className={"proof-picture proof-stage-"+active+(enabled && active!==previous ? " proof-cutting" : "")} key={active}><img className="proof-underlay" src={stages[previous].src || "/assets/lemon-final-poster.webp"} alt="" aria-hidden="true"/><div className="proof-current">{active===2?<video controls playsInline preload="metadata" poster="/assets/lemon-final-poster.webp" src={projects[3].video} aria-label="Готовий монтаж Лимонний удар" />:<img src={stages[active].src} alt={stages[active].alt} width="1280" height="720" loading="lazy"/>}</div><span className="proof-cut-sweep" aria-hidden="true"/></div>
      <p className="proof-caption" aria-live="polite">{stages[active].copy}</p>
    </div>
    <div className="proof-delivery"><p><strong>До старту</strong>Задача, обсяг роботи й вартість.</p><p><strong>До виробництва</strong>Сценарій і візуальний напрям.</p><p><strong>На виході</strong>Готовий ролик зі звуком у погодженому форматі.</p></div>
  </section>;
}
