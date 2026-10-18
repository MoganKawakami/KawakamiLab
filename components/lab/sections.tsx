/* sections.tsx — phone-optimized sections */
import { useRef, useState } from "react";
import { LINKS, PAST_EVENTS, PROFILE_FACETS, PUBLICATIONS } from "@/lib/data";
import { ChevronLeft, ChevronRight, Logo, Placeholder, ShapePlus, ShapeRing, swipeHandlers } from "./art";

type Jump = (id: string) => void;

/* ---------------- NAV + slide-down menu ---------------- */
export function MNav({ open, setOpen, onJump }: { open: boolean; setOpen: (fn: (o: boolean) => boolean) => void; onJump: Jump }) {
  const close = () => setOpen(() => false);
  return (
    <>
      <header className="mnav" id="mnav">
        <div className="mnav__brand">
          <Logo size={30} />
          <b>KAWAKAMI Lab.</b>
        </div>
        <button className="mnav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          )}
        </button>
      </header>

      <div className={"mmenu" + (open ? " open" : "")}>
        <div className="mmenu__scrim" aria-hidden="true">
          <div className="blob b1" /><div className="blob b2" />
        </div>
        <nav className="mmenu__links">
          {LINKS.map((l, i) => (
            <a key={l.id} href={"#" + l.id} onClick={(e) => { e.preventDefault(); onJump(l.id); close(); }}>
              {l.en}<span className="jp">{l.jp}</span>
              <span className="idx">0{i + 1}</span>
            </a>
          ))}
        </nav>
        <button className="btn btn--primary mmenu__cta" onClick={() => { onJump("publications"); close(); }}>
          Browse Works <span className="arrow">→</span>
        </button>
        <div className="mmenu__foot">
          <span>想像が、視覚芸術になる場所。</span>
          <span>© 2026</span>
        </div>
      </div>
    </>
  );
}

