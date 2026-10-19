// fortune-csv.mjs — turns the fortune CSVs into lib/fortune-candidates.json.
// Runs before `npm run dev` and `npm run build`.
//   character.csv / scenario.csv / item.csv — "name" column (character.csv may also have "name_en")
//   <rank>.csv (大吉.csv, 凶.csv, …)            — "comment" column: one-line messages for that rank
// Other columns are ignored.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Minimal CSV: handles quoted fields, "" escapes, CRLF and a BOM */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted field");
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function column(file, name) {
  const [header, ...rows] = parseCsv(readFileSync(join(root, file), "utf8"));
  const col = header.map((h) => h.trim()).indexOf(name);
  if (col < 0) throw new Error(`${file}: no "${name}" column in the header`);
  const list = rows.map((r) => (r[col] ?? "").trim()).filter(Boolean);
  if (!list.length) throw new Error(`${file}: no ${name} values found`);
  return list;
}

/* Characters: Japanese name plus the optional English name, kept row-aligned so the
   index used in share URLs points at the same character in both lists */
function characters(file) {
  const [header, ...rows] = parseCsv(readFileSync(join(root, file), "utf8"));
  const cols = header.map((h) => h.trim());
  const ja = cols.indexOf("name"), en = cols.indexOf("name_en");
  if (ja < 0) throw new Error(`${file}: no "name" column in the header`);
  const kept = rows.filter((r) => (r[ja] ?? "").trim());
  if (!kept.length) throw new Error(`${file}: no names found`);
  return { ja: kept.map((r) => r[ja].trim()), en: kept.map((r) => (en < 0 ? "" : (r[en] ?? "").trim())) };
}

const LISTS = ["character.csv", "scenario.csv", "item.csv"];
const messages = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith(".csv") && !LISTS.includes(f))
    .sort()
    .map((f) => [f.slice(0, -4).normalize("NFC"), column(f, "comment")]),
);

const uma = characters("character.csv");
const out = {
  uma: uma.ja,
  umaEn: uma.en,
  scenarios: column("scenario.csv", "name"),
  items: column("item.csv", "name"),
  messages,
};
const output = join(root, "lib/fortune-candidates.json");
const serialized = JSON.stringify(out, null, 2) + "\n";
if (existsSync(output)) {
  const previous = JSON.parse(readFileSync(output, "utf8"));
  const preserve = (label, before, after) => {
    if (before.some((value, index) => after?.[index] !== value)) {
      throw new Error(`${label}: existing entries must stay in place to preserve shared URLs. Append new entries only.`);
    }
  };
  for (const key of ["uma", "items", "scenarios"]) preserve(key, previous[key], out[key]);
  for (const [rank, rows] of Object.entries(previous.messages)) preserve(rank, rows, out.messages[rank]);
}
if (process.argv.includes("--check")) {
  if (!existsSync(output) || readFileSync(output, "utf8") !== serialized) {
    throw new Error("Generated candidates are stale. Run npm run data:generate.");
  }
} else writeFileSync(output, serialized);
console.log(`fortune candidates: ${out.uma.length} uma (${out.umaEn.filter(Boolean).length} with English names), ${out.scenarios.length} scenarios, ${out.items.length} items`);
console.log(`fortune messages: ${Object.entries(messages).map(([k, v]) => `${k} ${v.length}`).join(", ")}`);
