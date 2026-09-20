import { type RefObject, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion as m, useSpring, useReducedMotion } from "motion/react";
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          {i > 0 ? " " : ""}
          <span className="word-mask">
            <span className="word-inner">{word}</span>
          </span>
        </span>
      ))}
    </>
  );
}
export function MagneticLink({
  children,
  href,
  label,
  className,
  enabled = true,
}: {
  children: ReactNode;
  href: string;
  label: string;
  className?: string;
  enabled?: boolean;
}) {
  const reduced = useReducedMotion(),
    x = useSpring(0, { stiffness: 220, damping: 24 }),
    y = useSpring(0, { stiffness: 220, damping: 24 });
  return (
    <m.a
      href={href}
      aria-label={label}
      className={className}
      style={{ x, y }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      onPointerMove={(e) => {
        if (!enabled || reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(Math.max(-8,Math.min(8,(e.clientX - r.left - r.width / 2) * 0.08)));
        y.set((e.clientY - r.top - r.height / 2) * 0.08);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.a>
  );
}
export function useStudioMotion(scope: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !enabled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      let alive = true;
      media.add(
        { allowed: "(prefers-reduced-motion: no-preference)" },
        (context) => {
          if (!context.conditions?.allowed) return;
          const desktop = window.matchMedia("(min-width:769px)").matches;
          const q = (s: string) => Array.from(root.querySelectorAll(s));
          gsap.fromTo(
            q(".cut-plane"),
            { xPercent: -18, yPercent: -8, rotate: -18 },
            {
              xPercent: 18,
              yPercent: 8,
              rotate: -14,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1.2 },
            },
          );
          gsap.fromTo(
            q(".cut-trace"),
            { x: 0, rotate: -18 },
            {
              x: () => innerWidth * 0.22,
              rotate: -14,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            },
          );
          const paper = root.querySelector(".light-act");
          q(".paper-plane,.paper-trace,.paper-slash").forEach((el,i)=>{
            gsap.fromTo(el,{x:desktop ? -55 : -18,y:-35},{x:desktop ? (i%2 ? -65 : 65) : 18,y:50,ease:"none",scrollTrigger:{trigger:paper,start:"top bottom",end:"bottom top",scrub:1.1}});
          });
          q(".proof-intro,.proof-workbench,.proof-delivery").forEach((el)=>{
            gsap.fromTo(el,{y:24,opacity:.3},{y:0,opacity:1,duration:.75,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 94%",once:true}});
          });
          const signature=root.querySelector(".finale-footer .footer-brand");
          // Adapted from the Motion Footer reveal pattern on 21st; normal flow keeps keyboard targets reachable.
          if(signature) gsap.fromTo(signature,{y:desktop ? 55 : 20},{y:0,ease:"none",scrollTrigger:{trigger:root.querySelector(".footer-curtain"),start:"top bottom",end:"bottom bottom",scrub:.6}});

          q(".finale-footer .brand-word").forEach((el,i)=>{
            gsap.fromTo(el,{x:i===0?-28:28},{x:0,ease:"none",scrollTrigger:{trigger:root.querySelector(".footer-curtain"),start:"top 90%",end:"bottom bottom",scrub:.6}});
          });
          const entrance = gsap.timeline();
          entrance.fromTo(
            q(".identity-header"),
            { y: -12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
          );
          q(".contact-direct,.brief-panel,.footer-top,.footer-bottom").forEach((row) =>
            gsap.fromTo(
              row,
              { y: 16, opacity: 0.15 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: row, start: "top 96%", once: true },
              },
            ),
          );
          q(".pricing-mobile,.portal-copy,.portal-replay").forEach(el=>{gsap.fromTo(el,{y:24,opacity:0},{y:0,opacity:1,duration:.75,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 90%",once:true}})});
          q(".section-heading").forEach((section) => {
            const t = gsap.timeline({
              scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play none none reverse" },
            });
            t.fromTo(
              section.querySelectorAll(".word-inner"),
              { yPercent: 105 },
              { yPercent: 0, duration: 0.75, stagger: 0.04, ease: "power3.out" },
              0,
            );
            t.fromTo(
              section.querySelectorAll(".section-cut"),
              { scaleY: 0.15, opacity: 0.2 },
              { scaleY: 1, opacity: 1, duration: 0.65, ease: "power3.out" },
              0,
            );
            t.fromTo(
              section.querySelectorAll("p"),
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              0.12,
            );
          });
          q(".project").forEach((card) => {
            const film=card.querySelector(".project-film");
            const media=card.querySelectorAll(".project-film>img,.project-film>video");
            const architecture=card.id==="crystal-hills";
            const scene=gsap.timeline({scrollTrigger:{trigger:card,start:"top 96%",end:"top 24%",scrub:.65}});
            if(architecture){
              scene.fromTo(film,{clipPath:"inset(32% 0% 32% 0%)",scale:.97},{clipPath:"inset(0% 0% 0% 0%)",scale:1,ease:"power2.out",duration:1},0);
              scene.fromTo(media,{scale:1.08},{scale:1,ease:"none",duration:1},0);
            }else{
              scene.fromTo(film,{scale:.94},{scale:1,ease:"power2.out",duration:1},0);
              scene.fromTo(media,{scale:1.3,transformOrigin:"52% 45%"},{scale:1,ease:"power2.out",duration:1},0);
            }
            gsap.fromTo(card.querySelector(".project-info"),{y:14,opacity:.45},{y:0,opacity:1,duration:.6,ease:"power3.out",scrollTrigger:{trigger:film,start:"bottom 98%",once:true}});
            gsap.fromTo(card.querySelector(".project-seam"),{scaleX:.01},{scaleX:1,ease:"none",scrollTrigger:{trigger:card,start:"top 75%",end:"top 25%",scrub:.6}});
          });
          q(
            ".service,.process-step,.question-row",
          ).forEach((row) =>
            gsap.fromTo(
              row,
              { y: 16, opacity: 0.3 },
              {
                y: 0,
                opacity: 1,
                duration: 0.65,
                ease: "power3.out",
                scrollTrigger: { trigger: row, start: "top 94%", once: true },
              },
            ),
          );
          const cut = root.querySelector(".act-cut");
          gsap.fromTo(
            q(".act-paper"),
            { clipPath: "polygon(0% 100%, 100% 95%, 100% 100%, 0% 100%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              ease: "none",
              scrollTrigger: { trigger: cut, start: "top bottom", end: "top 40%", scrub: 1 },
            },
          );
          gsap.fromTo(
            q(".contact-seam"),
            { scaleX: 0.01 },
            {
              scaleX: 1,
              duration: 1,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: root.querySelector("#contact"),
                start: "top 75%",
                once: true,
              },
            },
          );
        },
      );
      const refresh = () => {
        requestAnimationFrame(() => {
          if (alive) ScrollTrigger.refresh();
        });
      };
      root.addEventListener("toggle", refresh, true);
      root.addEventListener("studio:layout", refresh);
      document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
      return () => {
        alive = false;
        root.removeEventListener("toggle", refresh, true);
        root.removeEventListener("studio:layout", refresh);
        media.revert();
      };
    },
    { scope, dependencies: [enabled], revertOnUpdate: true },
  );
}
