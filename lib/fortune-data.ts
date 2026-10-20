/* fortune-data.ts — Lab. Fortune candidates, the random draw, and share-code encode/decode.
   Shared by the fortune page, the result page and the share-card image.

   Training picks, scenarios and lucky items come from character.csv / scenario.csv /
   item.csv, and each rank's one-line messages from <rank>.csv (大吉.csv, 凶.csv, …) —
   all turned into fortune-candidates.json by scripts/fortune-csv.mjs.
   Share URLs store indexes into these lists, so add new rows at the end — reordering
   or deleting rows changes what older shared links show. */
import candidates from "./fortune-candidates.json";

/* Index order is part of the share code: append only. 吉 is kept (weight 0) so links
   shared before the odds changed still resolve. */
export const F_RANKS = ["大吉", "中吉", "小吉", "吉", "末吉", "大大吉", "凶"] as const;
export type FortuneRank = (typeof F_RANKS)[number];

/* Display-only translations; shared URLs continue to use the unchanged rank indexes.
   大大吉 uses our editorial translation, not a standardized fortune classification. */
export const F_RANK_EN: Readonly<Record<FortuneRank, string>> = {
  "大吉": "excellent luck",
  "吉": "good luck",
  "中吉": "moderately good luck",
  "小吉": "a little good luck",
  "末吉": "good luck to come",
  "凶": "bad luck",
  "大大吉": "exceptional luck",
};

/* Odds in percent; must add up to 100 */
const RANK_WEIGHTS: Readonly<Record<FortuneRank, number>> = {
  "大大吉": 3, "大吉": 7, "中吉": 25, "小吉": 35, "末吉": 25, "凶": 5, "吉": 0,
};

export const F_ITEMS: readonly string[] = candidates.items;
export const F_UMA: readonly string[] = candidates.uma;
/* English names, row-aligned with F_UMA ("" where the CSV has none) */
export const F_UMA_EN: readonly string[] = candidates.umaEn;
export const F_SCENARIOS: readonly string[] = candidates.scenarios;
/* Used for a rank that has no <rank>.csv */
const FALLBACK_MSGS = [
  "描きたいものを、迷わず描ける一日。ラフは勢いを大切に。",
  "小さな発見が作品のヒントに。メモを手元に置いておこう。",
  "焦らずじっくり。線を丁寧に引くほど良い結果に。",
  "推しへの気持ちがいつも以上に筆に乗る日。",
  "休憩も制作のうち。少し歩くとアイデアがまとまります。",
];

const RANK_MSGS: Readonly<Record<string, readonly string[]>> = candidates.messages;
export const messagesFor = (rank: string) => RANK_MSGS[rank] ?? FALLBACK_MSGS;

export const HASHTAG = "#今日の育成ウマ娘";
/* Hashtags appended to the X post (the share card image shows only HASHTAG) */
export const SHARE_HASHTAGS = [HASHTAG, "#Todays_Trainable_Umamusume"];

/* One reading per day per visitor; the training pick may be redrawn this many times that day */
export const MAX_REROLLS = 5;

export type FortuneResult = Readonly<{
  ymd: string;      // "20261019"
  date: string;     // "2026.10.19"
  rank: FortuneRank;
  rankEn: string;
  item: string;
  uma: string;
  umaEn: string;
  umaIx: number;    // index into F_UMA — redraws change only this
  scenario: string;
  msg: string;
  code: string;     // "{YYYYMMDD}-{rank}-{item}-{uma}-{scenario}-{msg}"
}>;

type Ix = [rank: number, item: number, uma: number, scenario: number];

export const dotted = (ymd: string) => `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`;

/* Links shared before messages were in the code have only five parts; give them a
   stable message from the rank's list */
// Freeze the historical list sizes: appending messages must not change old five-part links.
const LEGACY_MESSAGE_COUNTS: Record<string, number> = {
  "大吉": 35, "中吉": 125, "小吉": 175, "吉": 5, "末吉": 125, "大大吉": 15, "凶": 25,
};
function legacyMsgIndex(code: string, count: number) {
  let h = 0;
  for (const c of code) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % count;
}

