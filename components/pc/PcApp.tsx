"use client";

/* PcApp.tsx — root for the PC layout: parallax, reveals, scroll progress, gallery */
import { useCallback, useEffect, useState } from "react";
import { PUBLICATIONS } from "@/lib/data";
import { Logo } from "../lab/art";
import { Experience } from "./Experience";
import { About, Events, Footer, Hero, Marquee, Nav, Publications } from "./sections";

export default function PcApp() {
  const [loaded, setLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* loader */
  useEffect(() => { const id = setTimeout(() => setLoaded(true), 1500); return () => clearTimeout(id); }, []);

  /* reveals */
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loaded]);

  /* scroll progress + nav state */
  useEffect(() => {
    const bar = document.getElementById("progress");
    const nav = document.getElementById("nav");
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* parallax (scroll + mouse) */
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".only-pc [data-par]")].filter((e) => !e.classList.contains("blob"));
    let mx = 0, my = 0, raf = 0;
    const apply = () => {
      const sy = window.scrollY;
      els.forEach((el) => {
        const d = parseFloat(el.dataset.par ?? "") || 0;
        const tx = mx * d * 46;
        const ty = sy * d + my * d * 46;
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      });
      raf = 0;
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      req();
    };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* smooth jump */
  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : 72);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  /* gallery */
  const close = useCallback(() => setOpenIndex(null), []);
  const nav = useCallback((dir: number) =>
    setOpenIndex((i) => (i == null ? i : (i + dir + PUBLICATIONS.length) % PUBLICATIONS.length)), []);

  useEffect(() => {
    document.body.classList.toggle("locked", openIndex != null);
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") nav(1);
      else if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.classList.remove("locked"); };
  }, [openIndex, close, nav]);

  return (
    <>
      <div className={"loader" + (loaded ? " gone" : "")}>
        <div className="loader__inner">
          <div className="draw"><Logo size={64} stroke={2.6} /></div>
          <div className="loader__bar"><i /></div>
          <div className="loader__txt">Initializing Lab.</div>
        </div>
      </div>

      <div className="scroll-progress" id="progress" />

      <Nav onJump={jump} />
      <main>
        <Hero onJump={jump} />
        <Marquee />
        <About />
        <Publications onOpen={setOpenIndex} />
        <Events />
      </main>
      <Footer onJump={jump} />

      {openIndex != null && (
        <Experience pub={PUBLICATIONS[openIndex]} index={openIndex} total={PUBLICATIONS.length} onClose={close} onNav={nav} />
      )}
    </>
  );
}
