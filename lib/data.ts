/* data.ts — publications, profile facets and event archive (shared by the PC and phone layouts) */

export type Publication = {
  id: string;
  title: string;
  jp: string;
  year: string;
  ratio: number;
  type: string;
  price: string;
  priceJp: string;
  event: string;
  date: string;
  format: string;
  from: string;
  to: string;
  upcoming?: boolean;
  /* secret: not announced yet — every field shows "????" and the cover reads `cover` */
  secret?: boolean;
  cover?: string;
  descLabel: string;
  desc: string;
  descJp: string;
  previews: string[];
};

const Q = "????";

function secret(id: string, ratio: number, from: string, to: string): Publication {
  return {
    id, ratio, from, to, secret: true, cover: "Coming soon...",
    title: Q, jp: Q, year: Q, type: Q, price: Q, priceJp: Q,
    event: Q, date: Q, format: Q, desc: Q, descJp: Q, descLabel: Q,
    previews: [Q, Q, Q],
  };
}

export const PUBLICATIONS: Publication[] = [
  {
    id: "futurepast", title: "Future & Past", jp: "", year: "2025", ratio: 1.42,
    type: "漫画", price: "¥500", priceJp: "頒布価格",
    event: "C106", date: "2025/8/16", format: "B5 / 24P / モノクロ / 漫画",
    from: "#5fc8ff", to: "#2563EB",
    descLabel: "あらすじ / Synopsis",
    descJp: "ジャングルポケットの走りを見て現役復帰を決めたアグネスタキオン。しかし、ブランクが簡単に戻るはずもなく、あの時の走りを取り戻せずに苦しみ、走る意味を見出せずにいる。そこにフジキセキが現れて───。",
    desc: "Inspired by Jungle Pocket's running, Agnes Tachyon decides to return to racing. But a long break doesn't simply go away. Unable to recapture the stride she once had, she struggles and can no longer find a reason to run. Then Fuji Kiseki appears...",
    previews: ["PAGE 01", "PAGE 02", "PAGE 03"],
  },
  {
    id: "tachyon1", title: "ちょ、タキオンさん！因子研究してください！ vol.1", jp: "", year: "2025", ratio: 1.3,
    type: "イラスト集", price: "¥500", priceJp: "頒布価格",
    event: "C107", date: "2025/12/30", format: "B5 / 20P / フルカラー\n/ イラスト集",
    from: "#3bd6e6", to: "#1f7fe0",
    descLabel: "内容 / Contents",
    descJp: "KAWAKAMI Lab. 初のアグネスタキオンが主役のイラスト集！",
    desc: "KAWAKAMI Lab.'s first illustration collection starring Agnes Tachyon!",
    previews: ["PLATE 01", "PLATE 02", "PLATE 03"],
  },
  {
    id: "tachyon2", title: "ちょ、タキオンさん！因子研究してください！ vol.2", jp: "", year: "2026", ratio: 1.42,
    type: "イラスト集&短編集", price: "¥500", priceJp: "頒布価格",
    event: "C108", date: "2026/8/15", format: "B5 / 16P / フルカラー / イラスト集&短編集",
    from: "#7dd3fc", to: "#0ea5e9",
    descLabel: "内容 / Contents",
    descJp: "アグネスタキオン主役イラスト集の第２弾！今回のテーマは水着！スピードシンボリ、フェノーメノ、フォーエバーヤングも登場！",
    desc: "The second illustration collection starring Agnes Tachyon! This time the theme is swimsuits! Speed Symboli, Fenomeno, and Forever Young also appear!",
    previews: ["PLATE 01", "PLATE 02", "PLATE 03"],
  },
  secret("secret1", 1.45, "#67e8f9", "#2563EB"),
  secret("secret2", 1.28, "#38BDF8", "#1e40af"),
  secret("secret3", 1.6, "#a5f3fc", "#0284c7"),
];

