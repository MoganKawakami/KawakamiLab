/* Share-card image for a fortune result — design "A-refined-centered":
   lavender graph paper; on the left the "Lab. Fortune" title with the circle credit, an
   unofficial-fan-project label, the crystal ball and a disclaimer; on the right the result
   card (rank with its English name, training pick, lucky item, scenario and the message).
   next/og lays out with flexbox only, so every block is placed at the design's coordinates;
   the crystal ball is an inline SVG so it can use gradients, clipping and blur. */
import { ImageResponse } from "next/og";
import { HASHTAG, decodeFortune } from "@/lib/fortune-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lab. Fortune — 今日の運勢";

const C = { ink: "#1e1147", muted: "#6b5ca3", violet: "#7c3aed", violetDeep: "#6d28d9", line: "#e2d9ff", rule: "#ddd0f8" };
const FONT = "Noto Sans JP";

/* Fetch just the glyphs we draw; Google serves TTF to non-browser clients */
async function font(weight: number, text: string) {
  const css = await (await fetch(
    `https://fonts.googleapis.com/css2?family=${FONT.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`,
  )).text();
  const src = /src: url\((.+?)\) format\('(opentype|truetype)'\)/.exec(css);
  if (!src) throw new Error(`font not found: ${FONT} ${weight}`);
  return (await fetch(src[1])).arrayBuffer();
}

/* Rough rendered width in em: Latin and digits are about half a CJK glyph */
const ems = (text: string) => [...text].reduce((n, c) => n + (c.charCodeAt(0) < 0x2000 ? 0.55 : 1), 0);
/* Largest size up to `max` that keeps `text` on one line within `width` px */
const fit = (text: string, max: number, width: number) => Math.min(max, Math.floor(width / ems(text)));

/* The message box fits two lines of about 26 full-width characters. Break the message at a
   phrase boundary as late as the first line allows: a sentence end (。！？) first, otherwise
   a comma or a particle (が / を / に …) — never inside a word such as つなが|る. */
const MSG_LINE = 26;
const PARTICLES = "がをにはでともへ";
const NO_START = "。、！？」）ぁぃぅぇぉっゃゅょー"; // never begins a line
const VERB_TAIL = "らりるれろっ";               // after が/に etc. this is still the same word
function messageLines(msg: string): string[] {
  const chars = [...msg];
  if (ems(msg) <= MSG_LINE) return [msg];
  const latest = (good: (prev: string, next: string) => boolean) => {
    for (let i = Math.min(MSG_LINE, chars.length - 1); i > 0; i--) {
      if (!NO_START.includes(chars[i]) && chars.length - i <= MSG_LINE && good(chars[i - 1], chars[i])) return i;
    }
    return -1;
  };
  let at = latest((prev) => "。！？".includes(prev));
  if (at < 0) at = latest((prev, next) => prev === "、" || (PARTICLES.includes(prev) && !PARTICLES.includes(next) && !VERB_TAIL.includes(next)));
  return at < 0 ? [msg] : [chars.slice(0, at).join(""), chars.slice(at).join("")]; // no boundary: wrap where it must
}

