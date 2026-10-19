/* MExperience.tsx — full-screen publication experience (phone) */
import { useRef } from "react";
import type { Publication } from "@/lib/data";
import { ChevronLeft, ChevronRight, Placeholder, coverProps, swipeHandlers } from "./art";

export function MExperience({ pub, index, total, onClose, onNav }: {
  pub: Publication; index: number; total: number; onClose: () => void; onNav: (dir: number) => void;
}) {
  const drag = useRef({ x: 0, a: false });
  const { onDown, onUp } = swipeHandlers(drag, 50, onNav);

  return (
    <div className="mexp mexp-enter" role="dialog" aria-modal="true">
      <div className="mexp__scrim" aria-hidden="true">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>

      <header className="mexp__bar">
        <span className="id">SPEC {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <nav className="mexp__nav">
          <button className="mexp__btn" aria-label="Previous" onClick={() => onNav(-1)}><ChevronLeft /></button>
          <button className="mexp__btn" aria-label="Next" onClick={() => onNav(1)}><ChevronRight /></button>
          <button className="mexp__btn mexp__btn--close" aria-label="Close" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </nav>
      </header>

      <div className="mexp__body" onTouchStart={onDown} onTouchEnd={onUp}>
        {/* keyed by publication so the swap animation replays */}
        <div className="mexp__inner" key={pub.id}>
          <div className="mexp__cover">
            <Placeholder ratio={pub.ratio} {...coverProps(pub)} big />
          </div>
          <div className="mexp__detail">
            <div className="eyebrow klabel">{pub.secret ? "????" : pub.upcoming ? "Upcoming Release" : "From the Archive"}</div>
            <h2>{pub.title}</h2>
            {pub.jp && <div className="jp">{pub.jp}</div>}
            <div className="desc">
              {pub.descLabel && <span className="lab-tag" style={{ display: "block", marginBottom: 10 }}>{pub.descLabel}</span>}
              <span className="jp" style={{ marginTop: 0, color: "var(--c-ink-2)", fontSize: 15 }}>{pub.descJp}</span>
              <span style={{ display: "block", marginTop: 12, fontSize: 13.5, color: "var(--c-muted)", lineHeight: 1.75 }}>{pub.desc}</span>
            </div>
            <dl className="spec">
              <div><dt>Released</dt><dd>{pub.date}</dd></div>
              <div className="price-cell"><dt>{pub.priceJp} / Price</dt><dd>{pub.price}</dd></div>
              <div><dt>Distributed at</dt><dd>{pub.event}</dd></div>
              <div><dt>Format</dt><dd>{pub.format}</dd></div>
            </dl>
            <div className="previews">
              <span className="lab-tag">Preview Plates — 試し読み</span>
              <div className="previews__grid">
                {pub.previews.map((p, i) => <div className="thumb" key={i}><Placeholder ratio={1.3} label={p} hint={!pub.secret} from={pub.from} to={pub.to} /></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
