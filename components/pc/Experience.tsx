/* Experience.tsx — PC full-screen publication exhibition */
import type { Publication } from "@/lib/data";
import { ChevronLeft, ChevronRight, Logo, Placeholder } from "../lab/art";

export function Experience({ pub, index, total, onClose, onNav }: {
  pub: Publication; index: number; total: number; onClose: () => void; onNav: (dir: number) => void;
}) {
  return (
    <div className="exp exp-enter" role="dialog" aria-modal="true">
      {/* ambient scrim */}
      <div className="exp__scrim" aria-hidden="true">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>

      {/* top bar */}
      <header className="exp__bar">
        <div className="exp__brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={26} />
          <span className="id">SPECIMEN {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <nav className="exp__nav">
          <button className="exp__btn" aria-label="Previous" onClick={() => onNav(-1)}><ChevronLeft /></button>
          <button className="exp__btn" aria-label="Next" onClick={() => onNav(1)}><ChevronRight /></button>
          <button className="exp__btn exp__btn--close" aria-label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </nav>
      </header>

      <div className="exp__body">
        {/* keyed by publication so the swap animation replays */}
        <div className="exp__inner" key={pub.id}>
          <div className="exp__cover swap">
            <Placeholder ratio={pub.ratio} label={pub.title} sub={pub.jp} from={pub.from} to={pub.to} big />
          </div>

          <div className="exp__detail swap">
            <div className="eyebrow klabel">{pub.upcoming ? "Upcoming Release" : "From the Archive"}</div>
            <h2>{pub.title}</h2>
            <div className="jp">{pub.jp}</div>
            <p className="desc">{pub.desc}<span className="jp">{pub.descJp}</span></p>
            <dl className="spec">
              <div><dt>Released</dt><dd>{pub.date}</dd></div>
              <div className="price-cell"><dt>{pub.priceJp} / Price</dt><dd>{pub.price}</dd></div>
              <div><dt>Distributed at</dt><dd>{pub.event}</dd></div>
              <div><dt>Format</dt><dd>{pub.format}</dd></div>
            </dl>
            <div className="tags">{pub.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}</div>
            <div className="previews">
              <span className="lab-tag">Preview Plates — 試し読み</span>
              <div className="previews__grid">
                {pub.previews.map((p, i) => <div className="thumb" key={i}><Placeholder ratio={1.3} label={p} from={pub.from} to={pub.to} /></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
