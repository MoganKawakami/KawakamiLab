"use client";

/* Fortune.tsx — Lab. Fortune page (phone + PC) and the shared-result page */
import { useEffect, useState } from "react";
import { dotted, drawFortune, intentUrl, sharePath, shareText, todayYmd, type FortuneResult } from "@/lib/fortune-data";
import { Logo } from "../lab/art";

const Arrow = () => (
  <svg className="arr" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Shell({ orbLabel, busy, children }: { orbLabel: string; busy: boolean; children: React.ReactNode }) {
  return (
    <div className="fpage">
      <div className="fpage__bg"><div className="blob b1" /><div className="blob b2" /><div className="blob b3" /></div>
      <header className="fnav">
        {/* full page load on purpose: the top page and this page use different global stylesheets */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="fnav__back" href="/">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>TOP
        </a>
        <div className="fnav__brand"><Logo size={26} /><b>KAWAKAMI Lab.</b></div>
      </header>

      <main className="fwrap">
        <div className="fleft">
          <div className="fhead">
            <div className="eyebrow">Lab. Fortune · 占い</div>
            <h1 className="grad-text">Today&apos;s<br />Fortune</h1>
            <p>今日の運勢とおすすめの育成ウマ娘を占います。</p>
          </div>
          <div className={"forb" + (busy ? " busy" : "")} aria-hidden="true">
            <span className="r1" /><span className="r2" />
            <span className="core" />
            <span className="glyph" suppressHydrationWarning>{busy ? "Reading…" : orbLabel}</span>
          </div>
        </div>

        <div className="fright">{children}</div>
        <div className="fnote">占うたびに結果が変わります</div>
      </main>
    </div>
  );
}

function ResultCard({ res, share }: { res: FortuneResult; share: boolean }) {
  const onShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = shareText(res, window.location.origin + sharePath(res));
    window.open(intentUrl(text), "_blank", "noopener,noreferrer");
  };
  return (
    <section className="fresult" id="fresult">
      <div className="fresult__top"><div className="k">DAILY FORTUNE · 今日の運勢</div><div className="date">{res.date}</div><div className="rank">{res.rank}</div></div>
      <div className="fresult__body">
        <div className="fuma">
          <div className="nm"><small>育成ウマ娘 · TRAINING PICK</small>{res.uma}</div>
        </div>
        <dl>
          <div className="frow"><dt>Lucky Item</dt><dd>{res.item}</dd></div>
          <div className="frow"><dt>おすすめシナリオ</dt><dd>{res.scenario}</dd></div>
        </dl>
        <div className="fmsg">{res.msg}</div>
        {share && (
          <a className="fshare" href={sharePath(res)} onClick={onShare}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            で共有
          </a>
        )}
      </div>
    </section>
  );
}

/* /fortune */
export function FortuneApp() {
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<FortuneResult | null>(null);
  const [n, setN] = useState(0);
  const [today, setToday] = useState("");

  /* the date comes from the visitor's clock, so set it after mounting */
  useEffect(() => { setToday(dotted(todayYmd())); }, []);

  const run = () => {
    if (busy) return;
    setBusy(true); setRes(null);
    setTimeout(() => { setRes(drawFortune()); setN((x) => x + 1); setBusy(false); }, 1300);
  };

  /* on narrow screens the result lands below the fold — bring it into view */
  useEffect(() => {
    if (!res || window.innerWidth >= 900) return;
    const el = document.getElementById("fresult");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }, [n, res]);

  return (
    <Shell orbLabel={today} busy={busy}>
      <div className="fbtns">
        <button className={"fbtn" + (busy || res ? " on" : "")} disabled={busy} onClick={run}>
          <span className="no">01</span>
          <span className="t"><b>今日の運勢 / 育成ウマ娘を占う</b><small>Daily Fortune · Training Pick</small></span>
          <Arrow />
        </button>
      </div>
      {res && <ResultCard key={n} res={res} share />}
    </Shell>
  );
}

/* /fortune/r/[code] — what people opening a shared link see */
export function SharedFortune({ res }: { res: FortuneResult }) {
  return (
    <Shell orbLabel={res.date} busy={false}>
      <ResultCard res={res} share={false} />
      <a className="fbtn fagain" href="/fortune">
        <span className="no">01</span>
        <span className="t"><b>自分も占う</b><small>Try your own fortune</small></span>
        <Arrow />
      </a>
    </Shell>
  );
}
