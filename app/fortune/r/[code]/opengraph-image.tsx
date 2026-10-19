/* Share-card image for a fortune result (design: "Fortune Share Card.html").
   next/og only supports flex layout, so the card's decorative rings are absolute divs. */
import { ImageResponse } from "next/og";
import { HASHTAG, decodeFortune, drawFortune } from "@/lib/fortune-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lab. Fortune — 今日の運勢";

const C = { ink: "#0b1b2e", muted: "#5d7790", line: "#dceaf5", bg: "#F8FCFF", deep: "#2563EB" };

/* Fetch just the glyphs we draw; Google serves TTF to non-browser clients */
async function font(family: string, weight: number, text: string) {
  const css = await (await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`,
  )).text();
  const src = /src: url\((.+?)\) format\('(opentype|truetype)'\)/.exec(css);
  if (!src) throw new Error(`font not found: ${family} ${weight}`);
  return (await fetch(src[1])).arrayBuffer();
}

const rankSize = (rank: string) => (rank.length <= 1 ? 240 : rank.length === 2 ? 196 : 120);
/* Design sizes (84 / 60 / 52px), capped so the name always fits the ~600px column on one line */
const umaSize = (name: string) =>
  Math.min(name.length <= 8 ? 84 : name.length <= 10 ? 60 : 52, Math.floor(600 / name.length));
/* Item / scenario values get ~378px; shrink long ones (Latin counts as about half a glyph)
   so they fit in at most two lines */
const valueSize = (text: string) => {
  const units = [...text].reduce((n, c) => n + (c.charCodeAt(0) < 0x2000 ? 0.55 : 1), 0);
  return Math.max(22, Math.min(36, Math.floor((378 * 1.8) / units)));
};

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const r = decodeFortune((await params).code) ?? drawFortune();

  const jp = "今日の運勢" + r.rank + r.uma + r.item + r.scenario + "育成ウマ娘ラッキーアイテムおすすめシナリオ" + HASHTAG;
  const mono = "DAILY FORTUNE TRAINING PICK LAB. · 0123456789.";
  const [jp700, jp900, grotesk, spaceMono] = await Promise.all([
    font("Zen Kaku Gothic New", 700, jp),
    font("Zen Kaku Gothic New", 900, jp),
    font("Space Grotesk", 700, "KAWAKAMI Lab."),
    font("Space Mono", 400, mono),
  ]);

  const row = (dt: string, dd: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 0", borderTop: `2px dashed ${C.line}` }}>
      <div style={{ width: 200, fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: 17, letterSpacing: "0.12em", color: C.muted }}>{dt}</div>
      <div style={{ flex: 1, fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: valueSize(dd), lineHeight: 1.25, color: C.ink }}>{dd}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#fff", color: C.ink }}>
        {/* left — rank on the brand gradient */}
        <div style={{
          position: "relative", width: 470, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "52px 52px 48px", color: "#fff", overflow: "hidden",
          backgroundImage: "linear-gradient(120deg, #38BDF8 0%, #22D3EE 48%, #2563EB 100%)",
        }}>
          <div style={{ position: "absolute", right: -120, bottom: -120, width: 360, height: 360, borderRadius: 360, border: "2px solid rgba(255,255,255,.35)" }} />
          <div style={{ position: "absolute", right: -40, bottom: -40, width: 200, height: 200, borderRadius: 200, border: "2px dashed rgba(255,255,255,.4)" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 20 }}>
            <span style={{ fontFamily: "Space Mono", letterSpacing: "0.2em" }}>DAILY FORTUNE</span>
            <span style={{ fontFamily: "Zen Kaku Gothic New", fontWeight: 700, letterSpacing: "0.12em" }}>今日の運勢</span>
            <span style={{ fontFamily: "Space Mono", letterSpacing: "0.14em" }}>{r.date}</span>
          </div>

          <div style={{ display: "flex", fontFamily: "Zen Kaku Gothic New", fontWeight: 900, fontSize: rankSize(r.rank), lineHeight: 1, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{r.rank}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="34" height="34" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="g" x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38BDF8" /><stop offset=".5" stopColor="#22D3EE" /><stop offset="1" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <g stroke="url(#g)" strokeWidth="3.4" strokeLinecap="round" fill="none">
                  <path d="M15 7V41" /><path d="M15 24 L34 8" /><path d="M15 24 L27 34 L34 40" />
                </g>
                <circle cx="15" cy="24" r="3.6" fill="#38BDF8" />
                <circle cx="34" cy="8" r="3.2" fill="#38BDF8" />
                <circle cx="34" cy="40" r="3.2" fill="#2563EB" />
              </svg>
            </div>
            KAWAKAMI Lab.
          </div>
        </div>

        {/* right — training pick, item, scenario */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "56px 64px 48px", background: C.bg }}>
          <div style={{ display: "flex", fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: C.muted }}>
            育成ウマ娘 · <span style={{ fontFamily: "Space Mono", fontWeight: 400, marginLeft: 8 }}>TRAINING PICK</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: "Zen Kaku Gothic New", fontWeight: 900, fontSize: umaSize(r.uma), lineHeight: 1.1, letterSpacing: "0.01em", whiteSpace: "nowrap" }}>{r.uma}</div>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
            {row("ラッキーアイテム", r.item)}
            {row("おすすめシナリオ", r.scenario)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22, borderTop: `2px solid ${C.line}` }}>
            <span style={{ fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: 26, color: C.deep }}>{HASHTAG}</span>
            <span style={{ fontFamily: "Space Mono", fontSize: 17, letterSpacing: "0.1em", color: C.muted }}>LAB. FORTUNE</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zen Kaku Gothic New", data: jp700, weight: 700, style: "normal" },
        { name: "Zen Kaku Gothic New", data: jp900, weight: 900, style: "normal" },
        { name: "Space Grotesk", data: grotesk, weight: 700, style: "normal" },
        { name: "Space Mono", data: spaceMono, weight: 400, style: "normal" },
      ],
      /* a code always renders the same card */
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
