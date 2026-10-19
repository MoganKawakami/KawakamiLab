/* data.ts — publications, profile facets and event archive */

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
  tags: string[];
  desc: string;
  descJp: string;
  previews: string[];
};

export const PUBLICATIONS: Publication[] = [
  {
    id: "chroma", title: "CHROMA", jp: "彩光", year: "2024", ratio: 1.42,
    type: "Art Book", price: "¥2,400", priceJp: "頒布価格",
    event: "COMITIA 148", date: "2024.05.05", format: "A4 / 64P / Full Color",
    from: "#5fc8ff", to: "#2563EB",
    tags: ["Original", "Illustration", "Full-Color", "A4"],
    desc: "An original illustration collection exploring light as material — refraction, halation, and the chromatic edges where color becomes form.",
    descJp: "光を素材として捉えたオリジナルイラスト集。屈折、ハレーション、色が形になる瞬間の彩りを収録した一冊。",
    previews: ["PLATE 01", "PLATE 02", "PLATE 03"],
  },
  {
    id: "neon", title: "NEON GARDEN", jp: "電子庭園", year: "2023", ratio: 1.3,
    type: "Illustration", price: "¥1,800", priceJp: "頒布価格",
    event: "Comic Market 103", date: "2023.12.30", format: "B5 / 48P / Full Color",
    from: "#3bd6e6", to: "#1f7fe0",
    tags: ["Original", "Digital", "B5"],
    desc: "A botanical garden rendered in circuitry and bioluminescence — where organic growth meets synthetic light.",
    descJp: "回路と発光で描いた植物園。有機的な成長と人工の光が交わる、電子の庭の記録。",
    previews: ["FLORA A", "FLORA B", "FLORA C"],
  },
  {
    id: "proto", title: "PROTOTYPE 0", jp: "試作零号", year: "2024", ratio: 1.7,
    type: "Concept / Sketch", price: "¥1,500", priceJp: "頒布価格",
    event: "COMITIA 150", date: "2024.11.24", format: "A5 / 80P / Mono",
    from: "#7dd3fc", to: "#0ea5e9",
    tags: ["Concept", "Sketch", "Process", "A5"],
    desc: "The lab notebook — rough thumbnails, line studies, and the discarded iterations behind the finished works.",
    descJp: "研究室のノート。ラフ、線の習作、完成作の裏側で捨てられた試行錯誤を綴じた一冊。",
    previews: ["STUDY 01", "STUDY 02", "STUDY 03"],
  },
  {
    id: "lumina", title: "LUMINA", jp: "光環", year: "2023", ratio: 1.45,
    type: "Art Book", price: "¥2,800", priceJp: "頒布価格",
    event: "COMITIA 146", date: "2023.09.03", format: "A4 / 72P / Hardcover",
    from: "#67e8f9", to: "#2563EB",
    tags: ["Original", "Hardcover", "Premium"],
    desc: "A hardcover anthology of luminous portraiture — figures wrapped in coronas of engineered light.",
    descJp: "発光するポートレイトのハードカバー作品集。設計された光の輪をまとう人物たちを収録。",
    previews: ["HALO 01", "HALO 02", "HALO 03"],
  },
  {
    id: "signal", title: "SIGNAL", jp: "信号", year: "2022", ratio: 1.28,
    type: "Fan Art", price: "¥1,600", priceJp: "頒布価格",
    event: "Comic Market 101", date: "2022.12.31", format: "B5 / 40P / Full Color",
    from: "#38BDF8", to: "#1e40af",
    tags: ["Fan Art", "Tribute", "B5"],
    desc: "A tribute collection — favorite characters re-imagined through the lab's chromatic lens.",
    descJp: "敬愛するキャラクターたちを、ラボの色彩で再解釈したトリビュート作品集。",
    previews: ["FRAME A", "FRAME B", "FRAME C"],
  },
  {
    id: "halation", title: "HALATION", jp: "ハレーション", year: "2025", ratio: 1.6,
    type: "Upcoming", price: "TBA", priceJp: "予価",
    event: "COMITIA 152", date: "2025.08.17", format: "A4 / TBA",
    from: "#a5f3fc", to: "#0284c7", upcoming: true,
    tags: ["Original", "Upcoming", "2025"],
    desc: "The next research cycle — an overexposed dreamscape pushing the lab's light studies to their bright limit.",
    descJp: "次の研究サイクル。露光オーバーの夢景色で、ラボの光の探究を限界の明るさまで押し進める新作。",
    previews: ["TEASER 01", "TEASER 02", "TEASER 03"],
  },
];

