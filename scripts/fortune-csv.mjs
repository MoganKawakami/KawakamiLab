// fortune-csv.mjs — turns the fortune CSVs into lib/fortune-candidates.json.
// Runs before `npm run dev` and `npm run build`.
//   character.csv / scenario.csv / item.csv — "name" column
//   <rank>.csv (大吉.csv, 凶.csv, …)            — "comment" column: one-line messages for that rank
// Other columns are ignored.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
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

const LISTS = ["character.csv", "scenario.csv", "item.csv"];
const messages = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith(".csv") && !LISTS.includes(f))
    .sort()
    .map((f) => [f.slice(0, -4).normalize("NFC"), column(f, "comment")]),
);

const out = {
  uma: column("character.csv", "name"),
  scenarios: column("scenario.csv", "name"),
  items: column("item.csv", "name"),
  messages,
};
writeFileSync(join(root, "lib/fortune-candidates.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`fortune candidates: ${out.uma.length} uma, ${out.scenarios.length} scenarios, ${out.items.length} items`);
console.log(`fortune messages: ${Object.entries(messages).map(([k, v]) => `${k} ${v.length}`).join(", ")}`);
