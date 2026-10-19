/* sections.tsx — PC layout: Nav, Hero, Marquee, About, Publications, Events, Footer */
import { useRef, useState } from "react";
import { ICON, PAST_EVENTS, PROFILE_FACETS, PUBLICATIONS, SOCIAL, STATS as COUNTS, type Fav } from "@/lib/data";
import { ChevronLeft, ChevronRight, Cover, FocusImg, Logo, Photo, Placeholder, ShapeNodes, ShapePlus, ShapeRing, swipeHandlers } from "../lab/art";
import { FortuneEntry } from "../lab/Crystal";
import { daysUntil } from "../lab/sections";

type Jump = (id: string) => void;

/* ---------------- NAV ---------------- */
const NAV_LINKS = [
  { en: "About", jp: "概要", id: "about" },
  { en: "Profile", jp: "サークル主", id: "profile" },
  { en: "Publications", jp: "刊行物", id: "publications" },
  { en: "Events", jp: "参加イベント", id: "events" },
];

export function Nav({ onJump }: { onJump: Jump }) {
  return (
    <header className="nav" id="nav">
      <a className="nav__brand" href="#top" onClick={(e) => { e.preventDefault(); onJump("top"); }}>
        <Logo size={34} />
        <span className="wordmark">
          <b>KAWAKAMI Lab.</b>
          <span>Creative Laboratory</span>
        </span>
      </a>
      <nav className="nav__links">
        {NAV_LINKS.map((l) => (
          <a key={l.id} href={"#" + l.id} onClick={(e) => { e.preventDefault(); onJump(l.id); }}>
            {l.en}<span className="jp">{l.jp}</span>
          </a>
        ))}
      </nav>
      <button className="nav__cta" onClick={() => onJump("publications")}>Browse Works</button>
      <button className="nav__burger" aria-label="Menu" onClick={() => onJump("publications")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </header>
  );
}

/* ---------------- HERO ---------------- */
export function Hero({ onJump }: { onJump: Jump }) {
  return (
    <section className="hero" id="top">
      <div className="hero__bg">
        <div className="blob b1" data-par="0.06" />
        <div className="blob b2" data-par="0.04" />
        <div className="blob b3" data-par="0.08" />
      </div>
      <div className="hero__grid" data-par="0.02" />

      {/* floating lab shapes */}
      <div className="shape" style={{ top: "16%", left: "6%" }} data-par="0.14"><div className="bob"><ShapeRing size={92} /></div></div>
      <div className="shape" style={{ top: "62%", left: "11%" }} data-par="0.20"><div className="spin"><ShapePlus size={56} /></div></div>
      <div className="shape" style={{ top: "24%", right: "8%" }} data-par="0.10"><div className="bob"><ShapeNodes size={120} /></div></div>
      <div className="shape" style={{ bottom: "14%", right: "20%" }} data-par="0.24"><div className="spin-rev"><ShapePlus size={40} /></div></div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="eyebrow hero__eyebrow reveal in">Anime Illustration Studio · 創作研究所</div>
          <h1 className="reveal in d1">
            KAWAKAMI<br /><span className="lab">Lab</span><span className="dot">.</span>
          </h1>
          <p className="hero__jp reveal in d2">推しを信じて描く。</p>
          <p className="hero__en reveal in d3">Drawing what we love, with conviction — a circle devoted to illustrating our favorite characters.</p>
          <FortuneEntry className="reveal in d3" />
          <div className="hero__actions reveal in d4">
            <button className="btn btn--primary" onClick={() => onJump("publications")}>
              Explore Publications <span className="arrow">→</span>
            </button>
            <button className="btn btn--ghost" onClick={() => onJump("about")}>About the Lab</button>
          </div>
        </div>

        <div className="hero__visual" data-par="0.05">
          <SpecimenCard />
        </div>
      </div>

      <div className="scroll-cue">
        <span>Scroll</span>
        <div className="track" />
      </div>
    </section>
  );
}

/* floating glass specimen card in hero */
function SpecimenCard() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div className="bob" style={{
        position: "relative", width: 360, maxWidth: "100%",
        borderRadius: 22, padding: 14, background: "rgba(255,255,255,.6)",
        border: "1px solid var(--c-line)", backdropFilter: "blur(14px)",
        boxShadow: "0 50px 100px -50px rgba(11,27,46,.55)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px 12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", color: "var(--c-muted)" }}>FIG.01 — FEATURED</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", color: "var(--c-deep)" }}>2026</span>
        </div>
        <div style={{ borderRadius: 14, overflow: "hidden" }}>
          <Cover p={PUBLICATIONS[2]} ratio={1.3} big />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 6px 4px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>イラスト集&amp;短編集</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-muted)" }}>B5 · 16P</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MARQUEE ---------------- */
