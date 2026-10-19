import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

// Compile in memory using the existing compiler; no generated test files or new runtime dependency.
const candidates = JSON.parse(readFileSync(new URL("../lib/fortune-candidates.json", import.meta.url)));
function load(file, dependencies, globals = {}) {
  const source = readFileSync(new URL(`../lib/${file}.ts`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const context = { exports: {}, require: (name) => dependencies[name], Date, Math, ...globals };
  vm.runInNewContext(code, context);
  return context.exports;
}
const f = load("fortune-data", { "./fortune-candidates.json": candidates });
const original = "20261019-0-0-0-0-0";

test("shared links preserve their values and legacy messages are stable", () => {
  const r = f.decodeFortune(original);
  assert.equal(r.rank, "大吉"); assert.equal(r.uma, "アーモンドアイ"); assert.equal(r.item, "ハンカチ");
  assert.equal(r.scenario, "新設！URAファイナルズ");
  assert.equal(f.decodeFortune(r.code).code, original);
  const legacy = f.decodeFortune("20261019-3-0-0-0");
  assert.equal(legacy.rank, "吉");
  assert.equal(f.decodeFortune(legacy.code).msg, legacy.msg);
});
test("calendar validation handles leap years and invalid indexes", () => {
  for (const date of ["20240229", "20000229", "20261231"]) assert(f.decodeFortune(`${date}-0-0-0-0-0`));
  for (const date of ["20260229", "19000229", "20260231", "20260431", "20260001", "00000101"]) assert.equal(f.decodeFortune(`${date}-0-0-0-0-0`), null);
  for (const code of ["bad", "20261019-7-0-0-0-0", "20261019-0-100-0-0-0", "20261019-0-0-135-0-0", "20261019-0-0-0-14-0", "20261019-0-0-0-0-35"]) assert.equal(f.decodeFortune(code), null);
});
test("rank probabilities and redraw invariants", () => {
  const counts = {};
  for (let i = 0; i < 100; i++) {
    let call = 0;
    const r = f.drawFortune(() => call++ === 0 ? (i + 0.5) / 100 : 0);
    counts[r.rank] = (counts[r.rank] ?? 0) + 1;
  }
  assert.deepEqual(counts, { "大吉": 7, "中吉": 25, "小吉": 35, "末吉": 25, "大大吉": 3, "凶": 5 });
  const first = f.decodeFortune(original), seen = [first.umaIx];
  let result = first;
  for (let i = 0; i < f.MAX_REROLLS; i++) {
    result = f.rerollUma(result, seen, () => 0);
    assert(!seen.includes(result.umaIx)); seen.push(result.umaIx);
    for (const key of ["ymd", "rank", "item", "scenario", "msg"]) assert.equal(result[key], first[key]);
  }
  assert.equal(f.rerollUma(first, candidates.uma.map((_, i) => i)), null);
});
test("storage tolerates corruption and unavailable storage; old days do not erase new records", () => {
  let value = null;
  const localStorage = { getItem: () => value, setItem: (_, v) => { value = v; }, removeItem: () => { value = null; } };
  const s = load("fortune-store", { "./fortune-data": f }, { localStorage });
  s.saveToday({ ymd: "20261019", code: original, rerolls: 2, shown: [0] });
  assert.equal(s.loadToday("20261019").rec.rerolls, 2);
  assert.equal(s.loadToday("20261020"), null);
  assert(value);
  value = "invalid"; assert.equal(s.loadToday("20261019"), null);
  localStorage.getItem = () => { throw Error("blocked"); };
  localStorage.setItem = () => { throw Error("blocked"); };
  assert.equal(s.loadToday(), null); assert.doesNotThrow(() => s.saveToday({}));
  assert.equal(s.msUntilMidnight(new Date(2026, 9, 19, 23, 59, 59)), 1000);
});

test("appending messages preserves legacy shared readings", () => {
  const updated = structuredClone(candidates);
  updated.messages["大吉"].push("追加コメント");
  const next = load("fortune-data", { "./fortune-candidates.json": updated });
  for (let item = 0; item < 100; item++) {
    const code = `20261019-0-${item}-0-0`;
    assert.equal(next.decodeFortune(code).msg, f.decodeFortune(code).msg);
  }
});

test("CSV generation rejects reorderings without overwriting the existing shared-link data", async () => {
  const { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync, readdirSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { spawnSync } = await import("node:child_process");
  const root = new URL("../", import.meta.url);
  const temp = mkdtempSync(join(tmpdir(), "lab-csv-test-"));
  try {
    mkdirSync(join(temp, "scripts")); mkdirSync(join(temp, "lib"));
    for (const name of readdirSync(root).filter((name) => name.endsWith(".csv"))) copyFileSync(new URL(name, root), join(temp, name));
    copyFileSync(new URL("scripts/fortune-csv.mjs", root), join(temp, "scripts/fortune-csv.mjs"));
    const output = join(temp, "lib/fortune-candidates.json");
    copyFileSync(new URL("lib/fortune-candidates.json", root), output);
    const run = () => spawnSync(process.execPath, [join(temp, "scripts/fortune-csv.mjs")], { encoding: "utf8" });
    assert.equal(run().status, 0);
    const before = readFileSync(output, "utf8");
    const csv = join(temp, "character.csv");
    const rows = readFileSync(csv, "utf8").split("\n");
    [rows[1], rows[2]] = [rows[2], rows[1]];
    writeFileSync(csv, rows.join("\n"));
    const rejected = run();
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /existing entries must stay in place/);
    assert.equal(readFileSync(output, "utf8"), before);
    [rows[1], rows[2]] = [rows[2], rows[1]];
    writeFileSync(csv, rows.join("\n").trimEnd() + "\n136,追加候補,Additional\n");
    assert.equal(run().status, 0);
    assert.equal(JSON.parse(readFileSync(output)).uma.length, 136);
  } finally { rmSync(temp, { recursive: true, force: true }); }
});
