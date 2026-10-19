/* art.tsx — KAWAKAMI Lab. mark, decorative shapes and placeholder artwork */
import { useId } from "react";
import type { Publication } from "@/lib/data";

/* The circuit-"K": a vertical spine, two diagonal traces branching from a
   central junction node, with terminal nodes — reads as both K and a lab schematic. */
export function Logo({ size = 34, stroke = 3, mono = false }: { size?: number; stroke?: number; mono?: boolean }) {
  const gid = "lg" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const col = mono ? "currentColor" : `url(#${gid})`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-label="KAWAKAMI Lab.">
      {!mono && (
        <defs>
          <linearGradient id={gid} x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--c-primary)" />
            <stop offset="0.5" stopColor="var(--c-secondary)" />
            <stop offset="1" stopColor="var(--c-deep)" />
          </linearGradient>
        </defs>
      )}
      <path d="M15 7V41" stroke={col} strokeWidth={stroke} strokeLinecap="round" />
      <path d="M15 24 L34 8" stroke={col} strokeWidth={stroke} strokeLinecap="round" />
      <path d="M15 24 L27 34 L34 40" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="24" r="3.4" fill={col} />
      <circle cx="34" cy="8" r="3" fill={mono ? "currentColor" : "var(--c-primary)"} />
      <circle cx="34" cy="40" r="3" fill={mono ? "currentColor" : "var(--c-deep)"} />
      <circle cx="27" cy="34" r="2.1" fill={mono ? "currentColor" : "var(--c-secondary)"} />
      <circle cx="15" cy="7" r="2.1" fill={mono ? "currentColor" : "var(--c-primary)"} />
      <circle cx="15" cy="41" r="2.1" fill={mono ? "currentColor" : "var(--c-secondary)"} />
    </svg>
  );
}

export function ShapeRing({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke="var(--c-primary)" strokeWidth="1.2" strokeDasharray="3 7" opacity=".7" />
      <circle cx="50" cy="50" r="30" stroke="var(--c-deep)" strokeWidth="1.4" opacity=".5" />
      <circle cx="50" cy="4" r="3" fill="var(--c-secondary)" />
      <circle cx="50" cy="50" r="4" fill="var(--c-primary)" />
    </svg>
  );
}

export function ShapeNodes({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none">
      <path d="M20 20L65 50L110 24M65 50V110M65 50L30 96" stroke="var(--c-deep)" strokeWidth="1.2" opacity=".55" />
      <circle cx="20" cy="20" r="4" fill="var(--c-primary)" />
      <circle cx="110" cy="24" r="4" fill="var(--c-secondary)" />
      <circle cx="65" cy="50" r="5.5" fill="none" stroke="var(--c-deep)" strokeWidth="1.6" />
      <circle cx="65" cy="110" r="4" fill="var(--c-secondary)" />
      <circle cx="30" cy="96" r="3.2" fill="var(--c-primary)" />
    </svg>
  );
}

export function ShapePlus({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <path d="M30 8v44M8 30h44" stroke="var(--c-primary)" strokeWidth="1.4" opacity=".6" />
      <rect x="22" y="22" width="16" height="16" stroke="var(--c-deep)" strokeWidth="1.4" fill="none" transform="rotate(45 30 30)" />
    </svg>
  );
}

/* Striped, gradient-tinted placeholder. ratio controls the cover proportion;
   label is the monospace explainer. Swap for real artwork later. */
export function Placeholder({
  ratio = 1.4, label = "COVER", from = "var(--c-primary)", to = "var(--c-deep)", sub, big = false, hint = true,
}: { ratio?: number; label?: string; from?: string; to?: string; sub?: string; big?: boolean; hint?: boolean }) {
  return (
    <div className="ph" style={{
      position: "relative", width: "100%", aspectRatio: String(1 / ratio),
      background: `linear-gradient(135deg, ${from}, ${to})`,
      display: "grid", placeItems: "center", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: .5, mixBlendMode: "soft-light",
        backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,.5) 0 1px, transparent 1px 11px)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(120% 90% at 80% 0%, rgba(255,255,255,.32), transparent 55%)",
      }} />
      {/* corner tick — lab specimen framing */}
      <svg style={{ position: "absolute", inset: 12, width: "calc(100% - 24px)", height: "calc(100% - 24px)" }} fill="none">
        <path d="M0 14V0h14" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" />
      </svg>
      <div style={{ position: "relative", textAlign: "center", color: "#fff", padding: 20 }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: big ? 13 : 10.5, letterSpacing: ".22em",
          textTransform: "uppercase", opacity: .92,
        }}>{label}</div>
        {sub && <div style={{
          fontFamily: "var(--font-jp)", fontSize: big ? 18 : 13, marginTop: 8, opacity: .85, fontWeight: 500,
        }}>{sub}</div>}
        {hint && <div style={{
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", marginTop: 12,
          opacity: .6, textTransform: "uppercase",
        }}>drop artwork here</div>}
      </div>
    </div>
  );
}

/* Cover props for a publication: unannounced ones show "Coming soon..." with no hint */
export function coverProps(p: Publication) {
  return { label: p.cover || p.title, sub: p.cover ? undefined : p.jp, hint: !p.secret, from: p.from, to: p.to };
}

export function ChevronLeft() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function ChevronRight() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/* Horizontal swipe detector shared by the decks (touch + pointer). */
type SwipeEvent = React.TouchEvent | React.PointerEvent;
const clientX = (e: SwipeEvent, end: boolean) =>
  "touches" in e ? (end ? e.changedTouches[0].clientX : e.touches[0].clientX) : e.clientX;

export function swipeHandlers(
  drag: React.RefObject<{ x: number; a: boolean }>,
  threshold: number,
  onSwipe: (dir: 1 | -1) => void,
) {
  const onDown = (e: SwipeEvent) => { drag.current = { x: clientX(e, false), a: true }; };
  const onUp = (e: SwipeEvent) => {
    if (!drag.current.a) return;
    const dx = clientX(e, true) - drag.current.x;
    drag.current.a = false;
    if (dx < -threshold) onSwipe(1); else if (dx > threshold) onSwipe(-1);
  };
  return { onDown, onUp };
}
