import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Play, Pause, X, Plus } from "lucide-react";
import "../studio-polish.css";
import { StudioProcessProof } from "@/studio-process-proof";
import { projects } from "@/studio-content";
import { Words, useStudioMotion, MagneticLink } from "@/studio-motion";
import { BrandMark, StudioNavigation, StudioQuestions, animateDisclosure } from "@/studio-identity";
import { StudioPricing } from "@/studio-pricing";
import { studioSchema } from "@/studio-offers";
import "../studio.css";
import "../studio-finale.css";
import { StudioOpening } from "@/studio-opening";
import { StudioBrief } from "@/studio-brief";
import { useStudioScroll } from "@/studio-scroll";
export const Route = createFileRoute("/")({ component: Studio });
const services = [
  {
    name: "Рекламні ролики",
    copy: "Представити продукт і дати кампанії виразну ідею.",
    detail:
      "Ви отримуєте рекламний ролик зі сценарієм, монтажем і звуком. Узгоджуємо ідею та формат до виробництва — вам не потрібно збирати окрему команду.",
  },
  {
    name: "Контент для соцмереж",
    copy: "Показати продукт з різних боків у межах однієї кампанії.",
    detail:
      "Ви отримуєте серію коротких роликів для Instagram, TikTok або Meta Ads. Різні початки й акценти дають матеріал для тестування. Кількість версій і формати погоджуємо окремо.",
  },
  {
    name: "Архітектурні відеоролики",
    copy: "Дати відчути простір через рух, світло й атмосферу.",
    detail:
      "Ви отримуєте ролик для презентації архітектури чи інтер’єру. Працюємо з вашими рендерами й матеріалами, узгоджуємо ракурси та додаємо рух і життя в кадр.",
  },
];
function Studio() {
  const [selected, setSelected] = useState<number | null>(null),
    [activeService, setActiveService] = useState(0),
    [service, setService] = useState("Рекламний ролик"),
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
    const source = trigger.current?.closest(".project")?.querySelector(".project-film") || trigger.current?.closest(".opening-next")?.querySelector(".opening-next-picture") || trigger.current?.closest(".film-opening")?.querySelector(".opening-film");
    if (inner && target && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const a = source?.getBoundingClientRect(), b = target.getBoundingClientRect();
      if (a && a.bottom > 0 && a.top < innerHeight) {
        inner.animate([
          { transform: `translate(${a.left-b.left}px, ${a.top-b.top}px) scale(${a.width/b.width})`, opacity: 0.45 },
          { transform: "none", opacity: 1 }
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
    void inner.animate([{opacity:1,transform:"none"},{opacity:0,transform:"translateY(12px) scale(.985)"}],{duration:180,easing:"ease-out",fill:"forwards"}).finished.then(()=>setSelected(null)).catch(()=>setSelected(null));
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
    <div className="studio-shell bold-cut" data-motion={motion ? "on" : "off"} ref={shell}>
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
        <section className="work work-continuation wrap chapter" aria-label="Інші рекламні роботи">
          <div className="project-grid">
            {[2, 0].map((i) => {
              const p = projects[i];
              return (
                <article className="project" id={p.id} key={p.id}>
                  <button
                    className="project-film"
                    onClick={(e) => openFilm(i, e.currentTarget)}
                    aria-label={`Дивитися ${p.title}`}
                  >
                    <img src={p.poster} alt={p.alt} width="1280" height="720" loading="lazy" />
                    {motion && (
                      <video
                        data-preview
                        data-src={p.preview}
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={p.poster}
                        aria-hidden="true"
                      />
                    )}
                    <span className="play-disc">
                      <Play aria-hidden="true" />
                    </span>
                    <span className="play-label">Дивитися ролик</span>

                    <span className="project-seam" aria-hidden="true" />
                  </button>
                  <div className="project-info">
                    <h3>
                      <button onClick={(e) => openFilm(i, e.currentTarget)}>{p.title}</button>
                    </h3>
                    <div className="project-caption">
                      <span className="project-category">{p.category}</span>
                      <span className="project-label">Концепт</span>
                    </div>
                  </div>
                  <p className="project-purpose">{p.task}</p>
                </article>
              );
            })}
          </div>
        </section>
        <div className="act-cut" aria-hidden="true">
          <div className="act-paper" />

        </div>
        <div className="light-act">
          <div className="paper-atmosphere" aria-hidden="true"><div className="paper-plane paper-plane-a"/><div className="paper-plane paper-plane-b"/><i className="paper-trace paper-trace-a"/><i className="paper-trace paper-trace-b"/><span className="paper-slash"/></div>
          <StudioProcessProof enabled={motion} />
          <section id="services" className="services wrap chapter" aria-labelledby="services-title">
            <div className="section-heading">
              <span className="section-cut" aria-hidden="true" />
              <div>
                <h2 id="services-title">
                  <Words text="Під вашу задачу." />
                </h2>
                <p className="muted">
                  Оберіть напрям — подивіться приклад і що отримаєте.
                </p>
              </div>
            </div>
            <div className="service-stage">
              <div className="service-list">
                {services.map((s, i) => (
                  <details
                    className={`service ${activeService === i ? "service-active" : ""}`}
                    onPointerEnter={(e) => { if (e.pointerType === "mouse") setActiveService(i); }}
                    key={s.name}
                    onFocus={() => setActiveService(i)}
                    onToggle={(e) => {
                      if (e.currentTarget.open) setActiveService(i);
                    }}
                  >
                    <summary onClick={(e) => animateDisclosure(e, motion)}>
                      <h3>{s.name}</h3>
                      <p>{s.copy}</p>
                      <Plus aria-hidden="true" />
                    </summary>
                    <div className="service-detail">
                      <span className="service-result-label">Що отримаєте</span><p>{s.detail}</p>
                      <button
                        className="service-inline-film"
                        aria-label={`Дивитися приклад: ${s.name}`}
                        onClick={(e) => openFilm([0, 3, 2][i], e.currentTarget)}
                      >
                        <img
                          src={projects[[0, 3, 2][i]].poster}
                          alt=""
                          width="960"
                          height="540"
                          loading="lazy"
                        />
                        <span>
                          <Play aria-hidden="true" />
                          Дивитися приклад
                        </span>
                      </button>
                      <a
                        className="text-link"
                        href="#contact"
                        onClick={() =>
                          setService(
                            i === 0
                              ? "Рекламний ролик"
                              : i === 1
                                ? "Контент для соцмереж"
                                : "Архітектурний ролик",
                          )
                        }
                      >
                        Обговорити формат
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </details>
                ))}
              </div>
              <div className="service-example">
              <button
                className="service-preview"
                aria-label={`Дивитися приклад: ${services[activeService].name}`}
                onClick={(e) => openFilm([0, 3, 2][activeService], e.currentTarget)}
              >
                {[0, 3, 2].map((i, j) => (
                  <img
                    key={i}
                    src={projects[i].poster}
                    alt=""
                    aria-hidden="true"
                    className={activeService === j ? "is-active" : ""}
                    width="960"
                    height="640"
                    loading="lazy"
                  />
                ))}
                <span key={activeService} className="service-cut-sweep" aria-hidden="true"/>
                <span className="service-preview-play">
                  <Play aria-hidden="true" />
                  Дивитися приклад
                </span>
              </button>
              <div className="service-benefit" key={activeService}><span className="service-result-label">Ви отримуєте</span><p>{["Готовий ролик для запуску продукту.", "Серію роликів з різними рекламними акцентами.", "Ролик для презентації архітектури чи інтер’єру."][activeService]}</p></div>
              </div>
            </div>
          </section>
          <StudioPricing onChoose={setChosenOffer} chosenOffer={chosenOffer} />

        </div>
        <StudioQuestions enabled={motion} />
        <section id="contact" className="contact wrap chapter" aria-labelledby="contact-title">
          <div className="section-heading">
            <span className="section-cut" aria-hidden="true" />
            <div>
              <h2 id="contact-title">
                <Words text="Що будемо рекламувати?" />
              </h2>
              <p className="muted">Розкажіть, що рекламуємо. Запропонуємо підхід і розрахуємо вартість.</p>
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
            <StudioBrief service={service} chosenOffer={chosenOffer} chosenProject={chosenProject} clearOffer={() => setChosenOffer("")} clearProject={() => setChosenProject("")} enabled={motion}/>

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
          className="film-dialog"
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
