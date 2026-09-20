import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import "lenis/dist/lenis.css";
export function useStudioScroll(enabled:boolean){
 useEffect(()=>{
  if(!enabled)return;
  const query=matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  let dispose=()=>{};
  const setup=()=>{dispose();if(!query.matches)return;
   const lenis=new Lenis({lerp:.14,smoothWheel:true,syncTouch:false,prevent:node=>!!node.closest('dialog,textarea,select,[data-lenis-prevent]')});
   const tick=(t:number)=>lenis.raf(t*1000);
   lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);
   const lock=()=>{const blocked=!!document.querySelector('dialog[open]');if(blocked&&!lenis.isStopped)lenis.stop();if(!blocked&&lenis.isStopped)lenis.start()};
   const observer=new MutationObserver(lock);observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open'],childList:true});lock();
   dispose=()=>{observer.disconnect();gsap.ticker.remove(tick);lenis.destroy()};
  };setup();query.addEventListener('change',setup);return()=>{query.removeEventListener('change',setup);dispose()};
 },[enabled]);
}