/* ---------------- HERO ---------------- */
export function MHero({ onJump }: { onJump: Jump }) {
  return (
    <section className="mhero" id="top">
      <div className="mhero__bg">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      </div>
      <div className="mhero__grid" />
      <div className="mshape bob" style={{ top: "13%", right: "6%" }}><ShapeRing size={66} /></div>
      <div className="mshape spin" style={{ bottom: "20%", left: "7%" }}><ShapePlus size={40} /></div>

      <div className="m-container mhero__inner">
        <div className="eyebrow reveal in">Anime Illustration Studio · 創作研究室</div>
        <h1 className="reveal in d1">KAWAKAMI<br />Lab<span className="dot">.</span></h1>
        <p className="mhero__jp reveal in d2">推しを信じて描く。</p>
        <p className="mhero__en reveal in d3">Drawing what we love, with conviction — a circle devoted to illustrating our favorite characters.</p>

        <div className="mhero__card reveal in d3">
          <div className="cap"><span className="t">FIG.01 — FEATURED</span><span className="t r">2024</span></div>
          <div className="art"><Placeholder ratio={1.25} label="CHROMA" sub="彩光" from="#5fc8ff" to="#2563EB" big /></div>
          <div className="cap"><span className="t" style={{ color: "var(--c-ink)", fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: 0 }}>Original Illustration</span><span className="t">A4 · 64P</span></div>
        </div>

        <div className="mhero__actions reveal in d4">
          <button className="btn btn--primary" onClick={() => onJump("publications")}>Explore Publications <span className="arrow">→</span></button>
          <button className="btn btn--ghost" onClick={() => onJump("about")}>About the Lab</button>
        </div>

        <div className="mscroll-cue reveal in d4"><span>Scroll</span><div className="track" /></div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */
const MARQUEE_WORDS = ["ANIME ILLUSTRATION", "ORIGINAL ARTWORK", "FAN ART", "CONCEPT DESIGN", "VISUAL RESEARCH", "DOUJIN PUBLISHING"];

export function MMarquee() {
  const set = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="mmarquee" aria-hidden="true">
      <div className="mmarquee__track">{set.map((w, i) => <span key={i}>{w}</span>)}</div>
    </div>
  );
}

/* ---------------- PROFILE deck ---------------- */
function MProfile() {
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
  const { onDown, onUp } = swipeHandlers(drag, 45, (d) => go(i + d, d));

  return (
    <div className="mprof reveal d1">
      <aside className="mprof__card">
        <span className="idtag l">ID · LAB-0001</span>
        <span className="idtag r">サークル主 / FOUNDER</span>
        <div className="mprof__avatar-wrap">
          <span className="ring" />
          <div className="mprof__avatar"><span className="lbl">ICON</span><span className="sub">drop your icon</span></div>
        </div>
        <div className="mprof__name">川上モガん</div>
        <div className="mprof__handle">@kawakami_lab</div>
        <div className="mprof__role">サークル主</div>
        <div className="mprof__socials">
          <a href="#contact" aria-label="X / Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3l7.5 9.5L3.5 21H6l6-7 5.5 7H21l-7.8-10L20.5 3H18l-5.4 6.4L8 3H3z" fill="currentColor" /></svg></a>
          <a href="#contact" aria-label="pixiv"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21V6.5C9 5 10 4 12.5 4S16 5.4 16 7.4 14.6 11 12.2 11H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          <a href="#contact" aria-label="Mail"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></a>
        </div>
      </aside>

      <div className="mprof__deck" onTouchStart={onDown} onTouchEnd={onUp} onPointerDown={onDown} onPointerUp={onUp}>
        <div className="mprof__deck-head">
          <span className="lab-tag2">Swipe Profile</span>
          <span className="ix">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <div className="mprof__deck-body">
          {PROFILE_FACETS.map((ff, idx) => (
            <div className={"mprof__facet" + (idx === i ? " is-active" : "") + (idx === i && back ? " toleft" : "")} key={ff.key} aria-hidden={idx !== i}>
              <h4>{ff.label}<span className="jp">{ff.jp}</span></h4>
              {ff.rows && (
                <dl className="pf-rows">
                  {ff.rows.map((r) => <div className="pf-row" key={r.dt}><dt>{r.dt}</dt><dd className={r.jp ? "jp" : ""}>{r.dd}</dd></div>)}
                </dl>
              )}
              {ff.chips && <div className="pf-chips">{ff.chips.map((c) => <span className="pf-chip" key={c}><i />{c}</span>)}</div>}
              {ff.favs && (
                <div className="pf-favs">
                  {ff.favs.map((v) => (
                    <div className="pf-fav" key={v.code}>
                      <div className="pf-fav-art"><Placeholder ratio={1} label={v.code} from={v.from} to={v.to} /></div>
                      <div className="cap">{v.name}<small>{v.code}</small></div>
                    </div>
                  ))}
                </div>
              )}
              {ff.quote && <div className="pf-quote">{ff.quote}</div>}
            </div>
          ))}
        </div>
        <div className="mprof__deck-foot">
          <div className="mprof__dots">
            {PROFILE_FACETS.map((ff, idx) => <button key={ff.key} className={idx === i ? "on" : ""} aria-label={ff.label} onClick={() => go(idx)} />)}
          </div>
          <div className="mprof__deck-nav">
            <button className="rbtn" aria-label="Previous" onClick={() => go(i - 1, -1)}><ChevronLeft /></button>
            <button className="rbtn" aria-label="Next" onClick={() => go(i + 1, 1)}><ChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ABOUT ---------------- */
const STATS = [
  { n: "6+", l: "Publications", jp: "刊行物" },
  { n: "2019", l: "Established", jp: "設立" },
  { n: "12", l: "Events", jp: "頒布実績" },
  { n: "∞", l: "In progress", jp: "進行中" },
];

export function MAbout() {
  return (
    <section className="m-section mabout" id="about">
      <div className="m-container">
        <div className="reveal">
          <div className="eyebrow">About KAWAKAMI Lab.</div>
          <h2 className="grad-text">A laboratory<br />for visual art.</h2>
        </div>
        <div className="mabout__lead reveal d1">
          <p><span className="jp">KAWAKAMI Lab.（カワカミ・ラボ）は、推しを描くためのサークルです。</span></p>
          <p>We are a doujin circle dedicated to <strong>drawing the characters we love</strong> — through anime illustration, original artwork, and fan art.</p>
        </div>

        <div className="mprofhead reveal" id="profile">
          <div className="eyebrow">Profile · サークル主紹介</div>
          <h3 className="grad-text">Meet the founder</h3>
        </div>
        <MProfile />

        <div className="mstats">
          {STATS.map((s, i) => (
            <div className={"mstat reveal d" + (i % 4 + 1)} key={s.l}>
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
export function MPublications({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section className="m-section mpubs" id="publications">
      <div className="m-container">
        <div className="mpubs__head reveal">
          <div className="eyebrow">Publications · 刊行物</div>
          <h2 className="grad-text">Selected Works</h2>
          <p className="sub">作品をタップすると、フルスクリーンの展示ビューが開きます。</p>
        </div>
        <div className="mpubs__list">
          {PUBLICATIONS.map((p, i) => (
            <article className={"mpub reveal d" + (i % 3 + 1)} key={p.id} onClick={() => onOpen(i)}>
              <div className="mpub__cover">
                <Placeholder ratio={1.2} label={p.title} sub={p.jp} from={p.from} to={p.to} />
                <span className="yr">{p.year}</span>
                <span className="open"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </div>
              <div className="mpub__meta">
                <h3>{p.title}</h3>
                <div className="jp">{p.jp}</div>
                <div className="row"><span className="type">{p.type}</span><span className="price">{p.price}</span></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EVENTS ---------------- */
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function daysUntil(iso: string) {
  const now = new Date();
  const d = new Date(iso + "T00:00:00");
  return Math.ceil((d.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
}

export function MEvents() {
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
  const { onDown, onUp } = swipeHandlers(drag, 45, (d) => go(active + d, d));

  const ev = PAST_EVENTS[active];
  const d = new Date(ev.iso + "T00:00:00");
  const dd = daysUntil(ev.iso);
  const progress = total > 1 ? (active / (total - 1)) * 100 : 0;

  return (
    <section className="m-section mabout" id="events" style={{ background: "var(--c-bg)" }}>
      <div className="m-container">
        <div className="mpubs__head reveal">
          <div className="eyebrow">Events · 参加したイベント</div>
          <h2 className="grad-text">Where we&apos;ve been</h2>
          <p className="sub">これまでに参加したイベントの記録です。スワイプ・矢印・ドットで切り替えられます。</p>
        </div>

        {/* reveal sits on a static wrapper so changing the direction class never drops its "in" state */}
        <div className="mev reveal d1">
          <div className={dir > 0 ? "mev-next" : "mev-prev"}>
            <div className="mev__stage" onTouchStart={onDown} onTouchEnd={onUp} onPointerDown={onDown} onPointerUp={onUp}>
              <div className="mev__side" key={"s" + ev.id}>
                <div className="mev__date">
                  <span className="day">{String(d.getDate()).padStart(2, "0")}</span>
                  <span className="my"><span className="month">{MONTHS[d.getMonth()]}</span><span className="yw">{d.getFullYear()} · {WEEK[d.getDay()]}</span></span>
                </div>
                <span className="mev__count" suppressHydrationWarning><b>{Math.max(0, -dd)}</b> 日前に参加</span>
              </div>
              <div className="mev__main" key={"m" + ev.id}>
                <span className="mev__badge"><span className="pip" />{active === 0 ? "Latest · 直近の参加" : `Archive ${active + 1} / ${total}`}</span>
                <h3 className="mev__name">{ev.name}</h3>
                <dl className="mev__rows">
                  <div className="mev__row"><dt>Venue · 会場</dt><dd><span className="jp">{ev.venueJp}</span></dd></div>
                  <div className="mev__row"><dt>Booth · 配置</dt><dd><span className="booth">{ev.booth}</span></dd></div>
                  <div className="mev__row"><dt>Notes · 頒布物</dt><dd><span className="jp">{ev.note}</span></dd></div>
                </dl>
              </div>
            </div>

            <div className="mev__rail">
              <button className="rbtn" aria-label="Previous event" disabled={active === 0} onClick={() => go(active - 1, -1)}><ChevronLeft /></button>
              <div className="mev__track">
                <div className="mev__line"><i style={{ width: progress + "%" }} /></div>
                <div className="mev__node-row">
                  {PAST_EVENTS.map((e, i) => (
                    <button key={e.id} className={"mev__node" + (i === active ? " active" : "") + (i < active ? " past" : "")} onClick={() => go(i)} aria-label={e.name}>
                      <span className="mev__dot" />
                    </button>
                  ))}
                </div>
              </div>
              <button className="rbtn" aria-label="Next event" disabled={active === total - 1} onClick={() => go(active + 1, 1)}><ChevronRight /></button>
            </div>
            <div className="mev__hint">← Swipe · Tap a node →</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function MFooter({ onJump }: { onJump: Jump }) {
  const link = (id: string, label: string) => (
    <a href={"#" + id} onClick={(e) => { e.preventDefault(); onJump(id); }}>{label}</a>
  );
  return (
    <footer className="mfooter" id="contact">
      <div className="mfooter__glow" />
      <div className="m-container mfooter__inner">
        <h2 className="mfooter__cta reveal">Let&apos;s make imagination visible together.
          <span className="jp">コラボレーション・寄稿・お問い合わせはお気軽に。</span>
        </h2>
        <button className="btn btn--primary reveal d1" onClick={() => onJump("top")} style={{ background: "var(--grad-sky)" }}>
          Get in touch <span className="arrow">→</span>
        </button>
        <div className="mfooter__grid">
          <div className="mfooter__col">
            <div className="brandline"><Logo size={28} mono /><b>KAWAKAMI Lab.</b></div>
            <p>Where imagination becomes visual art. A creative laboratory publishing anime illustration &amp; original artwork.</p>
          </div>
          <div className="mfooter__col">
            <h4>Navigate</h4>
            {link("about", "About / 概要")}
            {link("profile", "Profile / 主宰紹介")}
            {link("publications", "Publications / 刊行物")}
            {link("events", "Events / 開催情報")}
          </div>
          <div className="mfooter__col">
            <h4>Connect</h4>
            <a href="#contact">X / Twitter</a>
            <a href="#contact">pixiv</a>
          </div>
        </div>
        <div className="mfooter__bottom">
          <span>© 2026 KAWAKAMI Lab. — All artwork reserved.</span>
          <span>想像が、視覚芸術になる場所。</span>
        </div>
      </div>
    </footer>
  );
}
