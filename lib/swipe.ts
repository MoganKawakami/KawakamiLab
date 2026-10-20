import type { PointerEvent, RefObject, TouchEvent } from "react";

/* Horizontal swipe detector shared by the decks (touch + pointer). */
type SwipeEvent = TouchEvent | PointerEvent;
const clientX = (e: SwipeEvent, end: boolean) =>
  "touches" in e ? (end ? e.changedTouches[0].clientX : e.touches[0].clientX) : e.clientX;

export function swipeHandlers(
  drag: RefObject<{ x: number; a: boolean }>,
  threshold: number,
  onSwipe: (dir: 1 | -1) => void,
) {
  const onDown = (e: SwipeEvent) => { drag.current = { x: clientX(e, false), a: true }; };
  const onUp = (e: SwipeEvent) => {
    if (!drag.current.a) return;
    const dx = clientX(e, true) - drag.current.x;
    drag.current.a = false;
    if (dx < -threshold) onSwipe(1); else if (dx > threshold) onSwipe(-1);
  };
  return { onDown, onUp };
}
