/* FavStrip.tsx — favourite characters as a horizontal strip with a slide bar (PC + phone).
   Touch and trackpads scroll the strip natively; a mouse can drag the strip, and the bar
   can be dragged or clicked. Swipes here never reach the profile deck around it. */
import { useEffect, useRef, useState } from "react";
import type { Fav } from "@/lib/data";
import { Photo, Placeholder } from "./art";

export function FavStrip({ favs }: { favs: readonly Fav[] }) {
  const win = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState({ p: 0, w: 1 });
  const drag = useRef<{ from: number; left: number; on: "win" | "bar" } | null>(null);

  const onScroll = () => {
    const el = win.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProg({ p: max > 0 ? el.scrollLeft / max : 0, w: el.clientWidth / el.scrollWidth });
  };
  useEffect(() => { onScroll(); }, []);

  /* the bar's thumb follows the pointer: its centre goes where the pointer is */
  const scrollToBar = (clientX: number, bar: HTMLElement) => {
    const el = win.current;
    if (!el) return;
    const r = bar.getBoundingClientRect(), thumb = r.width * prog.w;
    const p = Math.max(0, Math.min(1, (clientX - r.left - thumb / 2) / Math.max(1, r.width - thumb)));
    el.scrollLeft = p * (el.scrollWidth - el.clientWidth);
  };

  const start = (on: "win" | "bar") => (e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
    if (on === "win" && e.pointerType !== "mouse") return; // touch scrolls natively
    const el = win.current;
    if (!el) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = "none"; // follow the pointer exactly while dragging
    drag.current = { from: e.clientX, left: el.scrollLeft, on };
    if (on === "bar") scrollToBar(e.clientX, e.currentTarget);
  };
  const move = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current, el = win.current;
    if (!d || !el) return;
    if (d.on === "win") el.scrollLeft = d.left - (e.clientX - d.from);
    else scrollToBar(e.clientX, e.currentTarget);
  };
  const end = (e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!drag.current) return;
    drag.current = null;
    if (win.current) win.current.style.scrollSnapType = ""; // snap to the nearest character
  };
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div className="pf-favslider" onPointerDown={stop} onPointerUp={stop} onTouchStart={stop} onTouchEnd={stop}>
      <div className="pf-favwin" ref={win} onScroll={onScroll}
        onPointerDown={start("win")} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        {favs.map((v) => (
          <div className="pf-fav" key={v.code}>
            <div className="pf-fav-art">{v.img ? <Photo ratio={1} src={v.img} alt={v.name} /> : <Placeholder ratio={1} label={v.code} from={v.from} to={v.to} />}</div>
            <div className="cap">{v.name}<small>{v.code}</small></div>
          </div>
        ))}
      </div>
      <div className="pf-favbar" aria-hidden="true"
        onPointerDown={start("bar")} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <span className="pf-favbar__thumb" style={{ width: (prog.w * 100) + "%", left: (prog.p * (1 - prog.w) * 100) + "%" }} />
      </div>
    </div>
  );
}
