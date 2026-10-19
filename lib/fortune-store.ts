/* fortune-store.ts — today's reading, kept in this browser (there are no accounts).
   One reading per day; it resets at local midnight because a record from another date is
   ignored. Clearing site data or a private window starts over — that's accepted. */
import { decodeFortune, todayYmd, type FortuneResult } from "./fortune-data";

export const FORTUNE_STORAGE_KEY = "lab-fortune:v1";

export type DayRecord = {
  ymd: string;        // the day this record belongs to
  code: string;       // current result (after any redraws)
  rerolls: number;    // training-pick redraws used today
  shown: number[];    // every training pick shown today — never offered again until tomorrow
};

/* Today's record and its decoded result, or null if there is none for today */
export function loadToday(today = todayYmd()): { rec: DayRecord; res: FortuneResult } | null {
  try {
    const rec = JSON.parse(localStorage.getItem(FORTUNE_STORAGE_KEY) || "null") as DayRecord | null;
    if (!rec || rec.ymd !== today || typeof rec.code !== "string") return null;
    const res = decodeFortune(rec.code);
    if (!res || res.ymd !== today) return null;
    const rerolls = Number.isInteger(rec.rerolls) && rec.rerolls >= 0 ? rec.rerolls : 0;
    const shown = Array.isArray(rec.shown) ? rec.shown.filter(Number.isInteger) : [];
    if (!shown.includes(res.umaIx)) shown.push(res.umaIx);
    return { rec: { ymd: today, code: rec.code, rerolls, shown }, res };
  } catch {
    return null;
  }
}

export function saveToday(rec: DayRecord) {
  try { localStorage.setItem(FORTUNE_STORAGE_KEY, JSON.stringify(rec)); } catch { /* storage unavailable: today's state lives in memory only */ }
}

export function clearRecord() {
  try { localStorage.removeItem(FORTUNE_STORAGE_KEY); } catch { /* ignore */ }
}

/* Milliseconds until the next local midnight */
export function msUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return next.getTime() - now.getTime();
}
