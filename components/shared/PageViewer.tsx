/* PageViewer.tsx — full-screen 試し読み viewer: the tapped page large in the middle,
   arrows (and swipes on touch screens) to move between pages, Esc / backdrop to close.
   Opened from inside the publication viewer, so it sits above it and keeps its keys
   and swipes to itself (they would otherwise flip to another book). */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PreviewPage, Publication } from "@/lib/data";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { ChevronLeft, ChevronRight, PageImg, Placeholder } from "./art";

/* Focus starts on the close button: useDialogFocus focuses the first control, which is it. */
export function PageViewer({ pages, title, start, onClose }: {
  pages: readonly PreviewPage[]; title: string; start: number; onClose: () => void;
}) {
  const dialog = useDialogFocus();
  const [i, setI] = useState(start);
  const [dir, setDir] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const total = pages.length;

  const go = (n: number) => {
    if (n < 0 || n >= total || n === i) return;
    setDir(n > i ? 1 : -1);
    setI(n);
  };

  /* keys: capture phase so the publication viewer's own Esc / arrow handling never sees them */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
      else return;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  /* warm up the neighbours so arrows feel instant */
  useEffect(() => {
    [i - 1, i + 1].forEach((n) => { if (pages[n]) new Image().src = pages[n].full; });
  }, [i, pages]);

  /* React events from a portal still bubble to the publication viewer's swipe handlers */
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const onTouchStart = (e: React.TouchEvent) => {
    stop(e);
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    stop(e);
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
  };

  return createPortal(
    <div ref={dialog} tabIndex={-1} className="pv" role="dialog" aria-modal="true" aria-label={`${title} 試し読み`}
         onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onPointerDown={stop} onPointerUp={stop}>
      <header className="pv__bar" onClick={stop}>
        <span className="pv__count">PAGE {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <button className="pv__btn" aria-label="閉じる" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </header>

      <div className="pv__stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- images are pre-sized in public/images */}
        <img key={i} className={"pv__img" + (dir > 0 ? " from-next" : dir < 0 ? " from-prev" : "")}
             src={pages[i].full} alt={`${title} 試し読み ${i + 1}ページ目`} draggable={false} onClick={stop} />
      </div>

      <nav className="pv__nav" onClick={stop}>
        <button className="pv__btn pv__arrow pv__arrow--prev" aria-label="前のページ" disabled={i === 0} onClick={() => go(i - 1)}><ChevronLeft /></button>
        <span className="pv__dots" aria-hidden="true">
          {pages.map((_, n) => <span key={n} className={"pv__dot" + (n === i ? " on" : "")} onClick={() => go(n)} />)}
        </span>
        <button className="pv__btn pv__arrow pv__arrow--next" aria-label="次のページ" disabled={i === total - 1} onClick={() => go(i + 1)}><ChevronRight /></button>
      </nav>
    </div>,
    document.body,
  );
}

/* 試し読み grid: page thumbnails that open the viewer, placeholders where there's no page yet.
   Thumbnails stay links to the full page so they still work without JavaScript. */
export function PreviewThumbs({ pub }: { pub: Publication }) {
  const [open, setOpen] = useState<number | null>(null);
  const thumbs = useRef<(HTMLAnchorElement | null)[]>([]);
  const close = () => {
    const n = open;
    setOpen(null);
    if (n != null) thumbs.current[n]?.focus();
  };

  return (
    <>
      {pub.previews.map((label, i) => {
        const page = pub.pages?.[i];
        return page ? (
          <a className="thumb" key={i} href={page.full} ref={(el) => { thumbs.current[i] = el; }}
             onClick={(e) => { e.preventDefault(); setOpen(i); }}
             aria-label={`${pub.title} 試し読み ${i + 1}ページ目を開く`}>
            <PageImg src={page.thumb} alt={`${pub.title} 試し読み ${i + 1}`} />
          </a>
        ) : (
          <div className="thumb" key={i}><Placeholder ratio={1.3} label={label} hint={!pub.secret} from={pub.from} to={pub.to} /></div>
        );
      })}
      {open != null && pub.pages && <PageViewer pages={pub.pages} title={pub.title} start={open} onClose={close} />}
    </>
  );
}
