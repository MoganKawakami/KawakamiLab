"use client";

/* MApp.tsx — root for the phone-optimized site */
import { useCallback, useState } from "react";
import { scrollToSection, useBodyLock, useGallery, useScrollProgress, useSiteIntro } from "@/lib/use-site-effects";
import { PUBLICATIONS } from "@/lib/data";
import { Logo } from "@/components/shared/art";
import { MExperience } from "./MExperience";
import { MAbout, MEvents, MFooter, MHero, MMarquee, MNav, MPublications } from "./sections";

export default function MApp() {
  const loaded = useSiteIntro({ delay: 1400, threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  useScrollProgress("mprogress", "mnav", 30);
  const [menu, setMenu] = useState(false);
  const { openIndex, open, close, nav } = useGallery(PUBLICATIONS.length);
  useBodyLock(menu || openIndex != null);

  const jump = useCallback((id: string) => scrollToSection(id, 56), []);

  return (
    <>
      <div className={"loader" + (loaded ? " gone" : "")}>
        <div className="loader__inner">
          <div className="draw"><Logo size={56} stroke={2.6} /></div>
          <div className="loader__bar"><span /></div>
          <div className="loader__txt">Initializing Lab.</div>
        </div>
      </div>

      <div className="scroll-progress" id="mprogress" />

      <MNav open={menu} setOpen={setMenu} onJump={jump} />
      <main>
        <MHero onJump={jump} />
        <MMarquee />
        <MAbout />
        <MPublications onOpen={open} />
        <MEvents />
      </main>
      <MFooter onJump={jump} />

      {openIndex != null && (
        <MExperience pub={PUBLICATIONS[openIndex]} index={openIndex} total={PUBLICATIONS.length} onClose={close} onNav={nav} />
      )}
    </>
  );
}
