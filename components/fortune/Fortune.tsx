"use client";

/* Fortune.tsx — Lab. Fortune page (phone + PC) and the shared-result page.
   Design: "Lavender Lab" — an all-light lavender laboratory with the crystal ball (design D)
   on a lit stage; styles in app/fortune/fortune.css and app/styles/crystal.css. */
import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_REROLLS, dotted, drawFortune, intentUrl, rerollUma, sharePath, shareText, todayYmd, type FortuneResult } from "@/lib/fortune-data";
import { FORTUNE_STORAGE_KEY, loadToday, msUntilMidnight, saveToday, type DayRecord } from "@/lib/fortune-store";
import { Logo } from "@/components/shared/art";
import { CrystalBall } from "@/components/shared/Crystal";

const Arrow = () => (
  <svg className="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const XMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);

/* compact: on phones the stage shrinks once a result is showing, so the result sits higher */
function Shell({ date, busy, compact, children }: { date: string; busy: boolean; compact: boolean; children: React.ReactNode }) {
  return (
    <div className="fpage">
      <header className="fnav">
        {/* full page load on purpose: the top page and this page use different global stylesheets */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="fnav__back" href="/">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>TOP
        </a>
        <div className="fnav__brand"><Logo size={26} /><b>KAWAKAMI Lab.</b></div>
      </header>

      <main className="fwrap">
        <div className="fleft">
          <div className="fhead">
            <div className="eyebrow">Lab. Fortune · 占い</div>
            <h1>Today&apos;s<br /><em>Fortune</em></h1>
            <p>今日の運勢とおすすめの育成ウマ娘を占います。</p>
          </div>
          <div className={"fstage" + (compact ? " compact" : "") + (busy ? " is-busy" : "")} aria-hidden="true">
            <span className="fstage__halo" /><span className="fstage__ring fstage__ring--2" /><span className="fstage__ring" />
            <span className="fstage__tick fstage__tick--a">SPECIMEN 07</span>
            <span className="fstage__tick fstage__tick--b" suppressHydrationWarning>{busy ? "READING…" : `READING${date ? " · " + date : ""}`}</span>
            <CrystalBall orbits={2} />
          </div>
        </div>

        <div className="fright">{children}</div>
        <div className="fnote">占いは1日1回。育成ウマ娘は最大{MAX_REROLLS}回再抽選できます。</div>
      </main>
    </div>
  );
}

/* Item / scenario value: each space-separated part (e.g. a title and its 「～…～」 subtitle) is kept
   together when it fits, so lines break at the natural boundary instead of mid-word */
function Phrases({ text }: { text: string }) {
  const parts = text.split(" ");
  return <>{parts.map((p, i) => <span key={i}>{i > 0 && " "}<span className="fph">{p}</span></span>)}</>;
}

function ResultCard({ res, stamp, pickNote, actions }: {
  res: FortuneResult; stamp: string; pickNote?: string; actions?: React.ReactNode;
}) {
  return (
    <section className="fresult" id="fresult" aria-live="polite">
      <div className="fresult__top">
        <div className="fresult__k"><span>DAILY FORTUNE · 今日の運勢</span><span className="date">{res.date}</span></div>
        <div className="rank">{res.rank}</div>
        <span className="fresult__stamp" aria-hidden="true">{stamp}</span>
      </div>
      <div className="fresult__body">
        {/* keyed by the pick so a redraw replays the fade */}
        <div className="fuma" key={res.umaIx}>
          <small><span>育成ウマ娘 · TRAINING PICK</span>{pickNote && <span className="fuma__note">{pickNote}</span>}</small>
          {res.umaEn && <span className="en" lang="en">{res.umaEn}</span>}
          <span className="nm">{res.uma}</span>
        </div>
        <dl className="frows">
          <div className="frow"><dt>Lucky Item</dt><dd><Phrases text={res.item} /></dd></div>
          <div className="frow"><dt>おすすめシナリオ</dt><dd><Phrases text={res.scenario} /></dd></div>
        </dl>
        <div className="fmsg">{res.msg}</div>
        {actions}
      </div>
    </section>
  );
}

/* /fortune — one reading per day; the training pick can be redrawn up to MAX_REROLLS times */
export function FortuneApp() {
  const [ready, setReady] = useState(false);      // today's record has been looked up
  const [busy, setBusy] = useState(false);        // the 1.3s reading
  const [rerolling, setRerolling] = useState(false);
  const [res, setRes] = useState<FortuneResult | null>(null);
  const [rec, setRec] = useState<DayRecord | null>(null);
  const [n, setN] = useState(0);
  const [day, setDay] = useState("");             // YYYYMMDD the page is showing

  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = useCallback(() => {
    if (pending.current !== null) clearTimeout(pending.current);
    pending.current = null;
    setBusy(false); setRerolling(false);
  }, []);
  const restore = useCallback(() => {
    const t = todayYmd();
    const saved = loadToday(t);
    setDay(t); setRec(saved?.rec ?? null); setRes(saved?.res ?? null);
  }, []);

  useEffect(() => {
    restore(); setReady(true);
    return () => { if (pending.current !== null) clearTimeout(pending.current); };
  }, [restore]);

  /* Do not delete storage at midnight: another tab may already have today's reading. */
  useEffect(() => {
    if (!ready) return;
    const check = () => {
      if (todayYmd() !== day) { cancel(); restore(); }
      else if (pending.current === null) {
        const saved = loadToday();
        if (saved) { setRec(saved.rec); setRes(saved.res); }
      }
    };
    const sync = (event: StorageEvent) => {
      if (event.key !== FORTUNE_STORAGE_KEY && event.key !== null) return;
      cancel(); restore();
    };
    const timer = setTimeout(check, msUntilMidnight() + 500);
    const tick = setInterval(check, 30_000);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    window.addEventListener("storage", sync);
    return () => {
      clearTimeout(timer); clearInterval(tick);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
      window.removeEventListener("storage", sync);
    };
  }, [ready, day, cancel, restore]);

  const run = () => {
    if (!ready || pending.current !== null || res) return;
    const started = todayYmd();
    setBusy(true);
    pending.current = setTimeout(() => {
      pending.current = null; setBusy(false);
      if (todayYmd() !== started || loadToday()) { restore(); return; }
      const r = drawFortune();
      const next: DayRecord = { ymd: r.ymd, code: r.code, rerolls: 0, shown: [r.umaIx] };
      saveToday(next);
      setDay(r.ymd); setRec(next); setRes(r); setN((x) => x + 1);
    }, 1300);
  };

  const left = rec ? Math.max(0, MAX_REROLLS - rec.rerolls) : MAX_REROLLS;

  const reroll = () => {
    if (!res || !rec || pending.current !== null || left <= 0) return;
    if (rec.ymd !== todayYmd()) { restore(); return; }
    setRerolling(true);
    pending.current = setTimeout(() => {
      pending.current = null; setRerolling(false);
      if (rec.ymd !== todayYmd()) { restore(); return; }
      // Re-read just before committing so a newer result from another tab wins.
      const current = loadToday() ?? { rec, res };
      if (current.rec.code !== rec.code || current.rec.rerolls !== rec.rerolls) { restore(); return; }
      if (current.rec.rerolls >= MAX_REROLLS) return;
      const r = rerollUma(current.res, current.rec.shown);
      if (!r) return;
      const next: DayRecord = { ...current.rec, code: r.code, rerolls: current.rec.rerolls + 1, shown: [...current.rec.shown, r.umaIx] };
      saveToday(next); setRec(next); setRes(r);
    }, 450);
  };

  /* on narrow screens the result lands below the fold — bring it into view after a reading */
  useEffect(() => {
    if (!n || window.innerWidth >= 900) return;
    const el = document.getElementById("fresult");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }, [n]);

  /* The share button is a plain link to X's post screen; the text includes this result's URL.
     A result only exists after mounting (it comes from this browser), so location is available. */
  const shareHref = res ? intentUrl(shareText(res, window.location.origin + sharePath(res))) : undefined;

  const done = !!res;
  return (
    <Shell date={day ? dotted(day) : ""} busy={busy} compact={done && !busy}>
      <button className={"fcta" + (done ? " is-done" : "")} disabled={!ready || busy || done} onClick={run}>
        <span className="t">
          <b>{busy ? "占っています…" : done ? "本日の占いは完了しました" : "今日の運勢を占う"}</b>
          <small>{done ? "Next reading at 0:00" : "Daily Fortune · Training Pick"}</small>
        </span>
        {!done && <Arrow />}
      </button>
      {res && (
        <ResultCard key={n} res={res} stamp="OBSERVED"
          pickNote={left > 0 ? `再抽選 残り${left}回` : "本日の再抽選は終了"}
          actions={
            <div className="factions">
              <a className="fbtn2 fshare" href={shareHref} target="_blank" rel="noopener noreferrer"><XMark />で共有</a>
              <button className="fbtn2 fagain" onClick={reroll} disabled={rerolling || left <= 0}>
                {rerolling ? "抽選中…" : <><span className="fbtn2__w">育成ウマ娘</span> <span className="fbtn2__w">再抽選</span></>}
              </button>
            </div>
          } />
      )}
    </Shell>
  );
}

/* /fortune/r/[code] — what people opening a shared link see */
export function SharedFortune({ res }: { res: FortuneResult }) {
  return (
    <Shell date={res.date} busy={false} compact>
      <a className="fcta" href="/fortune">
        <span className="t"><b>自分も占う</b><small>Try your own fortune</small></span>
        <Arrow />
      </a>
      <ResultCard res={res} stamp="SHARED" />
    </Shell>
  );
}
