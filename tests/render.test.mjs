import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createLoader } from "./helpers/load-ts.mjs";

class FixedDate extends Date {
  constructor(...args) { super(...(args.length ? args : [2026, 9, 20, 12])); }
}

// These hashes were captured BEFORE the maintenance refactor. CSS/layout and browser
// interaction checks complement this test; HTML equality alone is not visual equality.
test("rendered HTML preserves the pre-refactor pages and publication details", async () => {
  const load = createLoader({ globals: { Date: FixedDate } });
  const { PUBLICATIONS } = load("lib/data");
  const { decodeFortune, F_RANKS, F_SCENARIOS, F_UMA, F_ITEMS, messagesFor } = load("lib/fortune-data");
  const snapshots = {};
  const capture = (name, component, props = {}) => {
    snapshots[name] = createHash("sha256").update(renderToStaticMarkup(createElement(component, props))).digest("hex");
  };
  capture("home/pc", load("components/pc/PcApp").default);
  capture("home/mobile", load("components/lab/MApp").default);
  capture("home/ssr-both", load("components/Site").default);
  for (const [folder, component] of [["pc", "Experience"], ["lab", "MExperience"]]) {
    const Detail = load(`components/${folder}/${component}`)[component];
    PUBLICATIONS.forEach((pub, index) => capture(`detail/${folder}/${pub.id}`, Detail, {
      pub, index, total: PUBLICATIONS.length, onClose() {}, onNav() {},
    }));
  }
  const { FortuneApp, SharedFortune } = load("components/fortune/Fortune");
  capture("fortune/initial", FortuneApp);
  const result = (rank, item, uma, scenario, msg = 0) => decodeFortune(`20261020-${rank}-${item}-${uma}-${scenario}-${msg}`);
  F_RANKS.forEach((_, i) => capture(`fortune/rank/${i}`, SharedFortune, { res: result(i, 0, 0, 0) }));
  F_SCENARIOS.forEach((_, i) => capture(`fortune/scenario/${i}`, SharedFortune, { res: result(0, 0, 0, i) }));
  F_UMA.forEach((_, i) => capture(`fortune/uma/${i}`, SharedFortune, { res: result(0, 0, i, 0) }));
  F_ITEMS.forEach((_, i) => capture(`fortune/item/${i}`, SharedFortune, { res: result(0, i, 0, 0) }));
  F_RANKS.forEach((rank, i) => messagesFor(rank).forEach((_, m) => capture(`fortune/message/${i}/${m}`, SharedFortune, { res: result(i, 0, 0, 0, m) })));
  const fixture = new URL("./fixtures/render-sha256.json", import.meta.url);
  // Deliberate opt-in only, after reviewing intentional UI changes.
  if (process.env.UPDATE_RENDER_SNAPSHOTS === "1") {
    mkdirSync(new URL("./fixtures/", import.meta.url), { recursive: true });
    writeFileSync(fixture, JSON.stringify(snapshots, null, 2) + "\n");
  }
  assert.deepEqual(snapshots, JSON.parse(readFileSync(fixture, "utf8")));
});