export const LINKS = [
  { en: "About", jp: "概要", id: "about" },
  { en: "Profile", jp: "サークル主", id: "profile" },
  { en: "Publications", jp: "刊行物", id: "publications" },
  { en: "Events", jp: "参加イベント", id: "events" },
  { en: "Contact", jp: "連絡先", id: "contact" },
];

export const SOCIAL = {
  x: "https://x.com/Mogan_Kawakami",
  pixiv: "https://www.pixiv.net/users/110552199",
};

export type Fav = { name: string; code: string; from: string; to: string };

export type Facet = {
  key: string;
  label: string;
  jp: string;
  rows?: { dt: string; dd: string; jp?: boolean }[];
  chips?: string[];
  favs?: Fav[];
  quote?: string;
};

export const PROFILE_FACETS: Facet[] = [
  { key: "basics", label: "Basics", jp: "基本情報", rows: [
    { dt: "年齢 / Age", dd: "20代前半", jp: true },
    { dt: "性別 / Gender", dd: "男性", jp: true },
    { dt: "居住地 / Based in", dd: "日本, 愛知", jp: true },
    { dt: "活動開始 / Since", dd: "2025" },
  ] },
  { key: "hobbies", label: "Hobbies", jp: "趣味",
    chips: ["お絵描き", "デジタル作画", "ゲーム", "映画鑑賞", "アニメ鑑賞", "美術館めぐり"] },
  { key: "oshi", label: "Favorites", jp: "推しキャラ", favs: [
    { name: "アグネスタキオン", code: "OSHI 01", from: "#5fc8ff", to: "#2563EB" },
    { name: "フジキセキ", code: "OSHI 02", from: "#3bd6e6", to: "#1f7fe0" },
    { name: "カツラギエース", code: "OSHI 03", from: "#7dd3fc", to: "#0ea5e9" },
    { name: "フォーエバーヤング", code: "OSHI 04", from: "#67e8f9", to: "#2563EB" },
    { name: "エアシャカール", code: "OSHI 05", from: "#38BDF8", to: "#1e40af" },
    { name: "シュヴァルグラン", code: "OSHI 06", from: "#a5f3fc", to: "#0284c7" },
  ], quote: "推し最高" },
  { key: "setup", label: "Studio", jp: "制作環境", rows: [
    { dt: "Hardware", dd: "iPad Pro", jp: true },
    { dt: "Software", dd: "CLIP STUDIO PAINT" },
    { dt: "好きな色 / Color", dd: "Cyan ・ 水色", jp: true },
    { dt: "1日の作画 / Per day", dd: "3〜5時間", jp: true },
  ], quote: "「新時代の扉で脳みそを焼かれました。」" },
];

export type PastEvent = {
  id: string;
  name: string;
  jp: string;
  iso: string;
  venueJp: string;
  booth?: string;
  note?: string;
  role?: string;
};

/* oldest first — the last entry is the latest */
export const PAST_EVENTS: PastEvent[] = [
  { id: "cm106", name: "Comic Market 106", jp: "コミックマーケット106", iso: "2025-08-16", venueJp: "東京ビッグサイト", booth: "東7 か-18b",
    note: "新刊『Future & Past』" },
  { id: "cm107", name: "Comic Market 107", jp: "コミックマーケット107", iso: "2025-12-30", venueJp: "東京ビッグサイト", booth: "東7 K-18b",
    note: "新刊『ちょ、タキオンさん！因子研究してください！ vol.1』" },
  { id: "urc03", name: "URC03", jp: "", iso: "2026-06-28", venueJp: "東京流通センター(TRC) 第一展示場全ホール", booth: "7枠38番" },
  { id: "cm108", name: "Comic Market 108", jp: "コミックマーケット108", iso: "2026-08-15", venueJp: "東京ビッグサイト", booth: "東3 フ-07b",
    note: "新刊『ちょ、タキオンさん！因子研究してください！ vol.2』" },
  { id: "spark21", name: "COMIC CITY SPARK 21", jp: "", iso: "2026-10-11", venueJp: "東京ビッグサイト",
    role: "売り子（お手伝い）として参加しました。" },
];

export const STATS = { publications: "3", established: "2025", events: "4" };
