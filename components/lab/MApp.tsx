"use client";

/* MApp.tsx — root for the phone-optimized site */
import { useCallback, useEffect, useState } from "react";
import { PUBLICATIONS } from "@/lib/data";
import { Logo } from "./art";
import { MExperience } from "./MExperience";
import { MAbout, MEvents, MFooter, MHero, MMarquee, MNav, MPublications } from "./sections";

export default function MApp() {
  const [loaded, setLoaded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* loader */
  useEffect(() => { const id = setTimeout(() => setLoaded(true), 1400); return () => clearTimeout(id); }, []);

  /* reveals */
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loaded]);

  /* scroll progress + nav state */
  useEffect(() => {
    const bar = document.getElementById("mprogress");
    const nav = document.getElementById("mnav");
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body when menu or gallery open */
  useEffect(() => {
    document.body.classList.toggle("locked", menu || openIndex != null);
    return () => document.body.classList.remove("locked");
  }, [menu, openIndex]);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : 56);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);
  const nav = useCallback((dir: number) =>
    setOpenIndex((i) => (i == null ? i : (i + dir + PUBLICATIONS.length) % PUBLICATIONS.length)), []);

  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") nav(1);
      else if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, nav]);

  return (
    <>
      <div className={"loader" + (loaded ? " gone" : "")}>
        <div className="loader__inner">
          <div className="draw"><Logo size={56} stroke={2.6} /></div>
          <div className="loader__bar"><i /></div>
          <div className="loader__txt">Initializing Lab.</div>
        </div>
      </div>

      <div className="scroll-progress" id="mprogress" />

      <MNav open={menu} setOpen={setMenu} onJump={jump} />
      <main>
        <MHero onJump={jump} />
        <MMarquee />
        <MAbout />
        <MPublications onOpen={setOpenIndex} />
        <MEvents />
      </main>
      <MFooter onJump={jump} />

      {openIndex != null && (
        <MExperience pub={PUBLICATIONS[openIndex]} index={openIndex} total={PUBLICATIONS.length} onClose={close} onNav={nav} />
      )}
    </>
  );
}
