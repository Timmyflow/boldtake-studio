import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Play } from 'lucide-react';
export function StudioPortal({enabled}:{enabled:boolean}) {
 const root=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),manualPause=useRef(false);
 const [ended,setEnded]=useState(false),[playing,setPlaying]=useState(false);
 useEffect(()=>{
  const el=video.current;if(!el||!enabled)return;
  let visible=false;
  const sync=()=>{if(visible&&!document.hidden&&!el.ended&&!manualPause.current){if(!el.src)el.src='/assets/brand-portal.mp4';void el.play().then(()=>{setPlaying(true)}).catch(()=>setPlaying(false))}else{el.pause();setPlaying(false)}};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.45});
  observer.observe(root.current!);document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);el.pause()};
 },[enabled]);
 const replay=()=>{const el=video.current;if(!el)return;el.src='/assets/brand-portal.mp4';el.currentTime=0;manualPause.current=false;setEnded(false);void el.play().then(()=>setPlaying(true)).catch(()=>{})};
 return <section ref={root} className={'brand-portal wrap '+(ended||!enabled?'is-settled':'')} aria-labelledby="portal-title">
  <div className="portal-copy"><h2 id="portal-title">Ваш продукт.</h2><p>У русі. У світлі.<br/>У центрі уваги.</p></div>
  <div className="portal-stage">
   {enabled?<video ref={video} muted playsInline preload="none" poster="/assets/brand-portal.webp" aria-label="Анімація логотипа BOLDTAKE" onEnded={()=>{setEnded(true);setPlaying(false)}}/>:<img src="/assets/brand-portal-end.webp" alt="BOLDTAKE" loading="lazy" width="1280" height="720"/>}
  </div>
  {enabled&&<button className="portal-replay" onClick={playing?()=>{manualPause.current=true;video.current?.pause();setPlaying(false)}:replay}>{playing?'Пауза':ended?'Повторити':'Дивитися перетворення'}{ended?<RotateCcw aria-hidden="true"/>:<Play aria-hidden="true"/>}</button>}
 </section>
}
