/* fortune-data.ts — Lab. Fortune candidates, the daily draw, and share-code encode/decode.
   Shared by the fortune page, the result page and the share-card image.
   Share URLs store indexes into these arrays, so only ever append new candidates —
   reordering or removing would change the result behind old URLs. */

export const F_RANKS = ["大吉", "中吉", "小吉", "吉", "末吉"];
export const F_ITEMS = ["新しいペン", "スケッチブック", "温かい飲み物", "お気に入りの曲", "推しのアクスタ", "ノート"];
export const F_MSGS = [
  "描きたいものを、迷わず描ける一日。ラフは勢いを大切に。",
  "小さな発見が作品のヒントに。メモを手元に置いておこう。",
  "焦らずじっくり。線を丁寧に引くほど良い結果に。",
  "推しへの気持ちがいつも以上に筆に乗る日。",
  "休憩も制作のうち。少し歩くとアイデアがまとまります。",
];
/* 候補は後で実際の名前に差し替え */
export const F_UMA = ["育成ウマ娘 A", "育成ウマ娘 B", "育成ウマ娘 C", "育成ウマ娘 D", "育成ウマ娘 E", "育成ウマ娘 F"];
export const F_SCENARIOS = ["育成シナリオ A", "育成シナリオ B", "育成シナリオ C", "育成シナリオ D", "育成シナリオ E"];

export const HASHTAG = "#今日の育成ウマ娘";

export type FortuneResult = {
  ymd: string;      // "20261019"
  date: string;     // "2026.10.19"
  rank: string;
  item: string;
  uma: string;
  scenario: string;
  msg: string;
  code: string;     // "{YYYYMMDD}-{rank}-{item}-{uma}-{scenario}"
};

function seedRand(seed: string) {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const dotted = (ymd: string) => `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`;

/* One result per day: everything is seeded by the date (same draw order as the prototype) */
function draw(ymd: string) {
  const r = seedRand("fortune-" + dotted(ymd));
  const ix = (a: unknown[]) => Math.floor(r() * a.length);
  const rank = ix(F_RANKS), item = ix(F_ITEMS), msg = ix(F_MSGS), uma = ix(F_UMA), scenario = ix(F_SCENARIOS);
  return { ix: [rank, item, uma, scenario] as [number, number, number, number], msg: F_MSGS[msg] };
}

/* The message isn't in the code; it follows from the date, so a shared page shows the same one */
function build(ymd: string, ix: [number, number, number, number]): FortuneResult {
  return {
    ymd, date: dotted(ymd),
    rank: F_RANKS[ix[0]], item: F_ITEMS[ix[1]], uma: F_UMA[ix[2]], scenario: F_SCENARIOS[ix[3]],
    msg: draw(ymd).msg,
    code: [ymd, ...ix].join("-"),
  };
}

export function todayYmd(now = new Date()) {
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}

export function drawFortune(ymd = todayYmd()): FortuneResult {
  return build(ymd, draw(ymd).ix);
}

/* Returns null for anything that isn't a well-formed code with in-range indexes */
export function decodeFortune(code: string): FortuneResult | null {
  const m = /^(\d{8})-(\d+)-(\d+)-(\d+)-(\d+)$/.exec(code);
  if (!m) return null;
  const ymd = m[1];
  const mo = Number(ymd.slice(4, 6)), d = Number(ymd.slice(6, 8));
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const ix = [m[2], m[3], m[4], m[5]].map(Number) as [number, number, number, number];
  const lists = [F_RANKS, F_ITEMS, F_UMA, F_SCENARIOS];
  if (ix.some((v, i) => v >= lists[i].length)) return null;
  return build(ymd, ix);
}

export const sharePath = (res: FortuneResult) => `/fortune/r/${res.code}`;

/* Whole post goes in `text` (no url/hashtags params) so the line breaks stay put */
export function shareText(res: FortuneResult, url: string) {
  return `今日の運勢は「${res.rank}」！\nラッキーアイテム：${res.item}\n育成ウマ娘：${res.uma}\nおすすめシナリオ：${res.scenario}\n\n${url}\n\n${HASHTAG}`;
}

export const intentUrl = (text: string) => "https://x.com/intent/post?text=" + encodeURIComponent(text);
