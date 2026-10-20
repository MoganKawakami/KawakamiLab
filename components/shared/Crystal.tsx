/* Crystal.tsx — the layered glass crystal ball and the home-page Lab. Fortune entry (design D).
   The ball is built from layers (deep glass body, swirling mist, highlights, refraction rim,
   stand, cast light) rather than an icon; styles live in app/styles/crystal.css. */

/* orbits: how many tilted rings with a travelling light (0–2) */
export function CrystalBall({ orbits = 1 }: { orbits?: 0 | 1 | 2 }) {
  return (
    <span className="cb" aria-hidden="true">
      <span className="cb__glass">
        <span className="cb__mist" /><span className="cb__mist cb__mist--2" /><span className="cb__core" />
        <span className="cb__sp cb__sp--a" /><span className="cb__sp cb__sp--b" /><span className="cb__sp cb__sp--c" />
        <span className="cb__hl" /><span className="cb__rim" />
      </span>
      {orbits >= 1 && <span className="cb__orbit" />}
      {orbits >= 2 && <span className="cb__orbit cb__orbit--2" />}
      <span className="cb__stand" />
      <span className="cb__cast" />
    </span>
  );
}

/* Home-page entry to /fortune. A plain link on purpose: the fortune page has its own stylesheet. */
export function FortuneEntry({ className = "" }: { className?: string }) {
  return (
    <a className={"lab-fortune " + className} href="/fortune">
      <span className="lab-fortune__ball"><CrystalBall /></span>
      <span className="lab-fortune__txt">
        <span className="lab-fortune__k">SPECIMEN · LAB. FORTUNE</span>
        <b>今日の運勢を占う</b>
        <small>運勢 / 育成ウマ娘を占えます</small>
        <span className="lab-fortune__meta">READING ENABLED · 01</span>
      </span>
      <span className="lab-fortune__go" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </a>
  );
}
