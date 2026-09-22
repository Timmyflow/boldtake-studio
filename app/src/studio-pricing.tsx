import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, X } from "lucide-react";
import { Words } from "./studio-motion";
import { videoPackages, formatPrice } from "./studio-offers";
import "./studio-pricing-drawer.css";

const singleOffers = [
  { name: "Ролик 10–15 секунд", price: 5000 },
  { name: "Ролик 20–30 секунд", price: 10000 },
];
const singleTerms = "Сценарій, генерації, монтаж, звук та одна хвиля правок. Один формат на вибір: 9:16 або 16:9. Строк для окремого ролика — 3–10 днів залежно від складності.";
const packageTerms = "Пакети розраховані на один бренд і спільну кампанію. У вартість входять сценарій, генерації, монтаж, звук, один формат та одна спільна хвиля правок. Окремі самостійні концепції й строки пакетів узгоджуємо індивідуально.";
const extraTerms = "Другий формат — +4 000 грн за ролик. Додаткові правки та нові версії оцінюємо до їх виконання.";
const priceNote = "*Порівняно із сумою стартових цін на окремі ролики. Остаточну вартість погоджуємо за сценарієм та обсягом роботи до старту.";
const packageChoice = (p: (typeof videoPackages)[number]) => `Пакет «${p.name}»: ${p.description}, від ${formatPrice(p.price)} грн.`;