const MARQUEE_WORDS = ["ANIME ILLUSTRATION", "ORIGINAL ARTWORK", "FAN ART", "CONCEPT DESIGN", "VISUAL RESEARCH", "DOUJIN PUBLISHING"];

export function Marquee() {
  const set = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">{set.map((w, i) => <span key={i}>{w}</span>)}</div>
    </div>
  );
}

/* ---------------- PROFILE (circle owner, swipeable deck) ---------------- */

/* Favourites: pages of three, switched by swipe/drag; dots indicate the current page. */
function FavSlider({ favs }: { favs: Fav[] }) {
  const per = 3, pages = Math.ceil(favs.length / per);
  const [pg, setPg] = useState(0);
  const sx = useRef<number | null>(null);
  const go = (n: number) => setPg(Math.max(0, Math.min(pages - 1, n)));
  const clientX = (e: React.TouchEvent | React.PointerEvent, end: boolean) =>
    "touches" in e ? (end ? e.changedTouches[0].clientX : e.touches[0].clientX) : e.clientX;
  const down = (e: React.TouchEvent | React.PointerEvent) => { e.stopPropagation(); sx.current = clientX(e, false); };
  const up = (e: React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation();
    if (sx.current == null) return;
    const dx = clientX(e, true) - sx.current;
    sx.current = null;
    if (dx < -40) go(pg + 1); else if (dx > 40) go(pg - 1);
  };
  return (
    <div className="pf-favslider" onPointerDown={down} onPointerUp={up} onTouchStart={down} onTouchEnd={up}>
      <div className="pf-favwin">
        <div className="pf-favtrack" style={{ transform: `translateX(-${pg * 100}%)` }}>
          {favs.map((v) => (
            <div className="pf-fav" key={v.code}>
              <div className="pf-fav-art">{v.img ? <Photo ratio={1} src={v.img} alt={v.name} /> : <Placeholder ratio={1} label={v.code} from={v.from} to={v.to} />}</div>
              <div className="cap">{v.name}<small>{v.code}</small></div>
            </div>
          ))}
        </div>
      </div>
      <div className="pf-favnav pf-favnav--top">
        <span className="pf-favdots" aria-hidden="true">{Array.from({ length: pages }).map((_, i) => <i key={i} className={i === pg ? "on" : ""} />)}</span>
      </div>
    </div>
  );
}
function Profile() {
  const [i, setI] = useState(0);
  const [back, setBack] = useState(false);
  const total = PROFILE_FACETS.length;
  const drag = useRef({ x: 0, a: false });

  const go = (n: number, d?: number) => {
    const ni = (n + total) % total;
    if (ni === i) return;
    setBack(d != null ? d < 0 : ni < i);
    setI(ni);
  };
  const { onDown, onUp } = swipeHandlers(drag, 55, (d) => go(i + d, d));

  return (
    <div className="prof reveal d1">
      {/* left — ID card */}
      <aside className="prof__card">
        <span className="idtag">ID · LAB-0001</span>
        <span className="idtag r">サークル主 / FOUNDER</span>
        <div className="prof__avatar-wrap">
          <span className="ring" />
          <div className="prof__avatar has-img">
            <FocusImg src={ICON} alt="川上モガん" focus={[0.5, 0.5]} />
          </div>
        </div>
        <div className="prof__name">川上モガん</div>
        <div className="prof__handle">@kawakami_lab</div>
        <div className="prof__role">サークル主</div>
        <div className="prof__socials">
          <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3l7.5 9.5L3.5 21H6l6-7 5.5 7H21l-7.8-10L20.5 3H18l-5.4 6.4L8 3H3z" fill="currentColor" /></svg></a>
          <a href={SOCIAL.pixiv} target="_blank" rel="noopener noreferrer" aria-label="pixiv"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21V6.5C9 5 10 4 12.5 4S16 5.4 16 7.4 14.6 11 12.2 11H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          <a href="#contact" aria-label="Mail"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></a>
        </div>
      </aside>

      {/* right — swipe deck */}
      <div className="prof__deck" onPointerDown={onDown} onPointerUp={onUp}>
        <div className="prof__deck-head">
          <span className="lab-tag2">Swipe Profile</span>
          <span className="ix">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>

        <div className="prof__deck-body">
          {PROFILE_FACETS.map((ff, idx) => (
            <div className={"prof__facet" + (idx === i ? " is-active" : "") + (idx === i && back ? " toleft" : "")}
                 key={ff.key} aria-hidden={idx !== i}>
              <h4>{ff.label}<span className="jp">{ff.jp}</span></h4>
              {ff.rows && (
                <dl className="pf-rows">
                  {ff.rows.map((r) => <div className="pf-row" key={r.dt}><dt>{r.dt}</dt><dd className={r.jp ? "jp" : ""}>{r.dd}</dd></div>)}
                </dl>
              )}
              {ff.chips && <div className="pf-chips">{ff.chips.map((c) => <span className="pf-chip" key={c}><i />{c}</span>)}</div>}
              {ff.favs && <FavSlider favs={ff.favs} />}
              {ff.quote && <div className="pf-quote">{ff.quote}</div>}
            </div>
          ))}
        </div>

        <div className="prof__deck-foot">
          <div className="prof__dots">
            {PROFILE_FACETS.map((ff, idx) => <button key={ff.key} className={idx === i ? "on" : ""} aria-label={ff.label} onClick={() => go(idx)} />)}
          </div>
          <span className="prof__foot-hint">← swipe · drag →</span>
          <div className="prof__deck-nav">
            <button className="ev__btn" aria-label="Previous" onClick={() => go(i - 1, -1)}><ChevronLeft /></button>
            <button className="ev__btn" aria-label="Next" onClick={() => go(i + 1, 1)}><ChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ABOUT ---------------- */
const STATS = [
  { n: COUNTS.publications, l: "Publications", jp: "刊行物" },
  { n: COUNTS.established, l: "Established", jp: "設立" },
  { n: COUNTS.events, l: "Events", jp: "頒布実績" },
  { n: "∞", l: "Ideas in progress", jp: "進行中" },
];

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__top">
          <div className="reveal">
            <div className="eyebrow">About KAWAKAMI Lab.</div>
            <h2 className="grad-text">A laboratory<br />for visual art.</h2>
          </div>
          <div className="about__lead reveal d1">
            <p><span className="jp">KAWAKAMI Lab.（カワカミ・ラボ）は、推しを描くためのサークルです。</span></p>
            <p>We are a doujin circle dedicated to <strong>drawing the characters we love</strong> — through anime illustration, original artwork, and fan art. Every release is an experiment in light and color, refined until imagination becomes something you can hold.</p>
          </div>
        </div>

        <div className="about__profhead reveal" id="profile">
          <div className="eyebrow">Profile · サークル主紹介</div>
          <h3 className="profh grad-text">Meet the founder</h3>
        </div>
        <Profile />

        <div className="stats">
          {STATS.map((s, i) => (
            <div className={"stat reveal d" + (i + 1)} key={s.l}>
              <div className="n grad-text">{s.n}</div>
              <div className="l">{s.l}<span className="jp">{s.jp}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PUBLICATIONS ---------------- */
export function Publications({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section className="section pubs" id="publications">
      <div className="container">
        <div className="pubs__head reveal">
          <div>
            <div className="eyebrow">Publications · 刊行物</div>
            <h2 className="grad-text">Selected Works</h2>
          </div>
          <p className="sub">A growing archive of art books, illustration collections, and concept works. Select any volume to enter its full exhibition.</p>
        </div>

        <div className="masonry">
          {PUBLICATIONS.map((p, i) => (
            <article className={"pub reveal d" + ((i % 4) + 1)} key={p.id} role="button" tabIndex={0} aria-label={`${p.title}の詳細を開く`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(i); } }} onClick={() => onOpen(i)}>
              <div className="pub__cover">
                <div className="art"><Cover p={p} ratio={p.ratio} /></div>
                <div className="shine" />
                <span className="yr">{p.year}</span>
                <span className="open">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <div className="pub__meta">
                <h3>{p.title}</h3>
                {p.jp && <div className="jp">{p.jp}</div>}
                <div className="row">
                  <span className="type">{p.type}</span>
                  <span className="price">{p.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EVENTS (past events, same archive as the phone layout) ---------------- */
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function Events() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const total = PAST_EVENTS.length;
  const drag = useRef({ x: 0, a: false });

  const go = (i: number, d?: number) => {
    const ni = Math.max(0, Math.min(total - 1, i));
    if (ni === active) return;
    setDir(d != null ? d : (ni > active ? 1 : -1));
    setActive(ni);
  };
  const { onDown, onUp } = swipeHandlers(drag, 55, (d) => go(active + d, d));

  const ev = PAST_EVENTS[active];
  const d = new Date(ev.iso + "T00:00:00");
  const dd = daysUntil(ev.iso);
  const progress = total > 1 ? (active / (total - 1)) * 100 : 0;

  return (
    <section className="section events" id="events">
      <div className="container">
        <div className="pubs__head reveal">
          <div>
            <div className="eyebrow">Events · 参加したイベント</div>
            <h2 className="grad-text">Where we&apos;ve been</h2>
          </div>
          <p className="sub">これまでに参加したイベントの記録です。レール上のノード・矢印・スワイプで切り替えられます。</p>
        </div>

        {/* reveal sits on a static wrapper so changing the direction class never drops its "in" state */}
        <div className="reveal d1"><div className={"ev " + (dir > 0 ? "ev-next" : "ev-prev")}>
          <div className="ev__stage" onPointerDown={onDown} onPointerUp={onUp}>
            <div className="ev__ghost" aria-hidden="true">{String(active + 1).padStart(2, "0")}</div>

            <div className="ev__mainstack">
              {PAST_EVENTS.map((e, i) => (
                <div className={"ev__main" + (i === active ? " is-active" : "")} key={"m" + e.id} aria-hidden={i !== active}>
                  <span className="ev__badge"><span className="pip" />{i === total - 1 ? "Latest · 直近の参加" : `Archive ${i + 1} / ${total}`}</span>
                  <h3 className="ev__name">{e.name}</h3>
                  {e.jp && <div className="ev__namejp">{e.jp}</div>}
                  <dl className="ev__rows">
                    <div className="ev__row"><dt>Venue · 会場</dt><dd><span className="jp">{e.venueJp}</span></dd></div>
                    {e.booth && <div className="ev__row"><dt>Booth · 配置</dt><dd><span className="booth">{e.booth}</span></dd></div>}
                    {e.note && <div className="ev__row"><dt>Notes · 頒布物</dt><dd><span className="jp">{e.note}</span></dd></div>}
                    {e.role && <div className="ev__row"><dt>Role · 参加形態</dt><dd><span className="jp">{e.role}</span></dd></div>}
                  </dl>
                </div>
              ))}
            </div>

            <div className="ev__side" key={"s" + ev.id}>
              <span className="month">{MONTHS[d.getMonth()]}</span>
              <span className="day">{String(d.getDate()).padStart(2, "0")}</span>
              <span className="yw">{d.getFullYear()} · {WEEK[d.getDay()]}</span>
              <span className="ev__count" suppressHydrationWarning><b>{Math.max(0, -dd)}</b> 日前に参加</span>
            </div>

            <div className="ev__img" key={"i" + ev.id}>
              {ev.photo
                ? <Photo ratio={1} src={ev.photo} alt={ev.name} />
                : <Placeholder ratio={1} label="EVENT IMAGE" sub={ev.name} from="#7dd3fc" to="#2563EB" />}
            </div>
          </div>

          <div className="ev__rail">
            <button className="ev__btn" aria-label="Previous event" disabled={active === 0} onClick={() => go(active - 1, -1)}><ChevronLeft /></button>
            <div className="ev__track">
              <div className="ev__line"><i style={{ width: progress + "%" }} /></div>
              <div className="ev__node-row">
                {PAST_EVENTS.map((e, i) => (
                  <button key={e.id}
                    className={"ev__node" + (i === active ? " active" : "") + (i < active ? " past" : "")}
                    onClick={() => go(i)} aria-label={e.name}>
                    <span className="ev__dot" />
                    <span className="nd-date">{e.iso.slice(5).replace("-", ".")}</span>
                    <span className="nd-name">{e.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="ev__btn" aria-label="Next event" disabled={active === total - 1} onClick={() => go(active + 1, 1)}><ChevronRight /></button>
          </div>
          <div className="ev__hint">← Drag · Swipe · Tap a node →</div>
        </div></div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer({ onJump }: { onJump: Jump }) {
  const link = (id: string, label: string) => (
    <a href={"#" + id} onClick={(e) => { e.preventDefault(); onJump(id); }}>{label}</a>
  );
  return (
    <footer className="footer" id="contact">
      <div className="footer__glow" />
      <div className="container footer__inner">
        <h2 className="footer__cta reveal">
          Let&apos;s make imagination<br />visible together.
          <span className="jp">コラボレーション・寄稿・お問い合わせはお気軽に。</span>
        </h2>
        <a className="btn btn--primary reveal d1" href={SOCIAL.x} target="_blank" rel="noopener noreferrer" style={{ background: "var(--grad-sky)" }}>
          Get in touch <span className="arrow">→</span>
        </a>

        <div className="footer__grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Logo size={30} mono />
              <b style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>KAWAKAMI Lab.</b>
            </div>
            <p style={{ color: "color-mix(in oklab, #fff 65%, transparent)", fontSize: 14, lineHeight: 1.7, maxWidth: "34ch", margin: 0 }}>
              Where imagination becomes visual art. A creative laboratory publishing anime illustration &amp; original artwork.
            </p>
          </div>
          <div>
            <h4>Navigate</h4>
            {link("about", "About / 概要")}
            {link("publications", "Publications / 刊行物")}
            {link("events", "Events / 参加イベント")}
            {link("profile", "Profile / サークル主紹介")}
          </div>
          <div>
            <h4>Connect</h4>
            <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer">X / Twitter</a>
            <a href={SOCIAL.pixiv} target="_blank" rel="noopener noreferrer">pixiv</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 KAWAKAMI Lab. — All artwork reserved.</span>
          <span>推しを描く。可愛く描く。ただそれだけ。</span>
        </div>
      </div>
    </footer>
  );
}
