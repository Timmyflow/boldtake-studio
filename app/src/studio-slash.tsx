import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** One decorative mark follows the reading margin and docks into the real logo. */
export function StudioSlash({ enabled }: { enabled: boolean }) {
  const mark = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = mark.current;
    const root = el?.closest<HTMLElement>(".studio-shell");
    const dock = root?.querySelector<SVGSVGElement>(".footer-brand .brand-splice");
    if (!enabled || !el || !root || !dock) return;
    gsap.registerPlugin(ScrollTrigger);
    let alive = true;
    let maximum = 1;
    let points: { s: number; x: number; y: number; h: number }[] = [];
    const state = { progress: 0 };
    const clamp = gsap.utils.clamp(0, 1);
    const measure = () => {
      const w = innerWidth, h = innerHeight;
      maximum = Math.max(1, document.documentElement.scrollHeight - h);
      const mobile = w < 768;
      const wrap = root.querySelector<HTMLElement>(".hero")!;
      const r = wrap.getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(wrap).paddingLeft);
      const rail = mobile ? 12 : Math.max(22, r.left + gutter / 2);
      const size = mobile ? 32 : 64;
      const top = (selector: string) => {
        const node = root.querySelector(selector);
        return node ? node.getBoundingClientRect().top + scrollY : 0;
      };
      const cut = root.querySelector(".act-cut")!.getBoundingClientRect();
      const cutTop = cut.top + scrollY;
      points = [
        { s: 0, x: rail, y: h * .32, h: size * 1.3 },
        { s: top("#work") - h * .5, x: rail, y: h * .5, h: size },
        { s: cutTop - h * .76, x: rail, y: h * .76, h: size },
        { s: cutTop + cut.height * .5 - h * .5, x: w * .65, y: h * .5, h: mobile ? 65 : 150 },
        { s: top("#approach") - h * .28, x: rail, y: h * .28, h: size },
        { s: top("#services") - h * .46, x: rail, y: h * .46, h: size * 1.25 },
        { s: top("#pricing") - h * .46, x: rail, y: h * .46, h: size * .85 },
        { s: top("#questions") - h * .46, x: rail, y: h * .46, h: size },
        { s: top("#contact") - h * .35, x: rail, y: h * .35, h: size },
        { s: Math.max(top("#contact"), maximum - h * .56), x: rail, y: h * .66, h: size },
      ].map(p => ({ ...p, s: Math.max(0, Math.min(maximum - 1, p.s)) })).sort((a,b)=>a.s-b.s);
    };
    const draw = () => {
      if (!alive) return;
      const s = state.progress * maximum;
      const target = dock.getBoundingClientRect();
      const last = { s: maximum, x: target.left + target.width / 2, y: target.top + target.height / 2, h: target.height };
      const route = [...points, last];
      let a = route[0], b = route[1];
      for (let i = 1; i < route.length; i++) {
        b = route[i]; a = route[i-1];
        if (s <= b.s) break;
      }
      const t = clamp((s-a.s) / Math.max(1,b.s-a.s));
      const ease = t*t*(3-2*t);
      const mix = (x:number,y:number) => x+(y-x)*ease;
      const height = mix(a.h,b.h);
      const docking = b === last ? ease : 0;
      const width = height * .5 * (1-docking) + target.width * docking;
      gsap.set(el, { x: mix(a.x,b.x)-width/2, y: mix(a.y,b.y)-height/2, width, height });
    };
    measure();
    root.classList.add("slash-journey-active");
    const tween = gsap.to(state, { progress: 1, ease: "none", onUpdate: draw,
      scrollTrigger: { trigger: root, start: 0, end: () => maximum, scrub: .55,
        onRefreshInit: measure, onRefresh: draw, invalidateOnRefresh: true } });
    const refresh = () => { if (alive) { measure(); ScrollTrigger.refresh(); draw(); } };
    root.addEventListener("toggle", refresh, true);
    root.addEventListener("studio:layout", refresh);
    // Keep docking accurate while the logo's existing hover animation is running.
    const tick = () => { if (state.progress > .92) draw(); };
    gsap.ticker.add(tick);
    document.fonts.ready.then(refresh);
    draw();
    return () => {
      alive = false;
      root.classList.remove("slash-journey-active");
      root.removeEventListener("toggle", refresh, true);
      root.removeEventListener("studio:layout", refresh);
      gsap.ticker.remove(tick);
      tween.scrollTrigger?.kill(); tween.kill(); gsap.set(el,{clearProps:"all"});
    };
  }, [enabled]);
  return <svg ref={mark} className="journey-slash" viewBox="0 0 18 36" fill="none" aria-hidden="true"><path d="M10 0H18L8 36H0L10 0Z" fill="currentColor"/></svg>;
}
