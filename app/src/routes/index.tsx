import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import "../studio-polish.css";
import { StudioProcessProof } from "@/studio-process-proof";
import { projects } from "@/studio-content";
import { Words, useStudioMotion } from "@/studio-motion";
import { BrandMark, StudioNavigation, StudioQuestions } from "@/studio-identity";
import { StudioPricing } from "@/studio-pricing";
import { studioSchema } from "@/studio-offers";
import "../studio.css";
import "../studio-finale.css";
import { StudioOpening, StudioGallery, StudioBenefits, StudioSteps } from "@/studio-select";
import "../studio-select.css";
import { StudioBrief } from "@/studio-brief";
import { useStudioScroll } from "@/studio-scroll";
export const Route = createFileRoute("/")({ component: Studio });
function Studio() {
  const [selected, setSelected] = useState<number | null>(null),
    [chosenOffer, setChosenOffer] = useState(""),
    [chosenProject, setChosenProject] = useState(""),
    [motion, setMotion] = useState(false);
  const shell = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    close = useRef<HTMLButtonElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  useStudioMotion(shell, motion);
  useStudioScroll(motion);
  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video[data-preview]"));
    if (!motion || selected !== null) {
      videos.forEach((v) => v.pause());
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !document.hidden) {
            if (!v.getAttribute("src")) v.src = v.dataset.src || "";
            void v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.15 },
    );
    videos.forEach((v) => observer.observe(v));
    const visibility = () => {
      if (document.hidden) videos.forEach((v) => v.pause());
      else
        videos.forEach((v) => {
          const r = v.getBoundingClientRect();
          if (r.bottom > 0 && r.top < innerHeight) void v.play().catch(() => {});
        });
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      videos.forEach((v) => v.pause());
    };
  }, [motion, selected]);
  useEffect(() => {
    if (selected === null) return;
    const el = dialog.current,
      old = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    close.current?.focus();
    const inner = el?.querySelector<HTMLElement>(".film-inner");
    const target = el?.querySelector<HTMLVideoElement>("video");
    const source = trigger.current?.closest(".select-card")?.querySelector(".select-card-media") || trigger.current?.closest(".select-hero")?.querySelector(".select-hero-image") || trigger.current?.closest(".select-benefit-layout")?.querySelector(".select-benefit-image");
    if (inner && target && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const a = source?.getBoundingClientRect(), b = inner.getBoundingClientRect();
      if (a && a.bottom > 0 && a.top < innerHeight) {
        inner.animate([
          { transform: `translate(${a.left-b.left}px, ${a.top-b.top}px) scale(${a.width/b.width}, ${a.height/b.height})`, transformOrigin: "top left", opacity: 0.45 },
          { transform: "none", transformOrigin: "top left", opacity: 1 }
        ], { duration: 460, easing: "cubic-bezier(.22,1,.36,1)" });
      } else {
        inner.animate([{opacity:0,transform:"translateY(20px) scale(.97)"},{opacity:1,transform:"none"}],{duration:360,easing:"cubic-bezier(.22,1,.36,1)"});
      }
    }
    return () => {
      el?.close();
      document.body.style.overflow = old;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [selected]);
  const openFilm = (i: number, el: HTMLElement) => {
    trigger.current = el;
    setSelected(i);
  };
  const closeFilm = () => {
    const inner=dialog.current?.querySelector<HTMLElement>(".film-inner");
    if (!inner || !motion) {setSelected(null);return;}
    const source=trigger.current?.closest('.select-card')?.querySelector('.select-card-media') || trigger.current?.closest('.select-hero')?.querySelector('.select-hero-image');
    const a=source?.getBoundingClientRect(),b=inner.getBoundingClientRect();
    const destination=a&&a.bottom>0&&a.top<innerHeight?{opacity:0,transform:`translate(${a.left-b.left}px, ${a.top-b.top}px) scale(${a.width/b.width}, ${a.height/b.height})`,transformOrigin:'top left'}:{opacity:0,transform:'translateY(12px) scale(.985)',transformOrigin:'top left'};
    void inner.animate([{opacity:1,transform:'none',transformOrigin:'top left'},destination],{duration:300,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}).finished.then(()=>setSelected(null)).catch(()=>setSelected(null));
  };
  const toContact = () => {
    if (selected !== null) setChosenProject(projects[selected].title);
    trigger.current = null;
    setSelected(null);
    requestAnimationFrame(() =>
      document.getElementById("contact")?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      }),
    );
  };
  return (
    <div className="studio-shell bold-cut select-edition" data-motion={motion ? "on" : "off"} ref={shell}>
      <div className="cut-atmosphere" aria-hidden="true">
        <div className="cut-plane" />
        <div className="cut-trace" />
      </div>
      <a className="skip-link" href="#main">
        До вмісту
      </a>
      <StudioNavigation enabled={motion} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema).replace(/</g, "\\u003c") }}
      />
      <main id="main">
        <StudioOpening enabled={motion} onToggle={()=>setMotion(!motion)} onFilm={openFilm}/>
        <StudioGallery enabled={motion} blocked={selected !== null} onFilm={openFilm}/>
        <div className="act-cut" aria-hidden="true">
          <div className="act-paper" />

        </div>
        <div className="light-act">
          <div className="paper-atmosphere" aria-hidden="true"><div className="paper-plane paper-plane-a"/><div className="paper-plane paper-plane-b"/><i className="paper-trace paper-trace-a"/><i className="paper-trace paper-trace-b"/><span className="paper-slash"/></div>
          <StudioBenefits onFilm={openFilm}/>
          <StudioProcessProof enabled={motion} />
          <StudioSteps/>
          <StudioPricing onChoose={setChosenOffer} chosenOffer={chosenOffer} />

        </div>
        <StudioQuestions enabled={motion} />
        <section id="contact" className="contact wrap chapter" aria-labelledby="contact-title">
          <div className="section-heading">
            <span className="section-cut" aria-hidden="true" />
            <div>
              <h2 id="contact-title">
                <Words text="Ваш продукт — наступний." />
              </h2>
              <p className="muted">Покажіть продукт або розкажіть про задачу. Обговоримо ідею, строки та вартість.</p>
            </div>
          </div>
          <span className="contact-seam" aria-hidden="true" />
          <div className="contact-grid">
            <div className="contact-direct">
              <span className="kicker">Напишіть напряму</span>
              <a
                className="telegram-link"
                href="https://t.me/lmaze22"
                target="_blank"
                rel="noopener noreferrer"
              >
                @lmaze22
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="phone-link" href="tel:+380679468439">
                +380 67 946 84 39
              </a>
            </div>
            <StudioBrief service="Рекламний ролик" chosenOffer={chosenOffer} chosenProject={chosenProject} clearOffer={() => setChosenOffer("")} clearProject={() => setChosenProject("")} enabled={motion}/>

          </div>
        </section>
      </main>
      <div className="footer-curtain"><footer className="footer wrap finale-footer">
        <div className="footer-top">
          <p>Рекламні відеоролики.<br/>Від першої ідеї до фінального кадру.</p>
          <nav aria-label="Навігація внизу сторінки">
            <a href="#work">Роботи <ArrowUpRight aria-hidden="true"/></a>
            <a href="#pricing">Вартість <ArrowUpRight aria-hidden="true"/></a>
            <a href="#main">Нагору <ArrowUpRight aria-hidden="true"/></a>
          </nav>
        </div>
        <a href="#main" className="footer-brand" aria-label="BOLDTAKE, нагору"><BrandMark /></a>
        <div className="footer-bottom"><span>© 2026 BOLDTAKE</span><span>Рекламна студія / Україна</span></div>
      </footer></div>
      {selected !== null && (
        <dialog
          ref={dialog}
          className={"film-dialog select-dialog"+(selected >= 4 ? " portrait-dialog" : "")}
          onCancel={e => {e.preventDefault();closeFilm();}}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFilm();
          }}
          aria-labelledby="film-title"
        >
          <div className="film-inner">
            <header>
              <div>
                <h2 id="film-title">{projects[selected].title}</h2>
                <p>{projects[selected].label}</p>
              </div>
              <button ref={close} onClick={closeFilm} aria-label="Закрити відео">
                <X aria-hidden="true" />
              </button>
            </header>
            <video
              aria-label={`Рекламний ролик ${projects[selected].title}`}
              key={projects[selected].id}
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={projects[selected].poster}
              src={projects[selected].video}
            />
            <div className="film-bottom">
              <div className="film-case"><p>{projects[selected].description}</p><dl><div><dt>Задача</dt><dd>{projects[selected].task}</dd></div><div><dt>Ідея</dt><dd>{projects[selected].idea}</dd></div><div><dt>Робота студії</dt><dd>{projects[selected].scope}</dd></div></dl></div>
              <a
                href="#contact"
                className="text-link"
                onClick={(e) => {
                  e.preventDefault();
                  toContact();
                }}
              >
                Хочу ролик для свого бренду
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
