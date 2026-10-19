/* Share-card image for a fortune result — "Lavender Lab" design, matching the fortune page:
   lavender graph paper, the crystal ball on a lit stage (left) and the result as an
   "observed specimen" label (right).
   next/og lays out with flexbox only; the crystal ball is an inline SVG so it can use
   gradients, clipping and blur like the page's CSS ball. */
import { ImageResponse } from "next/og";
import { HASHTAG, decodeFortune } from "@/lib/fortune-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lab. Fortune — 今日の運勢";

const C = { ink: "#1e1147", ink2: "#4b3f72", muted: "#6b5ca3", line: "#e2d9ff", violet: "#7c3aed", teal: "#0e7490" };

/* Fetch just the glyphs we draw; Google serves TTF to non-browser clients */
async function font(family: string, weight: number, text: string) {
  const css = await (await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`,
  )).text();
  const src = /src: url\((.+?)\) format\('(opentype|truetype)'\)/.exec(css);
  if (!src) throw new Error(`font not found: ${family} ${weight}`);
  return (await fetch(src[1])).arrayBuffer();
}

const rankSize = (rank: string) => (rank.length <= 1 ? 118 : rank.length === 2 ? 112 : 92);
/* Training pick on one line: up to 58px, smaller for long names (~600px available) */
const umaSize = (name: string) => Math.min(58, Math.floor(600 / name.length));
/* English name above the Japanese one: up to 28px, smaller for long names (~600px, Latin ≈ .56em) */
const enSize = (name: string) => Math.min(28, Math.floor(600 / (name.length * 0.56)));
/* Item / scenario values get ~395px (Latin counts as about half a glyph). Keep them on one
   line while that stays readable (24px+); otherwise wrap onto two lines */
const valueSize = (text: string) => {
  const units = [...text].reduce((n, c) => n + (c.charCodeAt(0) < 0x2000 ? 0.55 : 1), 0);
  const oneLine = Math.floor(395 / units);
  return oneLine >= 24 ? Math.min(30, oneLine) : Math.max(20, Math.min(30, Math.floor((395 * 1.8) / units)));
};

/* The crystal ball (same layers as the page: deep glass, swirling mist, highlights,
   refraction rim, two tilted orbits, stand and cast light) */
function Ball() {
  return (
    <svg width="250" height="300" viewBox="0 0 250 300">
      <defs>
        <radialGradient id="body" cx="46%" cy="44%" r="62%">
          <stop offset="0" stopColor="#a48bff" /><stop offset=".72" stopColor="#3b1d8f" /><stop offset="1" stopColor="#12053a" />
        </radialGradient>
        <radialGradient id="core" cx="50%" cy="68%" r="36%">
          <stop offset="0" stopColor="#eafcff" stopOpacity=".95" /><stop offset="1" stopColor="#eafcff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hl" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="crescent" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity=".6" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cast" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7c3aed" stopOpacity=".35" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".55" stopColor="#c9c2e8" /><stop offset="1" stopColor="#7d74a8" />
        </linearGradient>
        <filter id="mist" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id="glass"><circle cx="125" cy="125" r="100" /></clipPath>
      </defs>

      <ellipse cx="125" cy="286" rx="118" ry="16" fill="url(#cast)" />
      <path d="M86 228 H164 L184 280 H66 Z" fill="url(#stand)" />
      <ellipse cx="125" cy="230" rx="38" ry="7" fill="#ffffff" />

      {/* back half of the orbits, behind the glass */}
      <ellipse cx="125" cy="125" rx="150" ry="36" fill="none" stroke="#7c3aed" strokeOpacity=".5" strokeWidth="1.6" strokeDasharray="5 6" transform="rotate(-8 125 125)" />
      <ellipse cx="125" cy="125" rx="178" ry="46" fill="none" stroke="#7c3aed" strokeOpacity=".25" strokeWidth="1.4" strokeDasharray="4 7" transform="rotate(10 125 125)" />

      <g clipPath="url(#glass)">
        <circle cx="125" cy="125" r="100" fill="url(#body)" />
        <g filter="url(#mist)" opacity=".85">
          <ellipse cx="88" cy="96" rx="46" ry="22" fill="#22D3EE" transform="rotate(-30 88 96)" />
          <ellipse cx="162" cy="150" rx="50" ry="20" fill="#c084fc" transform="rotate(-20 162 150)" />
          <ellipse cx="120" cy="178" rx="40" ry="16" fill="#22D3EE" opacity=".7" />
          <ellipse cx="160" cy="80" rx="26" ry="12" fill="#f0abfc" opacity=".6" />
        </g>
        <circle cx="125" cy="125" r="100" fill="url(#core)" />
        <ellipse cx="125" cy="218" rx="62" ry="22" fill="url(#crescent)" />
      </g>
      <circle cx="125" cy="125" r="99.5" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" />
      <circle cx="125" cy="125" r="80" fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="2" />
      <ellipse cx="88" cy="62" rx="44" ry="26" fill="url(#hl)" transform="rotate(-24 88 62)" />
      <ellipse cx="80" cy="60" rx="9" ry="7" fill="#fff" />
      <circle cx="160" cy="92" r="2.6" fill="#fff" /><circle cx="98" cy="152" r="2.2" fill="#fff" /><circle cx="165" cy="168" r="1.8" fill="#fff" />

      {/* front arc of the inner orbit with its travelling light */}
      <path d="M -24 140 A 150 36 -8 0 0 274 98" fill="none" stroke="#7c3aed" strokeOpacity=".55" strokeWidth="1.6" strokeDasharray="5 6" />
      <circle cx="232" cy="134" r="7" fill="#22D3EE" filter="url(#glow)" /><circle cx="232" cy="134" r="4" fill="#cffafe" />
    </svg>
  );
}

function Mark() {
  return (
    <svg width="34" height="34" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="k" x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" /><stop offset=".5" stopColor="#22D3EE" /><stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <g stroke="url(#k)" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M15 7V41" /><path d="M15 24 L34 8" /><path d="M15 24 L27 34 L34 40" />
      </g>
      <circle cx="15" cy="24" r="3.6" fill="#38BDF8" /><circle cx="34" cy="8" r="3.2" fill="#38BDF8" /><circle cx="34" cy="40" r="3.2" fill="#2563EB" />
    </svg>
  );
}

const tick = (color: string, border: string): React.CSSProperties => ({
  position: "absolute", display: "flex", fontFamily: "Space Mono", fontSize: 15, letterSpacing: "0.16em", color,
  background: "rgba(255,255,255,.9)", border: `2px solid ${border}`, borderRadius: 8, padding: "5px 10px",
});

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const r = decodeFortune((await params).code);
  if (!r) return new Response("Invalid fortune code", { status: 400, headers: { "Cache-Control": "no-store" } });

  const jp = "今日の運勢占い" + r.rank + r.uma + r.item + r.scenario + "育成ウマ娘ラッキーアイテムおすすめシナリオ" + HASHTAG;
  const mono = "DAILY FORTUNE TRAINING PICK LAB. SPECIMEN READING OBSERVED · 0123456789.";
  /* Zen Kaku Gothic New lacks a few symbols that appear in the lists (e.g. the full-width
     tilde "～" in some scenario names). Noto Sans JP is loaded as a fallback for the same text,
     so any glyph Zen Kaku doesn't have is drawn from it instead of as an empty box. */
  const [jp700, jp900, fb700, fb900, grotesk, spaceMono] = await Promise.all([
    font("Zen Kaku Gothic New", 700, jp),
    font("Zen Kaku Gothic New", 900, jp),
    font("Noto Sans JP", 700, jp),
    font("Noto Sans JP", 900, jp),
    font("Space Grotesk", 700, "KAWAKAMI Lab." + r.umaEn),
    font("Space Mono", 400, mono),
  ]);

  const row = (dt: string, dd: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 0", borderTop: `2px dashed ${C.line}` }}>
      <div style={{ display: "flex", width: 196, fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: 16, letterSpacing: "0.1em", color: C.muted }}>{dt}</div>
      <div style={{ display: "flex", flex: 1, fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: valueSize(dd), lineHeight: 1.25, color: C.ink }}>{dd}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630, display: "flex", gap: 34, padding: "40px 44px 40px 40px", color: C.ink,
        backgroundColor: "#f6f2ff",
        backgroundImage: "radial-gradient(circle at 88% 6%, rgba(196,181,253,.55), rgba(196,181,253,0) 42%), radial-gradient(circle at 6% 60%, rgba(103,232,249,.28), rgba(103,232,249,0) 40%), linear-gradient(rgba(124,58,237,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,.07) 1px, transparent 1px)",
        backgroundSize: "1200px 630px, 1200px 630px, 28px 28px, 28px 28px",
      }}>
        {/* left — brand, the crystal ball on its stage, hashtag */}
        <div style={{ width: 400, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 28, color: C.ink }}>
              <Mark />KAWAKAMI Lab.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Space Mono", fontSize: 16, letterSpacing: "0.2em", color: C.violet }}>
              <div style={{ width: 26, height: 2, background: C.violet, opacity: .6 }} />
              LAB. FORTUNE ·<span style={{ fontFamily: "Zen Kaku Gothic New", fontWeight: 700, letterSpacing: "0.1em", marginLeft: 8 }}>占い</span>
            </div>
          </div>

          <div style={{ position: "relative", width: 400, height: 330, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", left: 50, top: 15, width: 300, height: 300, borderRadius: 300, backgroundImage: "radial-gradient(circle, rgba(167,139,250,.38), rgba(167,139,250,0) 65%)" }} />
            <div style={{ position: "absolute", left: 60, top: 25, width: 280, height: 280, borderRadius: 280, border: "2px dashed rgba(124,58,237,.3)" }} />
            <div style={{ position: "absolute", left: 30, top: -5, width: 340, height: 340, borderRadius: 340, border: "2px solid rgba(124,58,237,.1)" }} />
            <div style={{ display: "flex", marginTop: 14 }}><Ball /></div>
            <div style={{ ...tick(C.violet, C.line), left: 0, top: 26 }}>SPECIMEN 07</div>
            <div style={{ ...tick(C.teal, "#cffafe"), right: 0, bottom: -14 }}>READING · {r.date}</div>
          </div>

          <div style={{ display: "flex", fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: 26, color: C.violet }}>{HASHTAG}</div>
        </div>

        {/* right — the result as an observed specimen label */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", borderRadius: 28, overflow: "hidden",
          background: "rgba(255,255,255,.95)", border: `2px solid ${C.line}`, boxShadow: "0 30px 60px -36px rgba(76,29,149,.45)",
        }}>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "22px 34px 14px", backgroundImage: "linear-gradient(120deg, #f5f0ff, #ecfeff)", borderBottom: "2px dashed #d9ccff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Space Mono", fontSize: 16, letterSpacing: "0.16em", color: C.violet }}>
              <span style={{ display: "flex" }}>DAILY FORTUNE ·<span style={{ fontFamily: "Zen Kaku Gothic New", fontWeight: 700, letterSpacing: "0.08em", marginLeft: 8 }}>今日の運勢</span></span>
              <span style={{ color: C.muted }}>{r.date}</span>
            </div>
            <div style={{
              display: "flex", marginTop: 8, fontFamily: "Zen Kaku Gothic New", fontWeight: 900, fontSize: rankSize(r.rank), lineHeight: 1, letterSpacing: "0.04em",
              backgroundImage: "linear-gradient(120deg, #7c3aed, #4f46e5 50%, #0891b2)", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap",
            }}>{r.rank}</div>
            <div style={{
              position: "absolute", right: 30, bottom: 22, display: "flex", fontFamily: "Space Mono", fontSize: 15, letterSpacing: "0.16em", color: C.violet,
              background: "#fff", border: "2px solid #c4b5fd", borderRadius: 8, padding: "6px 11px", transform: "rotate(-6deg)",
            }}>OBSERVED</div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 34px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", fontFamily: "Space Mono", fontSize: 15, letterSpacing: "0.14em", color: C.muted }}>
              <span style={{ fontFamily: "Zen Kaku Gothic New", fontWeight: 700, letterSpacing: "0.08em", marginRight: 8 }}>育成ウマ娘</span>· TRAINING PICK
            </div>
            {r.umaEn && (
              <div style={{ display: "flex", marginTop: 8, fontFamily: "Space Grotesk", fontWeight: 700, fontSize: enSize(r.umaEn), lineHeight: 1.15, letterSpacing: "0.02em", whiteSpace: "nowrap", color: C.violet }}>{r.umaEn}</div>
            )}
            <div style={{ display: "flex", marginTop: r.umaEn ? 2 : 6, fontFamily: "Zen Kaku Gothic New", fontWeight: 900, fontSize: umaSize(r.uma), lineHeight: 1.15, letterSpacing: "0.02em", whiteSpace: "nowrap", color: C.ink }}>{r.uma}</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
              {row("ラッキーアイテム", r.item)}
              {row("おすすめシナリオ", r.scenario)}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zen Kaku Gothic New", data: jp700, weight: 700, style: "normal" },
        { name: "Zen Kaku Gothic New", data: jp900, weight: 900, style: "normal" },
        { name: "Noto Sans JP", data: fb700, weight: 700, style: "normal" },
        { name: "Noto Sans JP", data: fb900, weight: 900, style: "normal" },
        { name: "Space Grotesk", data: grotesk, weight: 700, style: "normal" },
        { name: "Space Mono", data: spaceMono, weight: 400, style: "normal" },
      ],
      /* a code always renders the same card */
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
