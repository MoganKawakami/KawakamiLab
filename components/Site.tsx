"use client";

/* Site.tsx — shows the PC design on wide screens and the phone design on narrow ones */
import { useEffect, useState } from "react";
import MApp from "./lab/MApp";
import PcApp from "./pc/PcApp";

const PHONE_QUERY = "(max-width: 760px)";

export default function Site() {
  /* The server can't know the screen width, so the first render has both
     designs (CSS hides the wrong one); after mounting only the matching one stays. */
  const [mode, setMode] = useState<"both" | "pc" | "mobile">("both");

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const update = () => setMode(mq.matches ? "mobile" : "pc");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      {mode !== "mobile" && <div className="only-pc"><PcApp /></div>}
      {mode !== "pc" && <div className="only-mobile"><MApp /></div>}
    </>
  );
}
