import { useDialogFocus } from "@/lib/use-dialog-focus";
/* Experience.tsx — PC full-screen publication exhibition */
import type { Publication } from "@/lib/data";
import { ChevronLeft, ChevronRight, Cover, Logo } from "../lab/art";
import { PreviewThumbs } from "../lab/PageViewer";

export function Experience({ pub, index, total, onClose, onNav }: {
  pub: Publication; index: number; total: number; onClose: () => void; onNav: (dir: number) => void;
}) {
  const dialog = useDialogFocus();

  return (
    <div className="exp exp-enter" ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={pub.title}>
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
            <Cover p={pub} ratio={pub.ratio} big />
          </div>

          <div className="exp__detail swap">
            <div className="eyebrow klabel">{pub.secret ? "????" : pub.upcoming ? "Upcoming Release" : "From the Archive"}</div>
            <h2>{pub.title}</h2>
            {pub.jp && <div className="jp">{pub.jp}</div>}
            <div className="desc">
              {pub.descLabel && <span className="lab-tag" style={{ display: "block", marginBottom: 12 }}>{pub.descLabel}</span>}
              <span className="jp" style={{ marginTop: 0, color: "var(--c-ink-2)", fontSize: 16 }}>{pub.descJp}</span>
              <span className="en" style={{ display: "block", marginTop: 14, fontSize: 14.5, color: "var(--c-muted)", lineHeight: 1.75 }}>{pub.desc}</span>
            </div>
            <dl className="spec">
              <div><dt>Released</dt><dd>{pub.date}</dd></div>
              <div className="price-cell"><dt>{pub.priceJp} / Price</dt><dd>{pub.price}</dd></div>
              <div><dt>Distributed at</dt><dd>{pub.event}</dd></div>
              <div><dt>Format</dt><dd style={{ whiteSpace: "pre-line" }}>{pub.format}</dd></div>
            </dl>
            <div className="previews">
              <span className="lab-tag">Preview Plates — 試し読み</span>
              <div className="previews__grid">
                <PreviewThumbs pub={pub} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