export function StudioPricing({ onChoose, chosenOffer }: { onChoose: (name: string) => void; chosenOffer: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const restore = useRef<(() => void) | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterFrame = useRef(0);
  const contactFrame = useRef(0);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState<"single" | "series">("single");

  useEffect(() => () => {
    cancelAnimationFrame(enterFrame.current);
    cancelAnimationFrame(contactFrame.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    restore.current?.();
  }, []);

  function openPricing() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (!dialog.current?.open) {
      const y = window.scrollY;
      const style = document.body.style;
      const previous = { position: style.position, top: style.top, width: style.width, overflow: style.overflow };
      style.position = "fixed";
      style.top = `-${y}px`;
      style.width = "100%";
      style.overflow = "hidden";
      restore.current = () => {
        Object.assign(style, previous);
        window.scrollTo({ top: y, behavior: "instant" });
        restore.current = null;
      };
      dialog.current?.showModal();
    }
    enterFrame.current = requestAnimationFrame(() => {
      enterFrame.current = requestAnimationFrame(() => setVisible(true));
    });
  }

  function closePricing(choice?: string) {
    cancelAnimationFrame(enterFrame.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setVisible(false);
    const finish = () => {
      closeTimer.current = null;
      dialog.current?.close();
      restore.current?.();
      if (choice) {
        onChoose(choice);
        contactFrame.current = requestAnimationFrame(() => {
          window.location.hash = "contact";
          const contact = document.getElementById("contact");
          contact?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
          contact?.querySelector<HTMLElement>("select, textarea, input, a")?.focus({ preventScroll: true });
        });
      } else if (trigger.current?.getClientRects().length) trigger.current.focus({ preventScroll: true });
      else {
        const heading = document.getElementById("pricing-title");
        heading?.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
      }
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else closeTimer.current = setTimeout(finish, 360);
  }

  function switchCategory(next: "single" | "series") {
    setCategory(next);
    scroller.current?.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <section id="pricing" className="pricing chapter wrap" aria-labelledby="pricing-title">
      <div className="section-heading">
        <span className="section-cut" aria-hidden="true" />
        <div>
          <h2 id="pricing-title"><Words text="Вартість і пакети." /></h2>
          <p>Один ролик або серія для вашої кампанії.</p>
        </div>
      </div>
      <div className="pricing-content pricing-desktop">
        <div className="single-offers">
          {singleOffers.map((offer) => <div key={offer.name}>
            <h3>{offer.name}</h3>
            <p>від <strong>{formatPrice(offer.price)}</strong> грн</p>
          </div>)}
        </div>
        <p className="single-terms">{singleTerms}</p>
        <div className="package-list">
          {videoPackages.map((p) => (
            <article className={"package-row"+(chosenOffer.startsWith("Пакет «"+p.name+"»") ? " package-selected" : "")} key={p.name}>
              <div className="package-heading"><h3>{p.name}</h3><p>{p.description}</p><span>{p.detail}</span></div>
              <div className="package-price">
                <p>від <strong>{formatPrice(p.price)}</strong> грн</p>
                <span>Вигода {formatPrice(p.saving)} грн*</span>
                <a href="#contact" className="text-link" aria-label={`Обговорити пакет ${p.name}`} onClick={() => onChoose(packageChoice(p))}>
                  Обговорити пакет<ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="package-terms"><p>{packageTerms}</p><p>{extraTerms}</p><small>{priceNote}</small></div>
      </div>
      <div className="pricing-mobile">
        <div className="pricing-glance">
          {singleOffers.map((offer) => <div key={offer.name}>
            <h3>{offer.name.replace("Ролик ", "")}</h3>
            <p>від <strong>{formatPrice(offer.price)}</strong> грн</p>
          </div>)}
        </div>
        <p className="pricing-mobile-note">Від ідеї до готового ролика. Одна хвиля правок у вартості.</p>
        <button ref={trigger} type="button" className="pricing-open" onClick={openPricing} aria-haspopup="dialog" aria-controls="pricing-drawer">
          Ролики та пакети<ArrowRight aria-hidden="true" />
        </button>
        <p className="pricing-mobile-hint">Склад роботи, строки та розрахунок серії</p>
      </div>
      <dialog id="pricing-drawer" ref={dialog} className={`pricing-drawer${visible ? " is-visible" : ""}`} aria-labelledby="pricing-drawer-title"
        onCancel={(event) => { event.preventDefault(); closePricing(); }}
        onClose={() => { restore.current?.(); setVisible(false); }}
        onClick={(event) => { if (event.target === event.currentTarget) closePricing(); }}>
        <div className="pricing-sheet">
          <header className="pricing-sheet-head">
            <div><span className="pricing-sheet-eyebrow">BOLD / TAKE</span><h2 id="pricing-drawer-title">Ваш наступний<br />ролик.</h2></div>
            <button type="button" className="pricing-close" aria-label="Закрити вартість і пакети" onClick={() => closePricing()} autoFocus><X aria-hidden="true" /></button>
          </header>
          <div className="pricing-switch" role="group" aria-label="Тип замовлення">
            <button type="button" aria-pressed={category === "single"} onClick={() => switchCategory("single")}>Один ролик</button>
            <button type="button" aria-pressed={category === "series"} onClick={() => switchCategory("series")}>Серія</button>
          </div>
          <div ref={scroller} className="pricing-sheet-scroll" data-lenis-prevent>
            {category === "single" ? <div className="pricing-sheet-panel" key="single">
              <p className="pricing-sheet-intro">Одна ідея. Готовий рекламний ролик.</p>
              {singleOffers.map((offer) => <article className="pricing-sheet-offer" key={offer.name}>
                <h3>{offer.name}</h3><p className="pricing-sheet-price">від <strong>{formatPrice(offer.price)}</strong> грн</p>
                <button type="button" className="pricing-sheet-choose" onClick={() => closePricing(`${offer.name}, від ${formatPrice(offer.price)} грн.`)}>Обговорити ролик<ArrowUpRight aria-hidden="true" /></button>
              </article>)}
              <div className="pricing-sheet-terms"><h3>Що входить</h3><p>{singleTerms}</p><p>{extraTerms}</p><p>Остаточну вартість погоджуємо за сценарієм та обсягом роботи до старту.</p></div>
            </div> : <div className="pricing-sheet-panel" key="series">
              <p className="pricing-sheet-intro">Кілька роликів для спільної кампанії.</p>
              {videoPackages.map((p) => <article className="pricing-sheet-offer" key={p.name}>
                <h3>{p.name}</h3><p className="pricing-sheet-description">{p.description}</p><p className="pricing-sheet-detail">{p.detail}</p>
                <p className="pricing-sheet-price">від <strong>{formatPrice(p.price)}</strong> грн</p><span className="pricing-sheet-saving">Вигода {formatPrice(p.saving)} грн*</span>
                <button type="button" className="pricing-sheet-choose" aria-label={`Обговорити пакет ${p.name}`} onClick={() => closePricing(packageChoice(p))}>Обговорити пакет<ArrowUpRight aria-hidden="true" /></button>
              </article>)}
              <div className="pricing-sheet-terms"><h3>Умови серії</h3><p>{packageTerms}</p><p>{extraTerms}</p><small>{priceNote}</small></div>
            </div>}
          </div>
        </div>
      </dialog>
    </section>
  );
}
