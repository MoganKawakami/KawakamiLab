"use client";

import { useEffect, useRef } from "react";

// Only the topmost dialog traps focus (the page reader can cover a publication).
const dialogs: HTMLElement[] = [];
const selector = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export function useDialogFocus() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const items = () => [...root.querySelectorAll<HTMLElement>(selector)].filter((el) => el.getClientRects().length > 0);
    const first = () => (items()[0] ?? root).focus();
    dialogs.push(root);
    first();
    const top = () => dialogs[dialogs.length - 1] === root;
    const focus = (event: FocusEvent) => {
      if (top() && !root.contains(event.target as Node)) first();
    };
    const key = (event: KeyboardEvent) => {
      if (!top() || event.key !== "Tab") return;
      const all = items(), current = document.activeElement;
      if (!all.length) { event.preventDefault(); root.focus(); }
      else if (event.shiftKey && (current === all[0] || !all.includes(current as HTMLElement))) {
        event.preventDefault(); all[all.length - 1].focus();
      } else if (!event.shiftKey && (current === all[all.length - 1] || !all.includes(current as HTMLElement))) {
        event.preventDefault(); all[0].focus();
      }
    };
    document.addEventListener("focusin", focus);
    document.addEventListener("keydown", key, true);
    return () => {
      const wasTop = top();
      const index = dialogs.indexOf(root);
      if (index >= 0) dialogs.splice(index, 1);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("keydown", key, true);
      if (wasTop && previous?.isConnected) previous.focus();
    };
  }, []);
  return ref;
}
