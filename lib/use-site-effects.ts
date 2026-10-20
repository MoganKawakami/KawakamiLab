"use client";

import { useCallback, useEffect, useState } from "react";

// PC and mobile keep their own timing and layout; only the effect lifecycle is shared.
export function useSiteIntro({ delay, threshold, rootMargin }: {
  delay: number; threshold: number; rootMargin: string;
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loaded, threshold, rootMargin]);
  return loaded;
}

export function useScrollProgress(progressId: string, navId: string, scrolledAfter: number) {
  useEffect(() => {
    const bar = document.getElementById(progressId);
    const nav = document.getElementById(navId);
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      if (bar) bar.style.transform = `scaleX(${progress})`;
      if (nav) nav.classList.toggle("scrolled", window.scrollY > scrolledAfter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [progressId, navId, scrolledAfter]);
}

/* Smooth-scroll to a section, leaving room for the fixed nav (the top of the page needs none) */
export function scrollToSection(id: string, navHeight: number) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - (id === "top" ? 0 : navHeight);
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

/* Keeps the page behind an overlay (menu, publication viewer) from scrolling */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    document.body.classList.toggle("locked", locked);
    return () => document.body.classList.remove("locked");
  }, [locked]);
}

/* The publication viewer: which item is open, wrap-around paging, and Esc / ← → while open */
export function useGallery(count: number) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const nav = useCallback((dir: number) =>
    setOpenIndex((i) => (i == null ? i : (i + dir + count) % count)), [count]);

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

  return { openIndex, open: setOpenIndex, close, nav };
}
