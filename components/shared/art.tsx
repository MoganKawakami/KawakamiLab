/* art.tsx — KAWAKAMI Lab. mark, decorative shapes and placeholder artwork */
import { useEffect, useId, useRef, useState } from "react";
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
    <div className={"ph ph--placeholder" + (big ? " ph--big" : "")}
      style={{ aspectRatio: String(1 / ratio), background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <div className="ph__stripes" />
      <div className="ph__sheen" />
      {/* corner tick — lab specimen framing */}
      <svg className="ph__tick" fill="none">
        <path d="M0 14V0h14" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" />
      </svg>
      <div className="ph__label">
        <div className="ph__code">{label}</div>
        {sub && <div className="ph__sub">{sub}</div>}
        {hint && <div className="ph__hint">drop artwork here</div>}
      </div>
    </div>
  );
}

/* A photo filling its frame with the focus point — a character's face — at the centre.
   focus is [x, y] as fractions of the image (0–1). The image covers the frame like
   object-fit: cover; when the face sits too close to an edge to reach the centre that
   way, it zooms in up to maxZoom (1 = never zoom, e.g. book covers stay whole). */
export function FocusImg({ src, alt, focus, maxZoom = 1 }: {
  src: string; alt: string; focus: readonly [number, number]; maxZoom?: number;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState<React.CSSProperties | null>(null);
  const [fx, fy] = focus;

  useEffect(() => {
    const img = ref.current, frame = img?.parentElement;
    if (!img || !frame) return;
    const place = () => {
      const bw = frame.clientWidth, bh = frame.clientHeight, nw = img.naturalWidth, nh = img.naturalHeight;
      if (!bw || !bh || !nw || !nh) return;
      const cover = Math.max(bw / nw, bh / nh);
      /* zoom needed so the face can sit mid-frame on both axes */
      const need = (frameLen: number, len: number, f: number) => frameLen / (2 * Math.max(0.01, Math.min(f, 1 - f)) * len);
      const zoom = Math.min(maxZoom, Math.max(1, need(bw, nw * cover, fx), need(bh, nh * cover, fy)));
      const w = nw * cover * zoom, h = nh * cover * zoom;
      const at = (frameLen: number, len: number, f: number) => Math.min(0, Math.max(frameLen - len, frameLen / 2 - f * len));
      setBox({ left: at(bw, w, fx), top: at(bh, h, fy), width: w, height: h });
    };
    place();
    img.addEventListener("load", place);
    const ro = new ResizeObserver(place);
    ro.observe(frame);
    return () => { img.removeEventListener("load", place); ro.disconnect(); };
  }, [src, fx, fy, maxZoom]);

  /* before measuring (and on the server) fall back to a plain cover crop toward the face */
  const style: React.CSSProperties = box
    ? { position: "absolute", maxWidth: "none", ...box }
    : { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%` };
  return (
    // eslint-disable-next-line @next/next/no-img-element -- images are pre-sized in public/images
    <img ref={ref} src={src} alt={alt} loading="lazy" decoding="async" draggable={false} style={style} />
  );
}

/* Same frame as Placeholder (class "ph", aspect from ratio) but holding a photo */
export function Photo({ ratio = 1.4, src, alt, focus = [0.5, 0.5], maxZoom }: {
  ratio?: number; src: string; alt: string; focus?: readonly [number, number]; maxZoom?: number;
}) {
  return (
    <div className="ph ph--photo" style={{ aspectRatio: String(1 / ratio) }}>
      <FocusImg src={src} alt={alt} focus={focus} maxZoom={maxZoom} />
    </div>
  );
}

/* A whole page, never cropped (letterboxed if its shape differs from the frame) */
export function PageImg({ ratio = 1.414, src, alt }: { ratio?: number; src: string; alt: string }) {
  return (
    <div className="ph ph--page" style={{ aspectRatio: String(1 / ratio) }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- images are pre-sized in public/images */}
      <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
    </div>
  );
}

/* Cover for a publication: its artwork when there is one, otherwise the placeholder */
export function Cover({ p, ratio, big }: { p: Publication; ratio: number; big?: boolean }) {
  return p.image
    ? <Photo ratio={ratio} src={p.image.src} alt={p.title} focus={p.image.focus} />
    : <Placeholder ratio={ratio} {...coverProps(p)} big={big} />;
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