/* Text whose baseline sits at y (as in the design), on one line */
function T({ x, y, size: px, weight, color, children }: {
  x: number; y: number; size: number; weight: number; color: string; children: React.ReactNode;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: y - px * 0.88, display: "flex", fontSize: px, fontWeight: weight, lineHeight: 1, color, whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
}

const Rule = ({ y }: { y: number }) => (
  <div style={{ position: "absolute", left: 488, top: y - 1, width: 644, height: 0, borderTop: `2px dashed ${C.rule}` }} />
);

/* Item / scenario row between two rules: label and value centred vertically */
function Row({ top, label, value }: { top: number; label: string; value: string }) {
  return (
    <div style={{ position: "absolute", left: 488, top, width: 644, height: 52, display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: 195, fontSize: 16, fontWeight: 600, color: C.muted }}>{label}</div>
      <div style={{ display: "flex", fontSize: fit(value, 25, 449), fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
}

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

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const r = decodeFortune((await params).code);
  if (!r) return new Response("Invalid fortune code", { status: 400, headers: { "Cache-Control": "no-store" } });

  const text = "Lab. Fortune制作：KAWAKAMI Lab.非公式ファン企画本企画は個人のファン活動です。作品の公式・運営元とは関係ありません。"
    + HASHTAG + "DAILY FORTUNE · 今日の運勢0123456789.育成ウマ娘 · TRAINING PICKラッキーアイテムおすすめシナリオひとこと · MESSAGE"
    + r.rank + r.rankEn + r.uma + r.umaEn + r.item + r.scenario + r.msg;
  const [w400, w500, w600, w700, w800] = await Promise.all([400, 500, 600, 700, 800].map((w) => font(w, text)));

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630, display: "flex", position: "relative", fontFamily: FONT, color: C.ink,
        backgroundColor: "#f5f0ff",
        backgroundImage: "linear-gradient(rgba(124,58,237,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,.07) 1px, transparent 1px), linear-gradient(135deg, #fbf8ff, #eee7ff)",
        backgroundSize: "28px 28px, 28px 28px, 1200px 630px",
      }}>
        {/* left — title, credit, unofficial label, crystal ball, disclaimer, hashtag */}
        <T x={42} y={72} size={42} weight={700} color={C.ink}>Lab. Fortune</T>
        <T x={42} y={105} size={20} weight={500} color={C.muted}>制作：KAWAKAMI Lab.</T>
        <div style={{
          position: "absolute", left: 42, top: 125, width: 196, height: 34, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#ffffff", border: "1px solid #c9b7ee", fontSize: 20, fontWeight: 600, color: C.violetDeep,
        }}>非公式ファン企画</div>
        <div style={{ position: "absolute", left: 66, top: 162, width: 328, height: 328, borderRadius: 328, border: "1px solid #d8c9f9" }} />
        <div style={{ position: "absolute", left: 93, top: 189, width: 274, height: 274, borderRadius: 274, border: "1px dashed #c8b5ef" }} />
        <div style={{ position: "absolute", left: 105, top: 195, display: "flex" }}><Ball /></div>
        <T x={42} y={519} size={16} weight={400} color={C.muted}>本企画は個人のファン活動です。</T>
        <T x={42} y={545} size={16} weight={400} color={C.muted}>作品の公式・運営元とは関係ありません。</T>
        <T x={63} y={581} size={26} weight={600} color={C.violet}>{HASHTAG}</T>

        {/* right — the result card */}
        <div style={{ position: "absolute", left: 458, top: 36, width: 704, height: 558, borderRadius: 24, background: "#ffffff", border: `2px solid ${C.line}` }} />
        <T x={488} y={75} size={16} weight={600} color={C.violet}>DAILY FORTUNE · 今日の運勢</T>
        <T x={995} y={75} size={17} weight={600} color={C.muted}>{r.date}</T>
        <T x={488} y={158} size={84} weight={800} color={C.violet}>{r.rank}</T>
        <T x={491} y={189} size={24} weight={500} color={C.muted}>{r.rankEn}</T>
        <Rule y={204} />
        <T x={488} y={236} size={16} weight={600} color={C.muted}>育成ウマ娘 · TRAINING PICK</T>
        {r.umaEn && <T x={488} y={268} size={fit(r.umaEn, 24, 644)} weight={600} color={C.violet}>{r.umaEn}</T>}
        <T x={488} y={r.umaEn ? 317 : 300} size={fit(r.uma, 43, 644)} weight={800} color={C.ink}>{r.uma}</T>
        <Rule y={343} />
        <Row top={345} label="ラッキーアイテム" value={r.item} />
        <Rule y={397} />
        <Row top={399} label="おすすめシナリオ" value={r.scenario} />
        <div style={{
          position: "absolute", left: 482, top: 450, width: 656, height: 121, borderRadius: 14, display: "flex", flexDirection: "column",
          padding: "15px 18px 0 19px", background: "#f4eeff", border: `2px solid ${C.line}`,
        }}>
          <div style={{ display: "flex", fontSize: 14, fontWeight: 600, lineHeight: 1, color: C.violet }}>ひとこと · MESSAGE</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 9, fontSize: 23, fontWeight: 600, lineHeight: 1.52, color: C.ink }}>
            {messageLines(r.msg).map((line) => <div key={line} style={{ display: "flex" }}>{line}</div>)}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: FONT, data: w400, weight: 400, style: "normal" },
        { name: FONT, data: w500, weight: 500, style: "normal" },
        { name: FONT, data: w600, weight: 600, style: "normal" },
        { name: FONT, data: w700, weight: 700, style: "normal" },
        { name: FONT, data: w800, weight: 800, style: "normal" },
      ],
      /* a code always renders the same card */
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
