"use client";

/* PcApp.tsx — root for the PC layout: parallax, reveals, scroll progress, gallery */
import { useCallback, useEffect } from "react";
import { scrollToSection, useBodyLock, useGallery, useScrollProgress, useSiteIntro } from "@/lib/use-site-effects";
import { PUBLICATIONS } from "@/lib/data";
import { Logo } from "@/components/shared/art";
import { Experience } from "./Experience";
import { About, Events, Footer, Hero, Marquee, Nav, Publications } from "./sections";

export default function PcApp() {
  const loaded = useSiteIntro({ delay: 1500, threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  useScrollProgress("progress", "nav", 40);
  const { openIndex, open, close, nav } = useGallery(PUBLICATIONS.length);
  useBodyLock(openIndex != null);

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

  const jump = useCallback((id: string) => scrollToSection(id, 72), []);

  return (
    <>
      <div className={"loader" + (loaded ? " gone" : "")}>
        <div className="loader__inner">
          <div className="draw"><Logo size={64} stroke={2.6} /></div>
          <div className="loader__bar"><span /></div>
          <div className="loader__txt">Initializing Lab.</div>
        </div>
      </div>

      <div className="scroll-progress" id="progress" />

      <Nav onJump={jump} />
      <main>
        <Hero onJump={jump} />
        <Marquee />
        <About />
        <Publications onOpen={open} />
        <Events />
      </main>
      <Footer onJump={jump} />

      {openIndex != null && (
        <Experience pub={PUBLICATIONS[openIndex]} index={openIndex} total={PUBLICATIONS.length} onClose={close} onNav={nav} />
      )}
    </>
  );
}