export const LINKS = [
  { en: "About", jp: "概要", id: "about" },
  { en: "Profile", jp: "主宰", id: "profile" },
  { en: "Publications", jp: "刊行物", id: "publications" },
  { en: "Events", jp: "開催情報", id: "events" },
  { en: "Contact", jp: "連絡先", id: "contact" },
];

export type Facet = {
  key: string;
  label: string;
  jp: string;
  rows?: { dt: string; dd: string; jp?: boolean }[];
  chips?: string[];
  favs?: { name: string; code: string; from: string; to: string }[];
  quote?: string;
};

export const PROFILE_FACETS: Facet[] = [
  { key: "basics", label: "Basics", jp: "基本情報", rows: [
    { dt: "年齢 / Age", dd: "20代前半", jp: true },
    { dt: "性別 / Gender", dd: "男性", jp: true },
    { dt: "居住地 / Based in", dd: "日本, 愛知", jp: true },
    { dt: "活動開始 / Since", dd: "2019" },
  ] },
  { key: "hobbies", label: "Hobbies", jp: "趣味",
    chips: ["お絵描き", "デジタル作画", "レトロゲーム", "映画鑑賞", "カメラ・写真", "珈琲", "インディー音楽", "美術館めぐり"] },
  { key: "oshi", label: "Favorites", jp: "推しキャラ", favs: [
    { name: "推しキャラ ①", code: "OSHI 01", from: "#5fc8ff", to: "#2563EB" },
    { name: "推しキャラ ②", code: "OSHI 02", from: "#3bd6e6", to: "#1f7fe0" },
    { name: "推しキャラ ③", code: "OSHI 03", from: "#7dd3fc", to: "#0ea5e9" },
  ], quote: "光と色がきれいに映えるキャラクターが好きです。" },
  { key: "setup", label: "Studio", jp: "制作環境", rows: [
    { dt: "Hardware", dd: "iPad Pro / 液晶タブレット", jp: true },
    { dt: "Software", dd: "CLIP STUDIO PAINT" },
    { dt: "好きな色 / Color", dd: "Cyan ・ 水色", jp: true },
    { dt: "1日の作画 / Per day", dd: "3〜5時間", jp: true },
  ], quote: "「想像を、誰かの心に残る一枚に。」" },
];

export type PastEvent = {
  id: string;
  name: string;
  iso: string;
  venueJp: string;
  booth: string;
  note: string;
};

export const PAST_EVENTS: PastEvent[] = [
  { id: "cm108", name: "Comic Market 108", iso: "2026-08-30", venueJp: "東京ビッグサイト 東地区", booth: "東7 か-21a",
    note: "既刊フルラインナップ＋新作アクリルスタンド・ポストカードを頒布しました。" },
  { id: "comitia152", name: "COMITIA 152", iso: "2026-08-17", venueJp: "東京ビッグサイト 西1・2ホール", booth: "あ-12b",
    note: "新刊『HALATION / ハレーション』を頒布しました。ご来場ありがとうございました。" },
  { id: "comitia151", name: "COMITIA 151", iso: "2026-05-05", venueJp: "東京ビッグサイト 西ホール", booth: "き-08a",
    note: "『CHROMA / 彩光』再版と新作ポストカードを頒布しました。" },
  { id: "cm107", name: "Comic Market 107", iso: "2025-12-30", venueJp: "東京ビッグサイト 東地区", booth: "東5 ね-33b",
    note: "冬の新刊とラフ集『PROTOTYPE 0』を頒布しました。" },
  { id: "comitia150", name: "COMITIA 150", iso: "2025-11-24", venueJp: "東京ビッグサイト 西ホール", booth: "す-19a",
    note: "『試作零号 / PROTOTYPE 0』初頒布。たくさんの方に手に取っていただきました。" },
];

