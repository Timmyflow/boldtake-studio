import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { HeaderBrand } from "./studio-header-brand";
import { projects } from "./studio-content";
import { Words } from "./studio-motion";

export function BrandMark() {
  return (
    <span className="brand-lockup" aria-hidden="true">
      <span className="brand-word brand-word-first">BOLD</span>
      <svg className="brand-splice" viewBox="0 0 18 36" fill="none">
        <path d="M10 0H18L8 36H0L10 0Z" fill="currentColor" />
      </svg>
      <span className="brand-word brand-word-last">TAKE</span>
    </span>
  );
}
const links = [
  { href: "#work", label: "Роботи", note: "Подивитися ролики", image: 1 },
  { href: "#services", label: "Послуги", note: "Знайти свій формат", image: 0 },
  { href: "#pricing", label: "Вартість", note: "Ролики та пакети", image: 0 },
  { href: "#approach", label: "Підхід", note: "Від ідеї до монтажу", image: 2 },
  { href: "#questions", label: "Питання", note: "Перед початком роботи", image: 3 },
  { href: "#contact", label: "Контакт", note: "Обговорити ваш проєкт", image: 1 },
];
export function StudioNavigation({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0);
  const panel = useRef<HTMLDialogElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  const pendingTarget = useRef<string | null>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    let previous = window.scrollY, frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const up = y < previous - 3;
        if (Math.abs(y-previous) > 3 || y < 100) {
          header.current?.classList.toggle("nav-away", y > 150 && !up);
          header.current?.classList.toggle("nav-return", y > 100);
          previous = y;
        }
        frame = 0;
      });
    };
    window.addEventListener("scroll",scroll,{passive:true});
    return () => {window.removeEventListener("scroll",scroll); cancelAnimationFrame(frame);};
  }, []);
  useEffect(() => {
    if (!open) {
      const href = pendingTarget.current;
      pendingTarget.current = null;
      if (!href) return;
      const frame = window.setTimeout(() => {
        const target = document.querySelector<HTMLElement>(href);
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
        if (target)
          window.scrollTo({
            top: window.scrollY + target.getBoundingClientRect().top - 24,
            behavior: "instant",
          });
      }, 120);
      return () => window.clearTimeout(frame);
    }
    const el = panel.current;
    if (!el) return;
    const previous = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el.close();
      document.body.style.overflow = previous;
      toggle.current?.focus({ preventScroll: true });
    };
  }, [open]);
  const follow = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    pendingTarget.current = href;
    setOpen(false);
  };
  return (
    <>
      <header ref={header} className="site-header wrap identity-header">
        <a className="wordmark" href="#main" aria-label="BOLDTAKE, головна">
          <HeaderBrand enabled={enabled} />
        </a>
        <nav className="desktop-navigation" aria-label="Основна навігація">
          {links
            .filter((l) => ["#work", "#services", "#pricing", "#questions"].includes(l.href))
            .map((l) => (
              <a href={l.href} key={l.href}>
                <span>{l.label}</span>
                <span aria-hidden="true">{l.label}</span>
              </a>
            ))}
        </nav>
        <a href="#contact" className="nav-contact">
          Обговорити проєкт
          <ArrowUpRight aria-hidden="true" />
        </a>
        <button
          ref={toggle}
          className="cut-menu-trigger"
          aria-label="Відкрити меню"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span>Меню</span>
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>
      <dialog
        ref={panel}
        className={`cut-menu ${enabled ? "motion-enabled" : ""}`}
        aria-label="Навігація BOLDTAKE"
        onCancel={() => setOpen(false)}
      >
        <div className="cut-menu-top">
          <a
            className="wordmark"
            href="#main"
            aria-label="BOLDTAKE, головна"
            onClick={(e) => follow(e, "#main")}
          >
            <BrandMark />
          </a>
          <button
            className="cut-menu-close"
            onClick={() => setOpen(false)}
            aria-label="Закрити меню"
          >
            Закрити
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="cut-menu-body">
          <nav aria-label="Розділи сайту">
            {links.map((l, i) => (
              <a
                href={l.href}
                key={l.href}
                style={{ "--menu-order": i } as React.CSSProperties}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(i);
                }}
                onFocus={() => setActive(i)}
                onClick={(e) => follow(e, l.href)}
              >
                <span>{l.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="menu-preview" aria-hidden="true">
            <div>
              {projects.map((p, i) => (
                <img
                  key={p.id}
                  src={p.poster}
                  alt=""
                  className={links[active].image === i ? "is-active" : ""}
                />
              ))}
            </div>
            <span>{links[active].note}</span>
          </div>
        </div>
        <div className="cut-menu-bottom">
          <span>Рекламні ролики для брендів.</span>
          <a href="https://t.me/lmaze22" target="_blank" rel="noopener noreferrer">
            Написати в Telegram
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </>
  );
}
const disclosures = new WeakMap<HTMLDetailsElement, Animation>();
export function animateDisclosure(e: MouseEvent<HTMLElement>, enabled: boolean) {
  if (!enabled || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const details = e.currentTarget.parentElement as HTMLDetailsElement;
  if (!details || details.tagName !== "DETAILS") return;
  e.preventDefault();
  const previous = disclosures.get(details);
  const start = details.getBoundingClientRect().height;
  const opening = details.dataset.closing === "true" || !details.open;
  if (previous) {
    previous.onfinish = null;
    previous.cancel();
  }
  details.style.height = "";
  details.open = true;
  details.dataset.closing = opening ? "false" : "true";
  const style = getComputedStyle(details);
  const end = opening
    ? details.getBoundingClientRect().height
    : e.currentTarget.getBoundingClientRect().height +
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth);
  details.style.overflow = "hidden";
  const anim = details.animate([{ height: `${start}px` }, { height: `${end}px` }], {
    duration: 320,
    easing: "cubic-bezier(.22,1,.36,1)",
  });
  disclosures.set(details, anim);
  anim.onfinish = () => {
    details.open = opening;
    details.style.overflow = "";
    delete details.dataset.closing;
    disclosures.delete(details);
    details.dispatchEvent(new Event("studio:layout", { bubbles: true }));
  };
}
function exclusiveQuestion(e: MouseEvent<HTMLElement>, enabled: boolean) {
  const current = e.currentTarget.parentElement;
  current?.parentElement?.querySelectorAll<HTMLDetailsElement>("details").forEach(other => {
    if(other === current) return;
    const animation = disclosures.get(other);
    if(animation) { animation.onfinish = null; animation.cancel(); disclosures.delete(other); }
    other.open = false;
    other.style.height = "";
    other.style.overflow = "";
    delete other.dataset.closing;
  });
  animateDisclosure(e, enabled);
}
const questions = [
  {
    question: "Скільки коштує ролик?",
    answer:
      "Рекламний ролик 10–15 секунд — від 4 500 грн, 20–30 секунд — від 8 000 грн. Пакети з кількох роликів — від 8 000 грн. У вартість входять сценарій, генерації, монтаж, звук та одна хвиля правок. Остаточну суму узгоджуємо за сценарієм і обсягом до початку роботи.",
  },
  {
    question: "Скільки часу займає робота?",
    answer:
      "Для окремого ролика — від 3 до 10 днів залежно від складності. Строки пакетів узгоджуємо окремо перед початком роботи.",
  },
  {
    question: "Скільки правок входить у вартість?",
    answer:
      "Одна хвиля правок. Зберіть коментарі в один список, щоб ми могли врахувати їх разом. Додаткові правки оцінюємо окремо та погоджуємо їхню вартість до внесення.",
  },
  {
    question: "Що потрібно для старту?",
    answer:
      "Розкажіть, що рекламуємо, для кого і де вийде ролик. Додайте матеріали продукту або проєкту, логотип та приклади, які вам подобаються.",
  },
  {
    question: "А якщо в мене ще немає сценарію?",
    answer:
      "Почнемо із задачі. Запропонуємо ідею та сценарій, покажемо ключові кадри. Після узгодження перейдемо до виробництва.",
  },
  {
    question: "Можна працювати з готовими рендерами?",
    answer:
      "Так. Для архітектурного ролика використовуємо ваші рендери та матеріали проєкту. Перед початком визначимо ракурси, рух камери й те, що має залишитися без змін.",
  },
  {
    question: "Чи можна отримати різні формати?",
    answer:
      "Один формат — 9:16 або 16:9 — обираємо до старту. Якщо потрібні обидва, доплата за другий формат становить 4 000 грн. Додаткові версії ролика обговорюємо окремо.",
  },
];
export function StudioQuestions({ enabled }: { enabled: boolean }) {
  return (
    <section id="questions" className="questions wrap chapter" aria-labelledby="questions-title">
      <div className="section-heading">
        <span className="section-cut" aria-hidden="true" />
        <div>
          <h2 id="questions-title">
            <Words text="Перед початком." />
          </h2>
          <p>Кілька відповідей, щоб перейти до справи.</p>
        </div>
      </div>
      <div className="questions-list">
        {questions.map((q) => (
          <details className="question-row" name="studio-faq" key={q.question}>
            <summary onClick={(e) => exclusiveQuestion(e, enabled)}>
              <h3>{q.question}</h3>
              <Plus aria-hidden="true" />
            </summary>
            <div className="question-answer">
              <p>{q.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
