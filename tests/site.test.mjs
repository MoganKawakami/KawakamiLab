import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { createLoader } from "./helpers/load-ts.mjs";

const load = createLoader();
const data = load("lib/data");

test("all published artwork, preview pages and event images resolve to public files", () => {
  const paths = [data.ICON];
  const unique = (items, key) => assert.equal(new Set(items.map((item) => item[key])).size, items.length);
  unique(data.PUBLICATIONS, "id");
  unique(data.PAST_EVENTS, "id");
  unique(data.PROFILE_FACETS, "key");
  for (const publication of data.PUBLICATIONS) {
    if (publication.image) paths.push(publication.image.src);
    if (publication.pages) {
      assert.equal(publication.pages.length, publication.previews.length);
      for (const page of publication.pages) paths.push(page.thumb, page.full);
    }
  }
  for (const facet of data.PROFILE_FACETS) for (const fav of facet.favs ?? []) if (fav.img) paths.push(fav.img);
  for (const event of data.PAST_EVENTS) if (event.photo) paths.push(event.photo);
  assert.equal(new Set(paths).size, 32);
  for (const path of paths) assert(existsSync(new URL(`../public${path}`, import.meta.url)), path);
});

test("swipe gestures keep direction, thresholds and one action per completed gesture", () => {
  const { swipeHandlers } = load("lib/swipe");
  const directions = [];
  const drag = { current: { x: 0, a: false } };
  const { onDown, onUp } = swipeHandlers(drag, 45, (direction) => directions.push(direction));
  onUp({ clientX: 20 }); // Ignore releases with no active gesture.
  onDown({ clientX: 100 }); onUp({ clientX: 55 }); // Exactly the threshold is a tap.
  assert.deepEqual(directions, []);
  onDown({ clientX: 100 }); onUp({ clientX: 54 }); onUp({ clientX: 0 });
  onDown({ touches: [{ clientX: 20 }] }); onUp({ touches: [], changedTouches: [{ clientX: 100 }] });
  assert.deepEqual(directions, [1, -1]);
});

test("event counts retain local-calendar-day semantics", () => {
  const { daysUntil } = load("lib/event-date");
  assert.equal(daysUntil("2026-10-20", new Date(2026, 9, 20, 23, 59)), 0);
  assert.equal(daysUntil("2026-10-19", new Date(2026, 9, 20, 12)), -1);
  assert.equal(daysUntil("2026-10-21", new Date(2026, 9, 20)), 1);
});

test("draw and reroll never mutate shared candidates or caller-owned results", () => {
  const candidates = JSON.parse(readFileSync(new URL("../lib/fortune-candidates.json", import.meta.url)));
  const freeze = (value) => {
    if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  };
  const f = createLoader({ mocks: { "./fortune-candidates.json": freeze(candidates) } })("lib/fortune-data");
  const result = freeze(f.decodeFortune("20261020-0-0-0-0-0"));
  const shown = Object.freeze([result.umaIx]);
  const before = JSON.stringify({ result, shown, candidates });
  f.drawFortune(() => 0.5);
  const next = f.rerollUma(result, shown, () => 0);
  assert.notEqual(next.umaIx, result.umaIx);
  assert.equal(JSON.stringify({ result, shown, candidates }), before);
});