function build(ymd: string, ix: Ix, msg: number): FortuneResult {
  const rank = F_RANKS[ix[0]];
  return {
    ymd, date: dotted(ymd),
    rank, rankEn: F_RANK_EN[rank], item: F_ITEMS[ix[1]], uma: F_UMA[ix[2]], umaEn: F_UMA_EN[ix[2]] ?? "", umaIx: ix[2], scenario: F_SCENARIOS[ix[3]],
    msg: messagesFor(rank)[msg],
    code: [ymd, ...ix, msg].join("-"),
  };
}

export function todayYmd(now = new Date()) {
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}

function pickRank(rand: () => number) {
  let roll = rand() * 100;
  for (let i = 0; i < F_RANKS.length; i++) {
    roll -= RANK_WEIGHTS[F_RANKS[i]];
    if (roll < 0) return i;
  }
  return F_RANKS.indexOf("小吉");
}

/* Every draw is independent: rank by the odds above, everything else — including the
   message from that rank's list — uniformly at random */
export function drawFortune(rand: () => number = Math.random): FortuneResult {
  const any = (list: readonly unknown[]) => Math.floor(rand() * list.length);
  const rank = pickRank(rand);
  return build(todayYmd(), [rank, any(F_ITEMS), any(F_UMA), any(F_SCENARIOS)], any(messagesFor(F_RANKS[rank])));
}

/* Returns null for anything that isn't a well-formed code with in-range indexes */
export function decodeFortune(code: string): FortuneResult | null {
  const m = /^(\d{8})-(\d+)-(\d+)-(\d+)-(\d+)(?:-(\d+))?$/.exec(code);
  if (!m) return null;
  const ymd = m[1];
  const year = Number(ymd.slice(0, 4)), mo = Number(ymd.slice(4, 6)), d = Number(ymd.slice(6, 8));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || mo < 1 || mo > 12 || d < 1 || d > days[mo - 1]) return null;
  const ix = [m[2], m[3], m[4], m[5]].map(Number) as Ix;
  const lists = [F_RANKS, F_ITEMS, F_UMA, F_SCENARIOS];
  if (ix.some((v, i) => v >= lists[i].length)) return null;
  const count = messagesFor(F_RANKS[ix[0]]).length;
  const msg = m[6] != null ? Number(m[6]) : legacyMsgIndex(code, Math.min(count, LEGACY_MESSAGE_COUNTS[F_RANKS[ix[0]]] ?? count));
  if (msg >= count) return null;
  return build(ymd, ix, msg);
}

/* Redraw only the training pick: same date, rank, item, scenario and message; the new pick is
   chosen uniformly from the characters not in `exclude` (everyone already shown today).
   Returns null when nobody is left. */
export function rerollUma(res: FortuneResult, exclude: readonly number[], rand: () => number = Math.random): FortuneResult | null {
  const [ymd, rank, item, , scenario, msg] = res.code.split("-");
  const taken = new Set(exclude);
  const pool = F_UMA.map((_, i) => i).filter((i) => !taken.has(i));
  if (!pool.length) return null;
  const uma = pool[Math.floor(rand() * pool.length)];
  return build(ymd, [Number(rank), Number(item), uma, Number(scenario)], Number(msg));
}

export const sharePath = (res: FortuneResult) => `/fortune/r/${res.code}`;

/* Whole post goes in `text` (no url/hashtags params) so the line breaks stay put */
export function shareText(res: FortuneResult, url: string) {
  return `今日の運勢は「${res.rank}」！\nラッキーアイテム：${res.item}\n育成ウマ娘：${res.uma}\nおすすめシナリオ：${res.scenario}\n\n${url}\n\n${SHARE_HASHTAGS.join(" ")}`;
}

export const intentUrl = (text: string) => "https://x.com/intent/post?text=" + encodeURIComponent(text);
